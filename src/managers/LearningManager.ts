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
import type { RedisClientType, LearningFeatures, LearningOutcome, LearningRewards, LearningDecisionRecord, LearningEpisodeRecord, LearningSignals, LearningSample, LearningStats, LearningTagStat, AutoRoutingWeightsOptions } from '../types/matcher';
import type { KeyBuilders } from '../utils/keys';
import { synthesizeRoutingWeights } from '../learning/auto-weights';

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
    /** Track per-user, per-tag reward stats for automatic routing weights (default: false) */
    trackTagStats?: boolean;
    /** Tuning for automatic routing-weight synthesis */
    autoWeights?: AutoRoutingWeightsOptions;
}

export class LearningManager {
    readonly learningRate: number;
    readonly explorationRate: number;
    private _shadowMode: boolean;
    readonly boostFactor: number;
    readonly rewards: LearningRewards;
    readonly decisionTtlMs: number;
    readonly signalWeights: Record<string, number>;
    readonly feedbackTtlMs: number;
    readonly trackTagStats: boolean;
    readonly autoWeights: AutoRoutingWeightsOptions;

    constructor(
        private redisClient: RedisClientType,
        private keys: KeyBuilders,
        options?: LearningManagerOptions,
    ) {
        this.learningRate = options?.learningRate ?? 0.1;
        this.explorationRate = options?.explorationRate ?? 0.05;
        this._shadowMode = options?.shadowMode ?? false;
        this.boostFactor = options?.boostFactor ?? 1;
        this.rewards = { ...DEFAULT_LEARNING_REWARDS, ...options?.rewards };
        this.decisionTtlMs = options?.decisionTtlMs ?? 604800000;
        this.signalWeights = options?.signalWeights ?? {};
        this.feedbackTtlMs = options?.feedbackTtlMs ?? 604800000;
        this.trackTagStats = options?.trackTagStats ?? false;
        this.autoWeights = options?.autoWeights ?? {};
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

    /** Current shadow mode state (true: learn-only, false: affects ranking) */
    get shadowMode(): boolean {
        return this._shadowMode;
    }

    /**
     * Toggle shadow mode at runtime without resetting model/state.
     *
     * When enabled, the matcher still records decisions and learns rewards,
     * but predicted rewards do not influence ranking.
     */
    setShadowMode(enabled: boolean): void {
        this._shadowMode = enabled;
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
        tags?: string[],
    ): Promise<void> {
        const record: LearningDecisionRecord = {
            userId,
            assignmentId,
            features,
            predictedReward,
            tags,
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
        await this.updateTagStats(decision.userId, decision.tags, reward);

        if (terminal) {
            // Archive as episode so external post-processing feedback can
            // still reach the model after the assignment is closed.
            const episode: LearningEpisodeRecord = {
                userId: decision.userId,
                assignmentId,
                features: decision.features,
                outcome,
                tags: decision.tags,
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
        await this.updateTagStats(context.userId, context.tags, reward);
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

    /**
     * Update per-user, per-tag reward aggregates (count + reward sum).
     * Uses atomic hash increments only - O(tags) with no read-modify-write -
     * so high-throughput outcome streams scale without contention.
     */
    private async updateTagStats(userId: string, tags: string[] | undefined, reward: number): Promise<void> {
        if (!this.trackTagStats || !tags || tags.length === 0) return;
        const multi = this.redisClient.multi();
        for (const tag of tags) {
            if (!tag) continue;
            multi.hIncrBy(this.keys.learningUserTagCounts(userId), tag, 1);
            multi.hIncrByFloat(this.keys.learningUserTagRewards(userId), tag, reward);
        }
        multi.sAdd(this.keys.learningUsers(), userId);
        await multi.exec();
    }

    /** Per-user, per-tag reward statistics aggregated from observed outcomes */
    async getUserTagStats(userId: string): Promise<LearningTagStat[]> {
        const [counts, rewards] = await Promise.all([
            this.redisClient.hGetAll(this.keys.learningUserTagCounts(userId)),
            this.redisClient.hGetAll(this.keys.learningUserTagRewards(userId)),
        ]);
        return Object.entries(counts).map(([tag, rawCount]) => {
            const count = Number(rawCount) || 0;
            const rewardSum = Number(rewards[tag]) || 0;
            return { tag, count, rewardSum, meanReward: count > 0 ? rewardSum / count : 0 };
        });
    }

    /** Users that have accumulated tag reward statistics */
    async listTrackedUsers(): Promise<string[]> {
        return this.redisClient.sMembers(this.keys.learningUsers());
    }

    /**
     * Synthesize a routingWeights map for a user from learned tag statistics
     * (UCB1 policy: mean reward + exploration bonus, hard veto for bad tags).
     * Pure read + O(tags) computation; does not persist anything.
     *
     * @param existingWeights current routingWeights of the user; values are
     *   used as warm per-tag priors for under-sampled or unobserved tags
     *   instead of the flat `priorWeight`.
     */
    async getLearnedRoutingWeights(
        userId: string,
        knownTags?: string[],
        existingWeights?: Record<string, number>,
    ): Promise<Record<string, number>> {
        const stats = await this.getUserTagStats(userId);
        if (stats.length === 0 && (!knownTags || knownTags.length === 0)) return {};
        return synthesizeRoutingWeights(stats, this.autoWeights, knownTags, existingWeights);
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

    /** Reset model weights, statistics, and per-user tag statistics */
    async resetModel(): Promise<void> {
        const trackedUsers = await this.listTrackedUsers();
        const multi = this.redisClient.multi();
        multi.del(this.keys.learningModel());
        multi.del(this.keys.learningStats());
        for (const userId of trackedUsers) {
            multi.del(this.keys.learningUserTagCounts(userId));
            multi.del(this.keys.learningUserTagRewards(userId));
        }
        multi.del(this.keys.learningUsers());
        await multi.exec();
    }
}
