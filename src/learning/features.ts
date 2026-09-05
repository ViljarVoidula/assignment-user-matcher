/**
 * Default feature extraction for the learning (contextual bandit) layer.
 *
 * Produces a sparse feature vector describing how well a user matches an
 * assignment. All features are normalized to roughly [0, 1] so learned
 * weights stay comparable across feature families.
 */
import type {
    User,
    LearningFeatures,
    LearningAssignmentContext,
    LearningFeatureContext,
    LearningWorkerPerformance,
} from '../types/matcher';
import { getEffectiveWeight } from '../scoring/match-score';

/**
 * Cosine similarity between two numeric vectors.
 * Returns 0 for mismatched lengths or zero-magnitude vectors.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length === 0 || a.length !== b.length) return 0;
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Mean of a per-tag estimate over the assignment's tags, falling back to the
 * worker's overall estimate, then to `undefined` (unknown, not zero).
 */
function tagMean(
    perTag: Record<string, number> | undefined,
    tags: string[],
    overall: number | undefined,
): number | undefined {
    if (perTag) {
        let sum = 0;
        let n = 0;
        for (const tag of tags) {
            const value = perTag[tag];
            if (typeof value === 'number' && Number.isFinite(value)) {
                sum += value;
                n++;
            }
        }
        if (n > 0) return sum / n;
    }
    return overall;
}

/**
 * Worker-side and interaction features, emitted only when the caller
 * supplied batch-loaded performance aggregates.
 *
 * These are what make two workers with identical declared tags
 * distinguishable: without them the feature vector for a given assignment is
 * the same for every eligible worker, and the model has nothing to learn
 * about *who* should get the work.
 *
 * Estimates are pre-shrunk toward the team prior by the caller, so a worker
 * with no history reads as average rather than as a failure — an
 * unjustifiably pessimistic estimate is how a new worker starves.
 */
function addPerformanceFeatures(
    features: LearningFeatures,
    assignmentTags: string[],
    performance: LearningWorkerPerformance,
    context: LearningFeatureContext,
    urgency: number | undefined,
    difficulty: number | undefined,
    complexity: number,
): void {
    const accept = tagMean(performance.acceptanceRate, assignmentTags, performance.overallAcceptanceRate);
    if (accept !== undefined) features['perf:accept'] = accept;

    const success = tagMean(performance.successRate, assignmentTags, performance.overallSuccessRate);
    if (success !== undefined) features['perf:success'] = success;

    // Sample support is its own feature: the model can learn how much to
    // trust the rate above rather than treating a one-sample estimate and a
    // thousand-sample estimate as the same number.
    const attempts = tagMean(performance.attempts, assignmentTags, undefined);
    if (attempts !== undefined) features['perf:support'] = Math.min(1, attempts / 20);

    // Speed relative to the team's own mean handling time — self-scaling, so
    // no absolute duration constant has to be invented.
    const handling = tagMean(performance.handlingTimeMs, assignmentTags, undefined);
    const reference = context.priors?.handlingTimeMs;
    let speed: number | undefined;
    if (handling !== undefined && reference !== undefined && reference > 0) {
        speed = Math.max(0, Math.min(1, 1 - handling / (2 * reference)));
        features['perf:speed'] = speed;
        features['perf:speedKnown'] = 1;
    }

    if (
        typeof performance.backlog === 'number' &&
        typeof performance.backlogLimit === 'number' &&
        performance.backlogLimit > 0
    ) {
        features['load:backlog'] = Math.min(1, performance.backlog / performance.backlogLimit);
    }

    // Interactions the linear model cannot represent on its own.
    if (urgency !== undefined && speed !== undefined) features['x:urgency*speed'] = urgency * speed;
    if (difficulty !== undefined && success !== undefined) features['x:difficulty*success'] = difficulty * success;
    if (features['load:backlog'] !== undefined) features['x:load*complexity'] = features['load:backlog'] * complexity;
}

/**
 * Default feature extractor: tag matches, normalized skill weights,
 * tag-overlap ratio, optional embedding similarity, SLA urgency, and —
 * when performance aggregates are supplied — worker-side outcome rates,
 * workload and their interactions.
 */
export function extractMatchFeatures(
    user: User,
    assignment: LearningAssignmentContext,
    slaTightnessReferenceMs: number = 3600000,
    context?: LearningFeatureContext,
): LearningFeatures {
    const features: LearningFeatures = { bias: 1 };
    const userTags = new Set(user.tags || []);
    const assignmentTags = assignment.tags || [];

    let overlapCount = 0;
    for (const tag of assignmentTags) {
        if (userTags.has(tag)) {
            features[`tag:${tag}`] = 1;
            overlapCount++;
        }
        if (user.routingWeights && Object.keys(user.routingWeights).length > 0) {
            const weight = getEffectiveWeight(user.routingWeights, tag);
            if (weight > 0) {
                // Normalize assuming the conventional 0-100 weight scale, capped at 1.
                features[`skill:${tag}`] = Math.min(weight / 100, 1);
            }
        }
    }

    if (assignmentTags.length > 0) {
        features.overlap = overlapCount / assignmentTags.length;
    }

    if (Array.isArray(user.embedding) && Array.isArray(assignment.embedding)) {
        features['emb:sim'] = cosineSimilarity(user.embedding, assignment.embedding);
    }

    // SLA urgency: assignment-side only (user-invariant), so custom
    // extractors and existing learned weights are unaffected.
    const raw = assignment as Record<string, any>;
    const completeWithinMs = Number(raw.sla?.completeWithinMs);
    const reference =
        Number.isFinite(slaTightnessReferenceMs) && slaTightnessReferenceMs > 0 ? slaTightnessReferenceMs : 3600000;
    let urgency: number | undefined;
    if (Number.isFinite(completeWithinMs) && completeWithinMs > 0) {
        features['sla:hasDeadline'] = 1;
        features['sla:tightness'] = 1 - Math.min(1, completeWithinMs / reference);
        urgency = features['sla:tightness'];
    }

    // Time actually left, not the duration originally configured: an
    // assignment with a 1h deadline that has been queued for 55 minutes is
    // urgent, and the configured duration alone cannot say so. Only computed
    // when the caller anchors the pass with an explicit `now`.
    const now = context?.now;
    const enqueuedAt = Number(raw._enqueuedAt);
    if (now !== undefined && Number.isFinite(completeWithinMs) && completeWithinMs > 0 && Number.isFinite(enqueuedAt)) {
        const remaining = enqueuedAt + completeWithinMs - now;
        const fraction = Math.max(0, Math.min(1, remaining / completeWithinMs));
        features['sla:remainingFraction'] = fraction;
        urgency = 1 - fraction;
        features['sla:urgency'] = urgency;
    }

    if (context?.performance) {
        const difficultyRaw = Number(raw.difficulty);
        const difficulty = Number.isFinite(difficultyRaw) ? Math.max(0, Math.min(1, difficultyRaw)) : undefined;
        if (difficulty !== undefined) features.difficulty = difficulty;
        // Tag count is a crude but always-available complexity proxy; an
        // explicit `complexity` on the assignment overrides it.
        const complexityRaw = Number(raw.complexity);
        const complexity = Number.isFinite(complexityRaw)
            ? Math.max(0, Math.min(1, complexityRaw))
            : Math.min(1, assignmentTags.length / 5);
        features.complexity = complexity;
        addPerformanceFeatures(features, assignmentTags, context.performance, context, urgency, difficulty, complexity);
    }

    return features;
}
