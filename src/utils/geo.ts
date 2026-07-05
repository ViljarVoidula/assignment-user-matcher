/**
 * Geolocation matching utilities.
 *
 * Pure helpers for coordinate validation, distance calculation,
 * and business-rule evaluation for geo eligibility.
 */
import type { Assignment, GeoMatchResult, User } from '../types/matcher';

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
}

export function isValidLatitude(value: unknown): value is number {
    return typeof value === 'number' && Number.isFinite(value) && value >= -90 && value <= 90;
}

export function isValidLongitude(value: unknown): value is number {
    return typeof value === 'number' && Number.isFinite(value) && value >= -180 && value <= 180;
}

export function hasValidCoordinates(latitude: unknown, longitude: unknown): boolean {
    return isValidLatitude(latitude) && isValidLongitude(longitude);
}

export function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_KM * c;
}

/**
 * Check if a user-assignment pair is geo-eligible.
 *
 * An assignment that never configured coordinates hasn't opted into geo
 * matching, so it stays open to all users (backward compatible). But once an
 * assignment does specify coordinates, a user with no location can't satisfy
 * that distance criterion and is denied by default - mirroring checkCidrMatch's
 * "restriction present, matching data missing -> deny". requireGeo remains as
 * an explicit, redundant-but-safe way to force denial in that case.
 */
export function checkGeoMatch(
    user: User,
    assignment: Assignment,
    options?: {
        enabled?: boolean;
        defaultMaxDistanceKm?: number;
    },
): GeoMatchResult {
    if (!options?.enabled) {
        return { eligible: true };
    }

    const userHasCoords = hasValidCoordinates(user.latitude, user.longitude);
    const assignmentHasCoords = hasValidCoordinates(assignment.latitude, assignment.longitude);

    if (!userHasCoords || !assignmentHasCoords) {
        if (assignment.requireGeo || (assignmentHasCoords && !userHasCoords)) {
            return { eligible: false };
        }
        return { eligible: true };
    }

    const distanceKm = haversineDistanceKm(user.latitude!, user.longitude!, assignment.latitude!, assignment.longitude!);

    const caps = [assignment.maxDistanceKm, user.maxTravelDistanceKm, options.defaultMaxDistanceKm].filter(
        (value): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0,
    );

    if (caps.length === 0) {
        return { eligible: true, distanceKm };
    }

    const effectiveMaxDistanceKm = Math.min(...caps);
    if (distanceKm > effectiveMaxDistanceKm) {
        return { eligible: false, distanceKm, effectiveMaxDistanceKm };
    }

    return { eligible: true, distanceKm, effectiveMaxDistanceKm };
}
