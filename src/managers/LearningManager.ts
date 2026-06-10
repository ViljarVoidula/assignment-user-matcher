/**
 * LearningManager - Redis-backed contextual bandit for adaptive matchmaking.
 *
 * Maintains an online linear reward model: each feature has a learned weight
 * stored in a Redis hash. Predictions are dot products of the feature vector
 * with the learned weights; updates use stochastic gradient descent on the
 * observed reward for each assignment outcome.
 *
 * The model only re-ranks candidates that already passed the hard matching
 * rules (tags/weights, CIDR, skill thresholds) - it never makes an ineligible
 * assignment eligible.
 */
import type { RedisClientType, LearningFeatures, LearningOutcome, LearningRewards, LearningDecisionRecord, LearningEpisodeRecord, LearningSignals, LearningSample, LearningStats } from '../types/matcher';
import type { KeyBuilders } from '../utils/keys';

export const DEFAULT_LEARNING_REWARDS: LearningRewards = {
    accept: 0.3,
    complete: 1,
    reject: -0.6,
    expire: -0.3,
    fail: -0.8,
};

/** Outcomes that end an assignment's learning episode (decision record is removed) */
const TERMINAL_OUTCOMES: ReadonlySet<LearningOutcome> = new Set(['complete', 'reject', 'expire', 'fail']);

export interface LearningManagerOptions {
    /** SGD learning rate (default: 0.1) */
    learningRate?: number;
    /** Epsilon-greedy exploration rate (default: 0.05) */
    explorationRate?: number;
    /** Shadow mode: learn and record but never alter ranking (default: false) */
    shadowMode?: boolean;
    /** Multiplier applied to predicted reward when re-ranking (default: 1) */
    boostFactor?: number;
    /** Reward overrides merged with defaults */
    rewards?: Partial<LearningRewards>;
    /** TTL for stored decision contexts in ms (default: 7 days) */
    decisionTtlMs?: number;
    /** Weights applied to named external feedback signals (default weight: 1) */
    signalWeights?: Record<string, number>;
    /** TTL for archived episodes awaiting external feedback in ms (default: 7 days) */
    feedbackTtlMs?: number;
}

export class LearningManager {
    readonly learningRate: number;
    readonly explorationRate: number;
    readonly shadowMode: boolean;
    readonly boostFactor: number;
    readonly rewards: LearningRewards;
    readonly decisionTtlMs: number;
    readonly signalWeights: Record<string, number>;
    readonly feedbackTtlMs: number;

    constructor(
        private redisClient: RedisClientType,
        private keys: KeyBuilders,
        options?: LearningManagerOptions,
    ) {
        this.learningRate = options?.learningRate ?? 0.1;
        this.explorationRate = options?.explorationRate ?? 0.05;
        this.shadowMode = options?.shadowMode ?? false;
        this.boostFactor = options?.boostFactor ?? 1;
        this.rewards = { ...DEFAULT_LEARNING_REWARDS, ...options?.rewards };
        this.decisionTtlMs = options?.decisionTtlMs ?? 604800000;
        this.signalWeights = options?.signalWeights ?? {};
        this.feedbackTtlMs = options?.feedbackTtlMs ?? 604800000;
    }

    /** Load the full model weights hash from Redis */
    async getModel(): Promise<Record<string, string>> {
        return this.redisClient.hGetAll(this.keys.learningModel());
    }

    /** Predict expected reward for a feature vector against given model weights */
    predict(features: LearningFeatures, weights: Record<string, string | number>): number {
        let sum = 0;
        for (const [feature, value] of Object.entries(features)) {
            const w = Number(weights[feature]);
            if (!Number.isNaN(w) && w !== 0) sum += w * value;
        }
        return sum;
    }

    /** Epsilon-greedy exploration check */
    shouldExplore(): boolean {
        return this.explorationRate > 0 && Math.random() < this.explorationRate;
    }

    /**
     * Persist the decision context for an assignment so the eventual outcome
     * can be attributed back to the features that drove the match.
     */
    async recordDecision(
        userId: string,
        assignmentId: string,
        features: LearningFeatures,
        predictedReward: number,
    ): Promise<void> {
        const record: LearningDecisionRecord = {
            userId,
            assignmentId,
            features,
            predictedReward,
            timestamp: Date.now(),
        };
        const multi = this.redisClient.multi();
        multi.set(this.keys.learningDecision(assignmentId), JSON.stringify(record), {
            PX: this.decisionTtlMs,
        });
        multi.hIncrBy(this.keys.learningStats(), 'decisions', 1);
        await multi.exec();
    }

    /** Fetch a stored decision record, or null when absent/expired */
    async getDecision(assignmentId: string): Promise<LearningDecisionRecord | null> {
        const json = await this.redisClient.get(this.keys.learningDecision(assignmentId));
        if (!json) return null;
        try {
            return JSON.parse(json);
        } catch {
            return null;
        }
    }

    /**
     * Apply a lifecycle outcome as a reward update.
     * Terminal outcomes archive the decision as an episode (with TTL) so late
     * external feedback can still be attributed to the original features.
     * Returns false if no decision context exists for the assignment.
     */
    async applyOutcome(assignmentId: string, outcome: LearningOutcome): Promise<boolean> {
        return this.applyReward(assignmentId, this.rewards[outcome], TERMINAL_OUTCOMES.has(outcome), outcome);
    }

    /**
     * Apply a manually chosen reward (terminal: removes the decision record).
     * Enables external reward shaping beyond the built-in lifecycle outcomes.
     */
    async recordReward(assignmentId: string, reward: number): Promise<boolean> {
        return this.applyReward(assignmentId, reward, true);
    }

    private async applyReward(assignmentId: string, reward: number, terminal: boolean, outcome?: LearningOutcome): Promise<boolean> {
        const decision = await this.getDecision(assignmentId);
        if (!decision) return false;

        await this.updateModel(decision.features, reward);

        if (terminal) {
            // Archive as episode so external post-processing feedback can
            // still reach the model after the assignment is closed.
            const episode: LearningEpisodeRecord = {
                userId: decision.userId,
                assignmentId,
                features: decision.features,
                outcome,
                timestamp: Date.now(),
            };
            const multi = this.redisClient.multi();
            multi.set(this.keys.learningEpisode(assignmentId), JSON.stringify(episode), {
                PX: this.feedbackTtlMs,
            });
            multi.del(this.keys.learningDecision(assignmentId));
            await multi.exec();
        }
        return true;
    }

    /** Apply an SGD update for a single (features, reward) observation */
    private async updateModel(features: LearningFeatures, reward: number): Promise<void> {
        const weights = await this.getModel();
        const prediction = this.predict(features, weights);
        const error = reward - prediction;

        const multi = this.redisClient.multi();
        for (const [feature, value] of Object.entries(features)) {
            if (value === 0) continue;
            multi.hIncrByFloat(this.keys.learningModel(), feature, this.learningRate * error * value);
        }
        multi.hIncrBy(this.keys.learningStats(), 'rewards', 1);
        multi.hIncrByFloat(this.keys.learningStats(), 'totalReward', reward);
        await multi.exec();
    }

    /** Fetch an archived episode record, or null when absent/expired */
    async getEpisode(assignmentId: string): Promise<LearningEpisodeRecord | null> {
        const json = await this.redisClient.get(this.keys.learningEpisode(assignmentId));
        if (!json) return null;
        try {
            return JSON.parse(json);
        } catch {
            return null;
        }
    }

    /**
     * Apply named external feedback signals (e.g. { accuracy: 0.95 }) against
     * the live decision or the archived episode of an assignment.
     * Reward = sum(signalValue * signalWeight), default weight 1 per signal.
     * Returns false when no learning context exists for the assignment.
     */
    async recordFeedback(assignmentId: string, signals: LearningSignals): Promise<boolean> {
        const context = (await this.getDecision(assignmentId)) ?? (await this.getEpisode(assignmentId));
        if (!context) return false;

        let reward = 0;
        for (const [signal, value] of Object.entries(signals)) {
            const weight = this.signalWeights[signal] ?? 1;
            reward += value * weight;
        }

        await this.updateModel(context.features, reward);
        return true;
    }

    /**
     * Train the model directly with raw (features, reward) samples.
     * Enables offline/batch imports from external pipelines (data warehouses,
     * historical logs, post-processing jobs) without a live decision context.
     */
    async trainSamples(samples: LearningSample[]): Promise<number> {
        let applied = 0;
        for (const sample of samples) {
            await this.updateModel(sample.features, sample.reward);
            applied++;
        }
        return applied;
    }

    /** Aggregate learning statistics */
    async getStats(): Promise<LearningStats> {
        const raw = await this.redisClient.hGetAll(this.keys.learningStats());
        const decisions = Number(raw.decisions) || 0;
        const rewards = Number(raw.rewards) || 0;
        const totalReward = Number(raw.totalReward) || 0;
        return {
            decisions,
            rewards,
            totalReward,
            averageReward: rewards > 0 ? totalReward / rewards : 0,
        };
    }

    /** Reset model weights and statistics */
    async resetModel(): Promise<void> {
        const multi = this.redisClient.multi();
        multi.del(this.keys.learningModel());
        multi.del(this.keys.learningStats());
        await multi.exec();
    }
}
