/**
 * Default feature extraction for the learning (contextual bandit) layer.
 *
 * Produces a sparse feature vector describing how well a user matches an
 * assignment. All features are normalized to roughly [0, 1] so learned
 * weights stay comparable across feature families.
 */
import type { User, LearningFeatures, LearningAssignmentContext } from '../types/matcher';
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
 * Default feature extractor: tag matches, normalized skill weights,
 * tag-overlap ratio, optional embedding similarity, and SLA urgency.
 */
export function extractMatchFeatures(
    user: User,
    assignment: LearningAssignmentContext,
    slaTightnessReferenceMs: number = 3600000,
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
    const completeWithinMs = Number((assignment as Record<string, any>).sla?.completeWithinMs);
    if (Number.isFinite(completeWithinMs) && completeWithinMs > 0) {
        features['sla:hasDeadline'] = 1;
        const reference =
            Number.isFinite(slaTightnessReferenceMs) && slaTightnessReferenceMs > 0 ? slaTightnessReferenceMs : 3600000;
        features['sla:tightness'] = 1 - Math.min(1, completeWithinMs / reference);
    }

    return features;
}
