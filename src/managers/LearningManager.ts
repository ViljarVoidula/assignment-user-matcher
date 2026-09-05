/**
 * LearningManager - Redis-backed contextual bandit for adaptive matchmaking.
 *
 * Maintains an online linear reward model: each feature has a learned weight
 * stored in a Redis hash. Predictions are dot products of the feature vector
 * with the learned weights; updates are stochastic gradient steps on the
 * observed outcome of each *committed attempt*.
 *
 * The model only re-ranks candidates that already passed the hard matching
 * rules (tags/weights, CIDR, skill thresholds) - it never makes an ineligible
 * assignment eligible.
 *
 * Three invariants shape the storage layout:
 *
 * 1. **One decision per committed attempt.** Contexts are keyed by a unique
 *    `decisionId`, not by assignment id, and are written only for the worker
 *    who actually won the claim. An assignment that is rejected and rematched
 *    opens a second, independent attempt; feedback for the first can never
 *    reach the second.
 * 2. **Ingestion is idempotent.** The applied-event marker and all learning
 *    effects commit together after validation; failed preparations can retry
 *    without losing an event or counting its evidence twice.
 * 3. **Missing means unknown.** Absent quality feedback trains nothing; it is
 *    never a zero label.
 */
import type {
    RedisClientType,
    LearningFeatures,
    LearningOutcome,
    LearningRewards,
    LearningDecisionRecord,
    LearningEpisodeRecord,
    LearningSignals,
    LearningSample,
    LearningStats,
    LearningTagStat,
    LearningRewardTarget,
    LearningTargetsOptions,
    LearningPrediction,
    LearningRewardAccounting,
    LearningUpdateMode,
    LearningExplorationPolicy,
    LearningWorkerPerformance,
    AutoRoutingWeightsOptions,
    AutoWeightExplanation,
} from '../types/matcher';
import type { KeyBuilders } from '../utils/keys';
import { explainRoutingWeights } from '../learning/auto-weights';
import { prepareIngestion } from '../learning/atomic-ingestion';

export const DEFAULT_LEARNING_REWARDS: LearningRewards = {
    accept: 0.3,
    complete: 1,
    reject: -0.6,
    expire: -0.3,
    fail: -0.8,
};

/** Contract version of the decision records this build writes. */
export const LEARNING_FEATURE_VERSION = 2;

/** Outcomes that end an assignment's learning episode (decision record is removed) */
const TERMINAL_OUTCOMES: ReadonlySet<LearningOutcome> = new Set(['complete', 'reject', 'expire', 'fail']);

const DEFAULT_TARGETS: LearningRewardTarget[] = ['acceptance', 'successGivenAcceptance'];

/**
 * Batched decayed tag-outcome update. For each tag in ARGV (from index 4 on):
 * rescale the stored weight/reward/rewardSq/weightSq sums by the elapsed
 * half-life factor since that tag's last write, add the new observation at
 * full weight, and stamp the write time — an exponentially-weighted
 * aggregate, exact per observation.
 *
 * `weightSq` decays by f^2, not f: it is a sum of SQUARED weights, and
 * carrying it is what makes the Kish effective sample size
 * `sum(w)^2 / sum(w^2)` computable. Decaying it by f would leave the ratio
 * indistinguishable from the raw count.
 *
 * KEYS: counts, rewards, rewardSq, ts, weightSq, attempts.
 * ARGV: now (ms), halfLife (ms), reward, countAttempt, then the tags.
 */
const DECAYED_TAG_OUTCOME_LUA = `
local now = tonumber(ARGV[1])
local halfLife = tonumber(ARGV[2])
local reward = tonumber(ARGV[3])
local countAttempt = tonumber(ARGV[4])
for i = 5, #ARGV do
  local tag = ARGV[i]
  local ts = tonumber(redis.call('HGET', KEYS[4], tag))
  local f = 1
  if ts and halfLife > 0 and now > ts then f = 2 ^ (-(now - ts) / halfLife) end
  local count = (tonumber(redis.call('HGET', KEYS[1], tag)) or 0) * f + 1
  local sum = (tonumber(redis.call('HGET', KEYS[2], tag)) or 0) * f + reward
  local sq = (tonumber(redis.call('HGET', KEYS[3], tag)) or 0) * f + reward * reward
  local w2 = (tonumber(redis.call('HGET', KEYS[5], tag)) or 0) * f * f + 1
  redis.call('HSET', KEYS[1], tag, count)
  redis.call('HSET', KEYS[2], tag, sum)
  redis.call('HSET', KEYS[3], tag, sq)
  redis.call('HSET', KEYS[4], tag, now)
  redis.call('HSET', KEYS[5], tag, w2)
  if countAttempt == 1 then redis.call('HINCRBY', KEYS[6], tag, 1) end
end
return 1
`;

/**
 * Revise a per-tag contribution that was already written, without adding a
 * second observation: the count stays put and only the reward moments move.
 * Under decay the old contribution has itself faded since it was written, so
 * it is re-weighted by its own age (ARGV[3] = when it was written) before
 * being swapped out — subtracting it at full weight would over-correct.
 *
 * KEYS: counts, rewards, rewardSq, ts. ARGV: now, halfLife, writtenAt,
 * oldReward, newReward, then the tags.
 */
const DECAYED_TAG_REVISION_LUA = `
local now = tonumber(ARGV[1])
local halfLife = tonumber(ARGV[2])
local writtenAt = tonumber(ARGV[3])
local oldR = tonumber(ARGV[4])
local newR = tonumber(ARGV[5])
local w = 1
if halfLife > 0 and now > writtenAt then w = 2 ^ (-(now - writtenAt) / halfLife) end
for i = 6, #ARGV do
  local tag = ARGV[i]
  local ts = tonumber(redis.call('HGET', KEYS[4], tag))
  local f = 1
  if ts and halfLife > 0 and now > ts then f = 2 ^ (-(now - ts) / halfLife) end
  local count = (tonumber(redis.call('HGET', KEYS[1], tag)) or 0) * f
  local sum = (tonumber(redis.call('HGET', KEYS[2], tag)) or 0) * f + w * (newR - oldR)
  local sq = (tonumber(redis.call('HGET', KEYS[3], tag)) or 0) * f + w * (newR * newR - oldR * oldR)
  if sq < 0 then sq = 0 end
  redis.call('HSET', KEYS[1], tag, count)
  redis.call('HSET', KEYS[2], tag, sum)
  redis.call('HSET', KEYS[3], tag, sq)
  redis.call('HSET', KEYS[4], tag, now)
end
return 1
`;

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
    /** SGD update rule (default: 'normalized') */
    updateMode?: LearningUpdateMode;
    /** L2 regularization coefficient (default: 0) */
    l2?: number;
    /** Maximum L2 norm of a single update (default: 1) */
    maxUpdateNorm?: number;
    /** Absolute cap on a single learned weight (default: 100) */
    maxWeightMagnitude?: number;
    /** Per-tag evidence accounting (default: 'per-event') */
    rewardAccounting?: LearningRewardAccounting;
    /** Selection policy name recorded on decisions (default: 'jitter') */
    explorationPolicy?: LearningExplorationPolicy;
    /** Random source for exploration (default: Math.random) */
    rng?: () => number;
    /** Multi-target reward modelling (default: off) */
    targets?: LearningTargetsOptions;
    /** Maximum age of an event relative to its attempt in ms (default: feedbackTtlMs) */
    maxFeedbackAgeMs?: number;
    /** Reject a feedback signal whose magnitude exceeds this (default: 1e6) */
    maxSignalMagnitude?: number;
    /** Clamp computed rewards to this magnitude (default: 100) */
    maxRewardMagnitude?: number;
    /** Track per-worker performance aggregates for the richer feature set (default: false) */
    trackPerformance?: boolean;
    /** Shrinkage strength toward the team prior (default: 5) */
    performancePriorStrength?: number;
}

/** One committed attempt awaiting persistence. */
export interface LearningDecisionInput {
    decisionId: string;
    userId: string;
    assignmentId: string;
    features: LearningFeatures;
    predictedReward: number;
    components?: Partial<Record<LearningRewardTarget, number>>;
    tags?: string[];
    propensity?: number;
    policy?: LearningExplorationPolicy;
    candidateCount?: number;
}

/** Model weights for every configured target, loaded once per pass. */
export interface LearningModelSnapshot {
    generation: number;
    legacy: Record<string, string>;
    targets: Partial<Record<LearningRewardTarget, Record<string, string>>>;
}

/** Why an event was not applied. */
export type LearningRejectReason =
    | 'orphan'
    | 'duplicate'
    | 'stale'
    | 'superseded'
    | 'ambiguous'
    | 'invalid'
    | 'ownerMismatch';

export interface LearningApplyOptions {
    /** Explicit event id; when omitted the outcome name is the dedupe token */
    eventId?: string;
    /** Reject the event unless the attempt belongs to this worker */
    expectedUserId?: string;
    /**
     * The failure/expiry was a system fault, not the worker's. Under
     * multi-target modelling it produces no `successGivenAcceptance` label
     * unless `targets.systemFaultCountsAsFailure` is set.
     */
    systemFault?: boolean;
}

const clampFinite = (value: number, limit: number): number => Math.max(-limit, Math.min(limit, value));

const sigmoid = (z: number): number => 1 / (1 + Math.exp(-Math.max(-40, Math.min(40, z))));

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
    readonly updateMode: LearningUpdateMode;
    readonly l2: number;
    readonly maxUpdateNorm: number;
    readonly maxWeightMagnitude: number;
    readonly rewardAccounting: LearningRewardAccounting;
    readonly explorationPolicy: LearningExplorationPolicy;
    readonly rng: () => number;
    readonly targets?: LearningTargetsOptions;
    readonly activeTargets: LearningRewardTarget[];
    readonly maxFeedbackAgeMs: number;
    readonly maxSignalMagnitude: number;
    readonly maxRewardMagnitude: number;
    readonly trackPerformance: boolean;
    readonly performancePriorStrength: number;

    /** Monotonic suffix making decision ids unique within a process-millisecond. */
    private decisionSeq = 0;
    /** Short-lived cache of the model generation (a GET per outcome is wasteful). */
    private generationCache?: { value: number; readAt: number };

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
        this.updateMode = options?.updateMode ?? 'normalized';
        this.l2 = options?.l2 ?? 0;
        this.maxUpdateNorm = options?.maxUpdateNorm ?? 1;
        this.maxWeightMagnitude = options?.maxWeightMagnitude ?? 100;
        this.rewardAccounting = options?.rewardAccounting ?? 'per-event';
        this.explorationPolicy = options?.explorationPolicy ?? 'jitter';
        this.rng = options?.rng ?? Math.random;
        this.targets = options?.targets;
        this.activeTargets = options?.targets ? (options.targets.targets ?? DEFAULT_TARGETS) : [];
        this.maxFeedbackAgeMs = options?.maxFeedbackAgeMs ?? this.feedbackTtlMs;
        this.maxSignalMagnitude = options?.maxSignalMagnitude ?? 1e6;
        this.maxRewardMagnitude = options?.maxRewardMagnitude ?? 100;
        this.trackPerformance = options?.trackPerformance ?? false;
        this.performancePriorStrength = options?.performancePriorStrength ?? 5;
    }

    /** True when multi-target reward modelling is configured. */
    get multiTarget(): boolean {
        return this.activeTargets.length > 0;
    }

    // ------------------------------------------------------------------
    // Model access
    // ------------------------------------------------------------------

    /** Load the full legacy model weights hash from Redis */
    async getModel(): Promise<Record<string, string>> {
        return this.redisClient.hGetAll(this.keys.learningModel());
    }

    /** Load one target's model weights hash */
    async getTargetModel(target: LearningRewardTarget): Promise<Record<string, string>> {
        return this.redisClient.hGetAll(this.keys.learningTargetModel(target));
    }

    /**
     * Load every model needed for one matching pass in one batch, plus the
     * generation stamped onto the decisions this pass commits.
     */
    async loadModels(): Promise<LearningModelSnapshot> {
        const targetKeys = this.activeTargets;
        const [legacy, generation, ...targetHashes] = await Promise.all([
            this.getModel(),
            this.currentGeneration(),
            ...targetKeys.map((t) => this.getTargetModel(t)),
        ]);
        const targets: Partial<Record<LearningRewardTarget, Record<string, string>>> = {};
        targetKeys.forEach((t, i) => {
            targets[t] = targetHashes[i] as Record<string, string>;
        });
        return { generation: generation as number, legacy: legacy as Record<string, string>, targets };
    }

    /** Predict expected reward for a feature vector against given model weights */
    predict(features: LearningFeatures, weights: Record<string, string | number>): number {
        let sum = 0;
        for (const [feature, value] of Object.entries(features)) {
            const w = Number(weights[feature]);
            if (!Number.isNaN(w) && w !== 0) sum += w * value;
        }
        return Number.isFinite(sum) ? sum : 0;
    }

    /**
     * Score a candidate against a loaded snapshot.
     *
     * In multi-target mode the components are calibrated probabilities and
     * the utility is their configured combination — never presented as a
     * probability itself. In legacy mode the single model's raw prediction is
     * both the utility and the only component.
     */
    predictWith(snapshot: LearningModelSnapshot, features: LearningFeatures): LearningPrediction {
        if (!this.multiTarget) {
            return { utility: this.predict(features, snapshot.legacy), components: {} };
        }

        const components: Partial<Record<LearningRewardTarget, number>> = {};
        for (const target of this.activeTargets) {
            const weights = snapshot.targets[target] ?? {};
            const raw = this.predict(features, weights);
            components[target] = target === 'quality' ? Math.max(0, Math.min(1, raw)) : sigmoid(raw);
        }

        const hasAcceptance = this.activeTargets.includes('acceptance');
        const pAccept = hasAcceptance ? (components.acceptance ?? 0) : 1;
        const successWeight =
            this.targets?.successWeight ?? (this.activeTargets.includes('successGivenAcceptance') ? 1 : 0);
        const qualityWeight =
            this.targets?.qualityWeight ??
            (this.activeTargets.includes('quality') && !this.activeTargets.includes('successGivenAcceptance') ? 1 : 0);
        // With no conditional target configured, acceptance IS the objective —
        // defaulting its weight to 0 there would make the utility identically
        // zero and leave ranking with no learned signal at all.
        const acceptanceWeight = this.targets?.acceptanceWeight ?? (successWeight === 0 && qualityWeight === 0 ? 1 : 0);

        const conditional =
            successWeight * (components.successGivenAcceptance ?? 0) + qualityWeight * (components.quality ?? 0);
        const utility = acceptanceWeight * pAccept + pAccept * conditional;
        return { utility: Number.isFinite(utility) ? utility : 0, components };
    }

    /** Epsilon-greedy exploration check (legacy 'jitter' policy) */
    shouldExplore(): boolean {
        return this.explorationRate > 0 && this.rng() < this.explorationRate;
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

    // ------------------------------------------------------------------
    // Decisions (committed attempts)
    // ------------------------------------------------------------------

    /**
     * Mint an id for one committed attempt. Unique per process-millisecond;
     * the assignment id prefix keeps the key human-readable in Redis.
     */
    newDecisionId(assignmentId: string): string {
        this.decisionSeq = (this.decisionSeq + 1) % 0xffffff;
        return `${assignmentId}#${Date.now().toString(36)}${this.decisionSeq.toString(36)}${Math.floor(
            this.rng() * 0xffff,
        ).toString(36)}`;
    }

    /** Current model generation (cached for a second; a reset is rare) */
    async currentGeneration(): Promise<number> {
        const cached = this.generationCache;
        const now = Date.now();
        if (cached && now - cached.readAt < 1000) return cached.value;
        const raw = await this.redisClient.get(this.keys.learningGeneration());
        const value = Number(raw) || 0;
        this.generationCache = { value, readAt: now };
        return value;
    }

    /**
     * Persist the contexts of attempts that were actually committed.
     *
     * Called from the claim path with only the ids the worker won, so a
     * candidate that lost the race — to another worker in the same pass or to
     * another process — leaves no decision behind.
     */
    async recordDecisions(inputs: LearningDecisionInput[], generation?: number): Promise<void> {
        if (inputs.length === 0) return;
        const gen = generation ?? (await this.currentGeneration());
        const multi = this.redisClient.multi();
        this.queueDecisionWrites(multi, inputs, gen);
        await multi.exec();
    }

    /**
     * Queue the same writes onto a caller-owned transaction.
     *
     * The claim path uses this to put the decision context in the *same*
     * batch as the queued -> pending state change. A separate write after the
     * claim leaves a crash gap in which the worker owns the assignment but no
     * learning context exists for it, so its outcome would arrive orphaned.
     *
     * Takes an explicit generation (carried on the scoring snapshot) so it
     * stays synchronous and can be composed into an existing multi.
     */
    queueDecisionWrites(multi: ReturnType<RedisClientType['multi']>, inputs: LearningDecisionInput[], gen: number): void {
        if (inputs.length === 0) return;
        const now = Date.now();
        for (const input of inputs) {
            const record: LearningDecisionRecord = {
                decisionId: input.decisionId,
                userId: input.userId,
                assignmentId: input.assignmentId,
                features: input.features,
                predictedReward: input.predictedReward,
                components: input.components,
                tags: input.tags,
                propensity: input.propensity,
                policy: input.policy,
                candidateCount: input.candidateCount,
                featureVersion: LEARNING_FEATURE_VERSION,
                generation: gen,
                accruedReward: 0,
                timestamp: now,
            };
            multi.set(this.keys.learningDecision(input.decisionId), JSON.stringify(record), { PX: this.decisionTtlMs });
            multi.set(this.keys.learningDecisionPointer(input.assignmentId), input.decisionId, {
                PX: this.decisionTtlMs,
            });
        }
        multi.hIncrBy(this.keys.learningStats(), 'decisions', inputs.length);
    }

    /**
     * Persist one decision context.
     *
     * @deprecated Prefer {@link recordDecisions} from the claim path; this
     * single-record form exists for direct/manual integrations.
     */
    async recordDecision(
        userId: string,
        assignmentId: string,
        features: LearningFeatures,
        predictedReward: number,
        tags?: string[],
    ): Promise<string> {
        const decisionId = this.newDecisionId(assignmentId);
        await this.recordDecisions([{ decisionId, userId, assignmentId, features, predictedReward, tags }]);
        return decisionId;
    }

    /** Fetch the in-flight decision record for an assignment, or null */
    async getDecision(assignmentId: string): Promise<LearningDecisionRecord | null> {
        const decisionId = await this.redisClient.get(this.keys.learningDecisionPointer(assignmentId));
        if (!decisionId) return null;
        return this.getDecisionById(decisionId as string);
    }

    /** Fetch a decision record by attempt id, or null when absent/expired */
    async getDecisionById(decisionId: string): Promise<LearningDecisionRecord | null> {
        const json = await this.redisClient.get(this.keys.learningDecision(decisionId));
        if (!json) return null;
        try {
            return JSON.parse(json as string);
        } catch {
            return null;
        }
    }

    /** Fetch the most recently archived episode for an assignment, or null */
    async getEpisode(assignmentId: string): Promise<LearningEpisodeRecord | null> {
        const decisionId = await this.redisClient.get(this.keys.learningEpisodePointer(assignmentId));
        if (!decisionId) return null;
        return this.getEpisodeById(decisionId as string);
    }

    /** Fetch an archived episode by attempt id, or null when absent/expired */
    async getEpisodeById(decisionId: string): Promise<LearningEpisodeRecord | null> {
        const json = await this.redisClient.get(this.keys.learningEpisode(decisionId));
        if (!json) return null;
        try {
            return JSON.parse(json as string);
        } catch {
            return null;
        }
    }

    // ------------------------------------------------------------------
    // Outcome ingestion
    // ------------------------------------------------------------------

    /**
     * Apply a lifecycle outcome to the attempt currently in flight for an
     * assignment. Idempotent: a redelivered event applies once.
     *
     * Terminal outcomes archive the attempt as an episode (with TTL) so late
     * external feedback can still be attributed to the original features.
     * Returns false when the event was not applied, for any reason.
     */
    async applyOutcome(assignmentId: string, outcome: LearningOutcome, options?: LearningApplyOptions): Promise<boolean> {
        const eventKey = options?.eventId ? `event:${options.eventId}` : `outcome:${outcome}`;
        return this.ingest(assignmentId, {
            eventKey,
            reward: this.rewards[outcome],
            terminal: TERMINAL_OUTCOMES.has(outcome),
            outcome,
            expectedUserId: options?.expectedUserId,
            systemFault: options?.systemFault,
        });
    }

    /**
     * Apply a manually chosen reward to the in-flight attempt.
     *
     * Terminal by default (it closes the learning episode) — pass
     * `terminal: false` to shape a reward without ending the attempt, which
     * is what lets later lifecycle outcomes still produce their own labels.
     */
    async recordReward(
        assignmentId: string,
        reward: number,
        options?: LearningApplyOptions & { terminal?: boolean },
    ): Promise<boolean> {
        if (!Number.isFinite(reward)) {
            await this.bumpStat('invalidFeedback');
            return false;
        }
        return this.ingest(assignmentId, {
            eventKey: options?.eventId ? `event:${options.eventId}` : `reward:${Date.now()}:${this.decisionSeq++}`,
            reward,
            terminal: options?.terminal ?? true,
            expectedUserId: options?.expectedUserId,
        });
    }

    /**
     * Apply named external feedback signals (e.g. `{ accuracy: 0.95 }`) to an
     * attempt — the one in flight, or the archived episode when the work has
     * already closed.
     *
     * Reward = sum(signalValue * signalWeight), default weight 1 per signal.
     * Validation happens before anything is written: an empty signal map, a
     * non-numeric value, or a value beyond `maxSignalMagnitude` is rejected
     * whole rather than becoming a partial or zero-reward observation.
     *
     * Addressing an assignment that has BOTH a live attempt and an archived
     * one is ambiguous after a reassignment — it is rejected rather than
     * guessed. Pass the `decisionId` to say which attempt is meant.
     */
    async recordFeedback(
        assignmentId: string,
        signals: LearningSignals,
        options?: { decisionId?: string; eventId?: string; expectedUserId?: string },
    ): Promise<boolean> {
        const reward = this.rewardFromSignals(signals);
        if (reward === undefined) {
            await this.bumpStat('invalidFeedback');
            return false;
        }

        let decisionId = options?.decisionId;
        if (!decisionId) {
            const [live, archived] = await Promise.all([
                this.redisClient.get(this.keys.learningDecisionPointer(assignmentId)),
                this.redisClient.get(this.keys.learningEpisodePointer(assignmentId)),
            ]);
            if (live && archived && live !== archived) {
                // The assignment has been rematched: the archived attempt and
                // the live one are different workers' work. Guessing here is
                // exactly the mis-attribution this layer exists to avoid.
                await this.bumpStat('ambiguousFeedback');
                return false;
            }
            decisionId = (live ?? archived) as string | undefined;
        }
        if (!decisionId) {
            await this.bumpStat('orphanEvents');
            return false;
        }

        return this.ingest(assignmentId, {
            eventKey: options?.eventId ? `event:${options.eventId}` : `feedback:${this.signalFingerprint(signals)}`,
            reward,
            terminal: true,
            decisionId,
            expectedUserId: options?.expectedUserId,
            quality: this.qualityFromSignals(signals),
        });
    }

    /** Sum of weighted signals, or undefined when the map fails validation. */
    private rewardFromSignals(signals: LearningSignals): number | undefined {
        if (!signals || typeof signals !== 'object') return undefined;
        const entries = Object.entries(signals);
        if (entries.length === 0) return undefined;
        let reward = 0;
        for (const [signal, value] of entries) {
            if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
            if (Math.abs(value) > this.maxSignalMagnitude) return undefined;
            const weight = this.signalWeights[signal] ?? 1;
            if (!Number.isFinite(weight)) return undefined;
            reward += value * weight;
        }
        return Number.isFinite(reward) ? reward : undefined;
    }

    /**
     * Normalized quality label in [0, 1] from a signal map, or undefined when
     * the signals carry no quality reading — which trains nothing.
     */
    private qualityFromSignals(signals: LearningSignals): number | undefined {
        if (!this.activeTargets.includes('quality')) return undefined;
        const raw = signals.quality;
        if (typeof raw !== 'number' || !Number.isFinite(raw)) return undefined;
        return Math.max(0, Math.min(1, raw));
    }

    private signalFingerprint(signals: LearningSignals): string {
        return Object.keys(signals)
            .sort()
            .map((k) => `${k}=${signals[k]}`)
            .join('|');
    }

    /**
     * The single ingestion path. Everything that trains the model goes
     * through here so attribution, deduplication, staleness and generation
     * checks cannot drift between callers.
     */
    private async ingest(
        assignmentId: string,
        event: Parameters<LearningManager['ingestPrepared']>[1],
    ): Promise<boolean> {
        // A private view isolates the staged client and generation cache from
        // other callers using this manager concurrently.
        for (let attempt = 0; attempt < 32; attempt++) {
            const work = prepareIngestion(this.redisClient, [DECAYED_TAG_OUTCOME_LUA, DECAYED_TAG_REVISION_LUA]);
            const view: LearningManager = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
            view.redisClient = work.client;
            view.generationCache = undefined;
            const result = await view.ingestPrepared(assignmentId, event);
            if (await work.commit()) return result;
        }
        throw new Error('Learning ingestion contention: retry the event with the same event ID');
    }

    private async ingestPrepared(
        assignmentId: string,
        event: {
            eventKey: string;
            reward: number;
            terminal: boolean;
            outcome?: LearningOutcome;
            decisionId?: string;
            expectedUserId?: string;
            systemFault?: boolean;
            quality?: number;
        },
    ): Promise<boolean> {
        let decisionId = event.decisionId;
        if (!decisionId) {
            decisionId = (await this.redisClient.get(this.keys.learningDecisionPointer(assignmentId))) as
                | string
                | undefined;
        }
        if (!decisionId) {
            await this.bumpStat('orphanEvents');
            return false;
        }

        const appliedKey = this.keys.learningApplied(decisionId);
        const [decision, episode, appliedEvents] = await Promise.all([
            this.getDecisionById(decisionId),
            event.terminal || !event.outcome ? this.getEpisodeById(decisionId) : Promise.resolve(null),
            this.redisClient.sMembers(appliedKey),
        ]);
        if (appliedEvents.includes(event.eventKey)) {
            await this.bumpStat('duplicateEvents');
            return false;
        }
        const context = decision ?? episode;
        if (!context) {
            await this.bumpStat('staleEvents');
            return false;
        }
        if (event.expectedUserId && context.userId !== event.expectedUserId) {
            await this.bumpStat('orphanEvents');
            return false;
        }

        const generation = await this.currentGeneration();
        if ((context.generation ?? 0) !== generation) {
            await this.bumpStat('supersededEvents');
            return false;
        }

        const age = Date.now() - context.timestamp;
        if (age > this.maxFeedbackAgeMs) {
            await this.bumpStat('staleEvents');
            return false;
        }

        // Staged writes become visible only with every model/evidence update.
        await this.redisClient.sAdd(appliedKey, event.eventKey);
        await this.redisClient.pExpire(appliedKey, this.decisionTtlMs + this.feedbackTtlMs);
        appliedEvents.push(event.eventKey);

        const reward = clampFinite(event.reward, this.maxRewardMagnitude);

        // ---- model updates -------------------------------------------------
        if (this.multiTarget) {
            await this.trainTargets(context.features, event, appliedEvents as string[]);
        }
        await this.updateModel(context.features, reward);

        // ---- per-tag evidence ---------------------------------------------
        if (this.rewardAccounting === 'per-attempt') {
            await this.accountPerAttempt(decisionId, decision, episode, reward, event);
        } else {
            await this.updateTagStats(context.userId, context.tags, reward, event.terminal, true);
        }

        // ---- performance aggregates ---------------------------------------
        if (this.trackPerformance && event.outcome) {
            await this.updatePerformance(context.userId, context.tags, event.outcome, appliedEvents as string[]);
        }

        // ---- lifecycle -----------------------------------------------------
        if (event.terminal && decision) {
            await this.archive(decision, event.outcome, reward);
        }
        return true;
    }

    /** Archive an in-flight attempt as an episode and retire its pointer. */
    private async archive(
        decision: LearningDecisionRecord,
        outcome: LearningOutcome | undefined,
        finalReward: number,
    ): Promise<void> {
        const perAttempt = this.rewardAccounting === 'per-attempt';
        const episode: LearningEpisodeRecord = {
            decisionId: decision.decisionId,
            userId: decision.userId,
            assignmentId: decision.assignmentId,
            features: decision.features,
            outcome,
            tags: decision.tags,
            generation: decision.generation,
            appliedTagReward: perAttempt ? (decision.accruedReward ?? 0) + finalReward : undefined,
            tagStatsAt: perAttempt ? Date.now() : undefined,
            timestamp: decision.timestamp,
        };
        const multi = this.redisClient.multi();
        multi.set(this.keys.learningEpisode(decision.decisionId), JSON.stringify(episode), { PX: this.feedbackTtlMs });
        multi.set(this.keys.learningEpisodePointer(decision.assignmentId), decision.decisionId, {
            PX: this.feedbackTtlMs,
        });
        multi.del(this.keys.learningDecision(decision.decisionId));
        multi.del(this.keys.learningDecisionPointer(decision.assignmentId));
        await multi.exec();
    }

    /**
     * `per-attempt` evidence: accumulate rewards on the live attempt and
     * write ONE per-tag observation when it closes. Feedback arriving after
     * that revises the existing observation instead of adding a second — a
     * correction is not new evidence.
     */
    private async accountPerAttempt(
        decisionId: string,
        decision: LearningDecisionRecord | null,
        episode: LearningEpisodeRecord | null,
        reward: number,
        event: { terminal: boolean },
    ): Promise<void> {
        if (decision && !event.terminal) {
            decision.accruedReward = (decision.accruedReward ?? 0) + reward;
            await this.redisClient.set(this.keys.learningDecision(decisionId), JSON.stringify(decision), {
                PX: this.decisionTtlMs,
                XX: true,
            });
            return;
        }
        if (decision && event.terminal) {
            const total = clampFinite((decision.accruedReward ?? 0) + reward, this.maxRewardMagnitude);
            await this.updateTagStats(decision.userId, decision.tags, total, true, true);
            return;
        }
        if (episode) {
            const previous = episode.appliedTagReward;
            if (previous === undefined) {
                await this.updateTagStats(episode.userId, episode.tags, reward, true, true);
                return;
            }
            const revised = clampFinite(previous + reward, this.maxRewardMagnitude);
            await this.reviseTagStats(episode, previous, revised);
            episode.appliedTagReward = revised;
            await this.redisClient.set(this.keys.learningEpisode(episode.decisionId), JSON.stringify(episode), {
                PX: this.feedbackTtlMs,
                XX: true,
            });
        }
    }

    /** Derive and apply per-target labels for one lifecycle event. */
    private async trainTargets(
        features: LearningFeatures,
        event: { outcome?: LearningOutcome; systemFault?: boolean; quality?: number },
        appliedEvents: string[],
    ): Promise<void> {
        const updates: Array<[LearningRewardTarget, number]> = [];
        const accepted = appliedEvents.includes('outcome:accept');
        const systemFaultCounts = this.targets?.systemFaultCountsAsFailure ?? false;

        switch (event.outcome) {
            case 'accept':
                updates.push(['acceptance', 1]);
                break;
            case 'reject':
                updates.push(['acceptance', 0]);
                break;
            case 'expire':
                // Before acceptance the expiry is a non-response — an
                // acceptance label. After acceptance it is a completion
                // failure, and only counts against the worker when the caller
                // has not flagged it as a system fault.
                if (!accepted) updates.push(['acceptance', 0]);
                else if (!event.systemFault || systemFaultCounts) updates.push(['successGivenAcceptance', 0]);
                break;
            case 'complete':
                updates.push(['successGivenAcceptance', 1]);
                break;
            case 'fail':
                if (!event.systemFault || systemFaultCounts) updates.push(['successGivenAcceptance', 0]);
                break;
            default:
                break;
        }
        if (event.quality !== undefined) updates.push(['quality', event.quality]);

        for (const [target, label] of updates) {
            if (!this.activeTargets.includes(target)) continue;
            await this.updateTargetModel(target, features, label);
        }
    }

    // ------------------------------------------------------------------
    // Model training
    // ------------------------------------------------------------------

    /**
     * Active feature names, in a stable order, skipping zero-valued and
     * non-finite entries — the only fields an update ever needs to read.
     */
    private activeFeatures(features: LearningFeatures): Array<[string, number]> {
        const active: Array<[string, number]> = [];
        for (const [feature, value] of Object.entries(features)) {
            if (typeof value !== 'number' || !Number.isFinite(value) || value === 0) continue;
            active.push([feature, value]);
        }
        return active;
    }

    /**
     * Read only the weights an update touches.
     *
     * The old code loaded the entire model hash for every observation, which
     * grows without bound as the feature space does. HMGET over the active
     * features is O(active features) regardless of model size.
     */
    private async readWeights(key: string, names: string[]): Promise<Record<string, number>> {
        const out: Record<string, number> = {};
        if (names.length === 0) return out;
        const raw = (await this.redisClient.hmGet(key, names)) as Array<string | null>;
        names.forEach((name, i) => {
            out[name] = Number(raw[i]) || 0;
        });
        return out;
    }

    /**
     * Turn a prediction error into a bounded weight delta per feature.
     *
     * The raw rule `w += lr * error * x` is unstable: with `k` active unit
     * features every step overshoots by a factor of `k`, so the error
     * alternates sign and grows. Normalizing by the active vector's squared
     * norm makes one step land exactly on the observation (the
     * normalized-LMS / passive-aggressive rule) regardless of how many
     * features fired; the norm clip and weight cap bound the rest.
     */
    private computeDeltas(
        active: Array<[string, number]>,
        weights: Record<string, number>,
        error: number,
        rate: number = this.learningRate,
    ): Record<string, number> {
        const deltas: Record<string, number> = {};
        if (active.length === 0 || !Number.isFinite(error)) return deltas;

        let denominator = 1;
        if (this.updateMode === 'normalized') {
            let sq = 0;
            for (const [, value] of active) sq += value * value;
            // Floor of 1 keeps a sparse vector of tiny values from turning a
            // normalized step into a division blow-up.
            denominator = Math.max(1, sq);
        }

        const scale = (rate * error) / denominator;
        let normSq = 0;
        for (const [feature, value] of active) {
            const delta = scale * value - rate * this.l2 * (weights[feature] ?? 0);
            if (!Number.isFinite(delta)) continue;
            deltas[feature] = delta;
            normSq += delta * delta;
        }

        const norm = Math.sqrt(normSq);
        if (this.maxUpdateNorm > 0 && norm > this.maxUpdateNorm) {
            const shrink = this.maxUpdateNorm / norm;
            for (const feature of Object.keys(deltas)) deltas[feature] *= shrink;
        }
        return deltas;
    }

    /**
     * Write deltas, clamping any weight that would leave the magnitude cap.
     * Increments are used in the ordinary case so concurrent trainers compose;
     * the clamp falls back to a set, which is the only way to bound a value.
     */
    private writeDeltas(
        multi: ReturnType<RedisClientType['multi']>,
        key: string,
        deltas: Record<string, number>,
        weights: Record<string, number>,
    ): void {
        for (const [feature, delta] of Object.entries(deltas)) {
            const next = (weights[feature] ?? 0) + delta;
            if (Math.abs(next) > this.maxWeightMagnitude) {
                multi.hSet(key, feature, String(Math.sign(next) * this.maxWeightMagnitude));
            } else {
                multi.hIncrByFloat(key, feature, delta);
            }
        }
    }

    /** Apply one bounded SGD step to the legacy scalar-reward model */
    private async updateModel(features: LearningFeatures, reward: number): Promise<void> {
        const active = this.activeFeatures(features);
        const names = active.map(([name]) => name);
        const weights = await this.readWeights(this.keys.learningModel(), names);
        let prediction = 0;
        for (const [feature, value] of active) prediction += (weights[feature] ?? 0) * value;
        const deltas = this.computeDeltas(active, weights, reward - prediction);

        const multi = this.redisClient.multi();
        this.writeDeltas(multi, this.keys.learningModel(), deltas, weights);
        multi.hIncrBy(this.keys.learningStats(), 'rewards', 1);
        multi.hIncrByFloat(this.keys.learningStats(), 'totalReward', reward);
        await multi.exec();
    }

    /** Apply one bounded step to a target model (logistic for binary targets) */
    private async updateTargetModel(
        target: LearningRewardTarget,
        features: LearningFeatures,
        label: number,
    ): Promise<void> {
        const active = this.activeFeatures(features);
        if (active.length === 0) return;
        const key = this.keys.learningTargetModel(target);
        const names = active.map(([name]) => name);
        const weights = await this.readWeights(key, names);
        let z = 0;
        for (const [feature, value] of active) z += (weights[feature] ?? 0) * value;
        const prediction = target === 'quality' ? z : sigmoid(z);
        const rate = this.targets?.learningRates?.[target];
        const deltas = this.computeDeltas(active, weights, label - prediction, rate ?? this.learningRate);

        const multi = this.redisClient.multi();
        this.writeDeltas(multi, key, deltas, weights);
        multi.hIncrBy(this.keys.learningStats(), `labels:${target}`, 1);
        await multi.exec();
    }

    /**
     * Train the model directly with raw (features, reward) samples.
     * Enables offline/batch imports from external pipelines (data warehouses,
     * historical logs, post-processing jobs) without a live decision context.
     *
     * Samples are processed in bounded chunks and each chunk re-reads the
     * weights it touches, so a long import cannot keep accumulating against a
     * snapshot the live model has already moved away from.
     */
    async trainSamples(samples: LearningSample[], chunkSize = 200): Promise<number> {
        if (samples.length === 0) return 0;
        const valid = samples.filter(
            (s) =>
                s &&
                typeof s.reward === 'number' &&
                Number.isFinite(s.reward) &&
                s.features &&
                typeof s.features === 'object',
        );
        if (valid.length === 0) return 0;

        let applied = 0;
        for (let start = 0; start < valid.length; start += chunkSize) {
            const chunk = valid.slice(start, start + chunkSize);
            const names = new Set<string>();
            const actives = chunk.map((sample) => {
                const active = this.activeFeatures(sample.features);
                for (const [name] of active) names.add(name);
                return active;
            });
            const nameList = Array.from(names);
            const weights = await this.readWeights(this.keys.learningModel(), nameList);
            const local: Record<string, number> = { ...weights };

            const totals: Record<string, number> = {};
            let totalReward = 0;
            chunk.forEach((sample, i) => {
                const active = actives[i];
                let prediction = 0;
                for (const [feature, value] of active) prediction += (local[feature] ?? 0) * value;
                const reward = clampFinite(sample.reward, this.maxRewardMagnitude);
                const deltas = this.computeDeltas(active, local, reward - prediction);
                for (const [feature, delta] of Object.entries(deltas)) {
                    totals[feature] = (totals[feature] ?? 0) + delta;
                    local[feature] = (local[feature] ?? 0) + delta;
                }
                totalReward += reward;
            });

            const multi = this.redisClient.multi();
            this.writeDeltas(multi, this.keys.learningModel(), totals, weights);
            multi.hIncrBy(this.keys.learningStats(), 'rewards', chunk.length);
            multi.hIncrByFloat(this.keys.learningStats(), 'totalReward', totalReward);
            await multi.exec();
            applied += chunk.length;
        }
        return applied;
    }

    // ------------------------------------------------------------------
    // Per-tag evidence
    // ------------------------------------------------------------------

    /**
     * Update per-user, per-tag reward aggregates.
     *
     * Without decay these are plain atomic increments — O(tags), no
     * read-modify-write, so high-throughput outcome streams scale without
     * contention. With decay the sums must be rescaled to "as of now" before
     * the observation lands, which the batched Lua script does for every tag
     * of an observation in ONE call.
     */
    private async updateTagStats(
        userId: string,
        tags: string[] | undefined,
        reward: number,
        terminal: boolean,
        countAttempt: boolean,
    ): Promise<void> {
        if (!this.trackTagStats || !tags || tags.length === 0) return;
        if (this.autoWeights.terminalOnlyTagStats && !terminal) return;

        const cleanTags = tags.filter(Boolean);
        if (cleanTags.length === 0) return;

        const needVariance = this.needsVarianceTracking();
        const now = Date.now();
        const halfLife = this.autoWeights.decayHalfLifeMs ?? 0;

        if (halfLife > 0) {
            for (let i = 0; i < cleanTags.length; i += 100) {
                await this.redisClient.eval(DECAYED_TAG_OUTCOME_LUA, {
                    keys: [
                        this.keys.learningUserTagCounts(userId),
                        this.keys.learningUserTagRewards(userId),
                        this.keys.learningUserTagRewardSq(userId),
                        this.keys.learningUserTagTs(userId),
                        this.keys.learningUserTagWeightSq(userId),
                        this.keys.learningUserTagAttempts(userId),
                    ],
                    arguments: [
                        String(now),
                        String(halfLife),
                        String(reward),
                        countAttempt ? '1' : '0',
                        ...cleanTags.slice(i, i + 100),
                    ],
                });
            }
            const post = this.redisClient.multi();
            post.sAdd(this.keys.learningUsers(), userId);
            if (countAttempt) post.incr(this.keys.learningUserAttempts(userId));
            await post.exec();
            return;
        }

        const multi = this.redisClient.multi();
        for (const tag of cleanTags) {
            multi.hIncrBy(this.keys.learningUserTagCounts(userId), tag, 1);
            multi.hIncrByFloat(this.keys.learningUserTagRewards(userId), tag, reward);
            if (countAttempt) multi.hIncrBy(this.keys.learningUserTagAttempts(userId), tag, 1);
            if (needVariance) {
                multi.hIncrByFloat(this.keys.learningUserTagRewardSq(userId), tag, reward * reward);
                multi.hIncrByFloat(this.keys.learningUserTagWeightSq(userId), tag, 1);
                multi.hSet(this.keys.learningUserTagTs(userId), tag, now.toString());
            }
        }
        multi.sAdd(this.keys.learningUsers(), userId);
        if (countAttempt) multi.incr(this.keys.learningUserAttempts(userId));
        await multi.exec();
    }

    /**
     * Replace a tag observation's reward without changing its count — the
     * exact correction a revised label calls for.
     */
    private async reviseTagStats(
        episode: LearningEpisodeRecord,
        previousReward: number,
        revisedReward: number,
    ): Promise<void> {
        if (!this.trackTagStats || !episode.tags || episode.tags.length === 0) return;
        const cleanTags = episode.tags.filter(Boolean);
        if (cleanTags.length === 0) return;

        const halfLife = this.autoWeights.decayHalfLifeMs ?? 0;
        const now = Date.now();
        if (halfLife > 0) {
            for (let i = 0; i < cleanTags.length; i += 100) {
                await this.redisClient.eval(DECAYED_TAG_REVISION_LUA, {
                    keys: [
                        this.keys.learningUserTagCounts(episode.userId),
                        this.keys.learningUserTagRewards(episode.userId),
                        this.keys.learningUserTagRewardSq(episode.userId),
                        this.keys.learningUserTagTs(episode.userId),
                    ],
                    arguments: [
                        String(now),
                        String(halfLife),
                        String(episode.tagStatsAt ?? episode.timestamp),
                        String(previousReward),
                        String(revisedReward),
                        ...cleanTags.slice(i, i + 100),
                    ],
                });
            }
            return;
        }

        const needVariance = this.needsVarianceTracking();
        const multi = this.redisClient.multi();
        for (const tag of cleanTags) {
            multi.hIncrByFloat(this.keys.learningUserTagRewards(episode.userId), tag, revisedReward - previousReward);
            if (needVariance) {
                multi.hIncrByFloat(
                    this.keys.learningUserTagRewardSq(episode.userId),
                    tag,
                    revisedReward * revisedReward - previousReward * previousReward,
                );
            }
        }
        await multi.exec();
    }

    /**
     * True when the configured policy needs reward variance and per-tag
     * write timestamps. A veto cooldown counts: without a last-observation
     * timestamp there is no way to tell that a veto has gone stale, so the
     * cooldown would silently never fire.
     */
    private needsVarianceTracking(): boolean {
        const policy = this.autoWeights.policy;
        return (
            policy === 'confidence' ||
            policy === 'thompson' ||
            (this.autoWeights.decayHalfLifeMs ?? 0) > 0 ||
            this.autoWeights.vetoCooldownMs !== undefined
        );
    }

    /** Per-user, per-tag reward statistics aggregated from observed outcomes */
    async getUserTagStats(userId: string): Promise<LearningTagStat[]> {
        const needVariance = this.needsVarianceTracking();
        const [counts, rewards, sq, ts, w2, attempts] = await Promise.all([
            this.redisClient.hGetAll(this.keys.learningUserTagCounts(userId)),
            this.redisClient.hGetAll(this.keys.learningUserTagRewards(userId)),
            needVariance ? this.redisClient.hGetAll(this.keys.learningUserTagRewardSq(userId)) : Promise.resolve({}),
            needVariance ? this.redisClient.hGetAll(this.keys.learningUserTagTs(userId)) : Promise.resolve({}),
            needVariance ? this.redisClient.hGetAll(this.keys.learningUserTagWeightSq(userId)) : Promise.resolve({}),
            this.redisClient.hGetAll(this.keys.learningUserTagAttempts(userId)),
        ]);

        const halfLife = this.autoWeights.decayHalfLifeMs;
        const now = Date.now();
        return Object.entries(counts as Record<string, string>).map(([tag, rawCount]) => {
            let count = Number(rawCount) || 0;
            let rewardSum = Number((rewards as Record<string, string>)[tag]) || 0;
            let rewardSqSum = needVariance ? Number((sq as Record<string, string>)[tag]) || 0 : undefined;
            let sumWeightsSq = needVariance ? Number((w2 as Record<string, string>)[tag]) || 0 : undefined;
            const lastUpdatedAt = needVariance ? Number((ts as Record<string, string>)[tag]) || undefined : undefined;
            const attemptCount = Number((attempts as Record<string, string>)[tag]) || undefined;

            if (halfLife && halfLife > 0 && lastUpdatedAt) {
                const elapsed = now - lastUpdatedAt;
                const factor = Math.pow(2, -elapsed / halfLife);
                count *= factor;
                rewardSum *= factor;
                if (rewardSqSum !== undefined) rewardSqSum *= factor;
                // Squared weights decay by the square of the factor.
                if (sumWeightsSq !== undefined) sumWeightsSq *= factor * factor;
            }

            const meanReward = count > 0 ? rewardSum / count : 0;
            // Kish effective sample size. Without decay every weight is 1 and
            // this reduces to the count; with decay it is strictly smaller,
            // which is the number evidence thresholds must be judged against.
            const effectiveSampleSize =
                sumWeightsSq && sumWeightsSq > 0 ? (count * count) / sumWeightsSq : needVariance ? count : count;

            let variance: number | undefined;
            let standardError: number | undefined;
            if (needVariance && rewardSqSum !== undefined && count > 0) {
                variance = Math.max(0, rewardSqSum / count - meanReward * meanReward);
                standardError = Math.sqrt(variance / Math.max(1e-9, effectiveSampleSize));
            }

            return {
                tag,
                count,
                effectiveSampleSize,
                sumWeightsSq,
                attempts: attemptCount,
                rewardSum,
                meanReward,
                rewardSqSum,
                lastUpdatedAt,
                variance,
                standardError,
            };
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
        const rows = await this.explainLearnedRoutingWeights(userId, knownTags, existingWeights);
        const weights: Record<string, number> = {};
        for (const row of rows) weights[row.tag] = row.weight;
        return weights;
    }

    /** Independent attempts observed for a worker, counted once per attempt. */
    async getUserAttemptTotal(userId: string): Promise<number | undefined> {
        const raw = await this.redisClient.get(this.keys.learningUserAttempts(userId));
        const value = Number(raw);
        return Number.isFinite(value) && value > 0 ? value : undefined;
    }

    /**
     * The same synthesis with its reasoning attached — estimate, uncertainty,
     * evidence, last observation and next reassessment per tag.
     */
    async explainLearnedRoutingWeights(
        userId: string,
        knownTags?: string[],
        existingWeights?: Record<string, number>,
    ): Promise<AutoWeightExplanation[]> {
        const [stats, totalAttempts] = await Promise.all([this.getUserTagStats(userId), this.getUserAttemptTotal(userId)]);
        if (stats.length === 0 && (!knownTags || knownTags.length === 0)) return [];
        return explainRoutingWeights(stats, { ...this.autoWeights, totalAttempts }, knownTags, existingWeights);
    }

    // ------------------------------------------------------------------
    // Worker performance aggregates (batch-loaded features)
    // ------------------------------------------------------------------

    /**
     * Fold one lifecycle outcome into the per-worker and team aggregates the
     * performance features read. Pure counters — no per-candidate reads ever
     * happen against these; a matching pass loads one hash per worker.
     */
    private async updatePerformance(
        userId: string,
        tags: string[] | undefined,
        outcome: LearningOutcome,
        appliedEvents: string[],
    ): Promise<void> {
        const cleanTags = (tags ?? []).filter(Boolean);
        const accepted = appliedEvents.includes('outcome:accept');

        const fields: Array<[string, number]> = [];
        if (outcome === 'accept') fields.push(['offers', 1], ['accepts', 1]);
        else if (outcome === 'reject') fields.push(['offers', 1]);
        else if (outcome === 'expire' && !accepted) fields.push(['offers', 1]);
        else if (outcome === 'complete') fields.push(['accepted', 1], ['successes', 1]);
        else if (outcome === 'fail') fields.push(['accepted', 1]);
        else if (outcome === 'expire' && accepted) fields.push(['accepted', 1]);
        if (fields.length === 0) return;

        const userKey = this.keys.learningUserPerformance(userId);
        const teamKey = this.keys.learningTeamPerformance();
        const multi = this.redisClient.multi();
        for (const [field, amount] of fields) {
            multi.hIncrBy(userKey, field, amount);
            multi.hIncrBy(teamKey, field, amount);
            for (const tag of cleanTags) {
                multi.hIncrBy(userKey, `${field}:${tag}`, amount);
                multi.hIncrBy(teamKey, `${field}:${tag}`, amount);
            }
        }
        await multi.exec();
    }

    /** Record an observed handling time (accept -> complete) for a worker */
    async recordHandlingTime(userId: string, tags: string[] | undefined, durationMs: number): Promise<void> {
        if (!this.trackPerformance || !Number.isFinite(durationMs) || durationMs < 0) return;
        const cleanTags = (tags ?? []).filter(Boolean);
        const userKey = this.keys.learningUserPerformance(userId);
        const teamKey = this.keys.learningTeamPerformance();
        const multi = this.redisClient.multi();
        multi.hIncrByFloat(userKey, 'handleMs', durationMs);
        multi.hIncrBy(userKey, 'handleN', 1);
        multi.hIncrByFloat(teamKey, 'handleMs', durationMs);
        multi.hIncrBy(teamKey, 'handleN', 1);
        for (const tag of cleanTags) {
            multi.hIncrByFloat(userKey, `handleMs:${tag}`, durationMs);
            multi.hIncrBy(userKey, `handleN:${tag}`, 1);
            multi.hIncrByFloat(teamKey, `handleMs:${tag}`, durationMs);
            multi.hIncrBy(teamKey, `handleN:${tag}`, 1);
        }
        await multi.exec();
    }

    /** Team-wide priors the per-worker rates are shrunk toward */
    async loadTeamPriors(): Promise<{ acceptanceRate?: number; successRate?: number; handlingTimeMs?: number }> {
        const raw = (await this.redisClient.hGetAll(this.keys.learningTeamPerformance())) as Record<string, string>;
        const num = (field: string) => Number(raw[field]) || 0;
        const offers = num('offers');
        const acceptedTotal = num('accepted');
        const handleN = num('handleN');
        return {
            acceptanceRate: offers > 0 ? num('accepts') / offers : undefined,
            successRate: acceptedTotal > 0 ? num('successes') / acceptedTotal : undefined,
            handlingTimeMs: handleN > 0 ? num('handleMs') / handleN : undefined,
        };
    }

    /**
     * Load one worker's performance aggregates and shrink them toward the
     * team priors. A worker with no history gets the prior, not zero — an
     * unjustifiably pessimistic estimate is how a new worker starves.
     */
    async loadPerformance(
        userId: string,
        priors: { acceptanceRate?: number; successRate?: number; handlingTimeMs?: number },
    ): Promise<LearningWorkerPerformance> {
        const raw = (await this.redisClient.hGetAll(this.keys.learningUserPerformance(userId))) as Record<string, string>;
        return this.shrinkPerformance(raw, priors);
    }

    /** Pure shrinkage of a raw aggregate hash toward team priors. */
    shrinkPerformance(
        raw: Record<string, string>,
        priors: { acceptanceRate?: number; successRate?: number; handlingTimeMs?: number },
    ): LearningWorkerPerformance {
        const k = this.performancePriorStrength;
        const num = (field: string) => Number(raw[field]) || 0;
        const tagsOf = (prefix: string) =>
            Object.keys(raw)
                .filter((f) => f.startsWith(`${prefix}:`))
                .map((f) => f.slice(prefix.length + 1));

        const shrink = (successes: number, trials: number, prior: number | undefined): number | undefined => {
            if (prior === undefined && trials === 0) return undefined;
            const p = prior ?? 0.5;
            return (successes + k * p) / (trials + k);
        };

        const acceptanceRate: Record<string, number> = {};
        const attempts: Record<string, number> = {};
        for (const tag of new Set([...tagsOf('offers'), ...tagsOf('accepts')])) {
            const trials = num(`offers:${tag}`);
            attempts[tag] = trials;
            const value = shrink(num(`accepts:${tag}`), trials, priors.acceptanceRate);
            if (value !== undefined) acceptanceRate[tag] = value;
        }

        const successRate: Record<string, number> = {};
        for (const tag of new Set([...tagsOf('accepted'), ...tagsOf('successes')])) {
            const value = shrink(num(`successes:${tag}`), num(`accepted:${tag}`), priors.successRate);
            if (value !== undefined) successRate[tag] = value;
        }

        const handlingTimeMs: Record<string, number> = {};
        for (const tag of tagsOf('handleN')) {
            const n = num(`handleN:${tag}`);
            if (n > 0) handlingTimeMs[tag] = num(`handleMs:${tag}`) / n;
        }

        return {
            acceptanceRate,
            overallAcceptanceRate: shrink(num('accepts'), num('offers'), priors.acceptanceRate),
            successRate,
            overallSuccessRate: shrink(num('successes'), num('accepted'), priors.successRate),
            handlingTimeMs,
            attempts,
        };
    }

    // ------------------------------------------------------------------
    // Stats & lifecycle
    // ------------------------------------------------------------------

    private async bumpStat(field: string): Promise<void> {
        await this.redisClient.hIncrBy(this.keys.learningStats(), field, 1);
    }

    /** Aggregate learning statistics */
    async getStats(): Promise<LearningStats> {
        const [raw, generation] = await Promise.all([
            this.redisClient.hGetAll(this.keys.learningStats()),
            this.currentGeneration(),
        ]);
        const hash = raw as Record<string, string>;
        const rewards = Number(hash.rewards) || 0;
        const totalReward = Number(hash.totalReward) || 0;
        return {
            decisions: Number(hash.decisions) || 0,
            rewards,
            totalReward,
            averageReward: rewards > 0 ? totalReward / rewards : 0,
            duplicateEvents: Number(hash.duplicateEvents) || 0,
            staleEvents: Number(hash.staleEvents) || 0,
            orphanEvents: Number(hash.orphanEvents) || 0,
            supersededEvents: Number(hash.supersededEvents) || 0,
            ambiguousFeedback: Number(hash.ambiguousFeedback) || 0,
            invalidFeedback: Number(hash.invalidFeedback) || 0,
            generation,
        };
    }

    /**
     * Reset model weights, statistics, and per-user tag statistics.
     *
     * The generation counter is bumped rather than cleared: attempts that are
     * still in flight were committed against the old model, and applying
     * their outcomes to the fresh one would silently repopulate what was just
     * reset. Those events are rejected and counted as `supersededEvents`.
     */
    async resetModel(): Promise<void> {
        const trackedUsers = await this.listTrackedUsers();
        const multi = this.redisClient.multi();
        multi.del(this.keys.learningModel());
        for (const target of this.activeTargets) multi.del(this.keys.learningTargetModel(target));
        multi.del(this.keys.learningStats());
        for (const userId of trackedUsers) {
            multi.del(this.keys.learningUserTagCounts(userId));
            multi.del(this.keys.learningUserTagRewards(userId));
            multi.del(this.keys.learningUserTagRewardSq(userId));
            multi.del(this.keys.learningUserTagTs(userId));
            multi.del(this.keys.learningUserTagWeightSq(userId));
            multi.del(this.keys.learningUserTagAttempts(userId));
            multi.del(this.keys.learningUserAttempts(userId));
            multi.del(this.keys.learningUserPerformance(userId));
        }
        multi.del(this.keys.learningTeamPerformance());
        multi.del(this.keys.learningUsers());
        multi.incr(this.keys.learningGeneration());
        await multi.exec();
        this.generationCache = undefined;
    }
}
