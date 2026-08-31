/**
 * Site registry and travel-time resolution.
 *
 * Multi-site rosters need two numbers that the caller owns: where a site is
 * (coordinates) and how long it takes to move between sites (a travel-time
 * matrix or a fallback speed). The engine never calls an external routing
 * service and never invents default values — it only does pure arithmetic on
 * caller-supplied data.
 */

import type { Site, SiteIndex } from './types';
import { ScheduleValidationError } from './types';
import { haversineDistanceKm, hasValidCoordinates } from '../utils/geo';

/**
 * Build a validated site index from caller input.
 *
 * Throws `ScheduleValidationError` for duplicate ids, malformed coordinates,
 * negative matrix entries, or a non-positive fallback speed. Site ids that are
 * referenced by templates or employees but not declared here are tolerated;
 * they simply have no coordinates or matrix entries.
 */
export function buildSiteIndex(sites: Site[] | undefined, travelSpeedKmh?: number): SiteIndex {
    if (travelSpeedKmh !== undefined && (!Number.isFinite(travelSpeedKmh) || travelSpeedKmh <= 0)) {
        throw new ScheduleValidationError(`travelSpeedKmh must be a positive finite number: ${travelSpeedKmh}`);
    }

    const byId = new Map<string, Site>();
    for (const site of sites ?? []) {
        if (!site.id) throw new ScheduleValidationError('Site is missing `id`');
        if (byId.has(site.id)) throw new ScheduleValidationError(`Duplicate site id "${site.id}"`);

        if (site.lat !== undefined || site.lng !== undefined) {
            if (!hasValidCoordinates(site.lat, site.lng)) {
                throw new ScheduleValidationError(
                    `Site "${site.id}" has invalid coordinates: lat=${site.lat}, lng=${site.lng}`,
                );
            }
        }

        if (site.travelMinutesTo) {
            for (const [target, minutes] of Object.entries(site.travelMinutesTo)) {
                if (!Number.isFinite(minutes) || minutes < 0) {
                    throw new ScheduleValidationError(
                        `Site "${site.id}".travelMinutesTo["${target}"] has invalid minutes: ${minutes}`,
                    );
                }
            }
        }

        byId.set(site.id, site);
    }

    const resolvedTravelMinutes = new Map<string, Map<string, number>>();
    const siteList = [...byId.values()];
    for (const from of siteList) {
        const row = new Map<string, number>();
        resolvedTravelMinutes.set(from.id, row);
        for (const to of siteList) {
            const minutes = resolvePairMinutes(from, to, travelSpeedKmh);
            if (minutes !== undefined) row.set(to.id, minutes);
        }
    }

    return { byId, travelSpeedKmh, resolvedTravelMinutes };
}

function resolvePairMinutes(from: Site, to: Site, travelSpeedKmh?: number): number | undefined {
    if (from.id === to.id) return 0;

    const matrix = from.travelMinutesTo?.[to.id];
    if (matrix !== undefined) return matrix;

    if (
        from.lat !== undefined &&
        from.lng !== undefined &&
        to.lat !== undefined &&
        to.lng !== undefined &&
        travelSpeedKmh !== undefined
    ) {
        const km = haversineDistanceKm(from.lat, from.lng, to.lat, to.lng);
        return Math.round((km / travelSpeedKmh) * 60);
    }

    return undefined;
}

/**
 * Travel time between two sites, in minutes.
 *
 * Returns 0 for the same site, undefined when either site is unknown or no
 * travel data exists for the ordered pair.
 */
export function travelMinutesBetween(index: SiteIndex, from?: string, to?: string): number | undefined {
    if (from === to && from !== undefined) return 0;
    if (from === undefined || to === undefined) return undefined;
    return index.resolvedTravelMinutes.get(from)?.get(to);
}

/**
 * Straight-line distance between two sites, in kilometres.
 *
 * Returns 0 for same site, undefined when either site is unknown or lacks
 * coordinates. Used for display and host-side re-sorting when minutes are not
 * available.
 */
export function distanceKmBetween(index: SiteIndex, from?: string, to?: string): number | undefined {
    if (from === to && from !== undefined) return 0;
    if (from === undefined || to === undefined) return undefined;

    const fromSite = index.byId.get(from);
    const toSite = index.byId.get(to);
    if (!fromSite || !toSite) return undefined;

    if (fromSite.lat !== undefined && fromSite.lng !== undefined && toSite.lat !== undefined && toSite.lng !== undefined) {
        return haversineDistanceKm(fromSite.lat, fromSite.lng, toSite.lat, toSite.lng);
    }

    return undefined;
}
