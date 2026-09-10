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
import { assertIsoDate } from './time';
import { haversineDistanceKm, hasValidCoordinates } from '../utils/geo';

/**
 * A site's zone must match the roster's, because there is only one clock.
 *
 * Instances are placed in absolute period minutes, so rest gaps and overlaps
 * survive a zone difference — but the night band, break windows, weekday and
 * holiday attribution are all resolved once, at expansion, against the period's
 * `PeriodClock`. A Stockholm site inside a Tallinn roster would have its 22:00
 * night boundary computed an hour out, and nothing downstream could tell.
 *
 * Refusing is the honest answer: an hour of silent drift in a compliance
 * verdict is worse than an error that says to split the roster.
 */
function assertSiteZone(siteId: string, siteZone: string, periodTimeZone?: string): void {
    try {
        new Intl.DateTimeFormat('en-US', { timeZone: siteZone });
    } catch {
        throw new ScheduleValidationError(`Site "${siteId}" has an unknown time zone: "${siteZone}"`);
    }

    const rosterZone = periodTimeZone ?? 'UTC';
    if (siteZone !== rosterZone) {
        throw new ScheduleValidationError(
            `Site "${siteId}" is in "${siteZone}" but the roster's period is in "${rosterZone}". ` +
                `One roster resolves wall-clock times against one zone, so a roster spanning zones would ` +
                `place this site's night band, breaks and day boundaries an hour out without reporting it. ` +
                `Solve one roster per zone.`,
        );
    }
}

/**
 * Build a validated site index from caller input.
 *
 * Throws `ScheduleValidationError` for duplicate ids, malformed coordinates,
 * negative matrix entries, or a non-positive fallback speed. Site ids that are
 * referenced by templates or employees but not declared here are tolerated;
 * they simply have no coordinates or matrix entries.
 */
export function buildSiteIndex(sites: Site[] | undefined, travelSpeedKmh?: number, periodTimeZone?: string): SiteIndex {
    if (travelSpeedKmh !== undefined && (!Number.isFinite(travelSpeedKmh) || travelSpeedKmh <= 0)) {
        throw new ScheduleValidationError(`travelSpeedKmh must be a positive finite number: ${travelSpeedKmh}`);
    }

    const byId = new Map<string, Site>();
    for (const site of sites ?? []) {
        if (!site.id) throw new ScheduleValidationError('Site is missing `id`');
        if (byId.has(site.id)) throw new ScheduleValidationError(`Duplicate site id "${site.id}"`);

        for (const date of site.publicHolidays ?? []) {
            assertIsoDate(date, `Site "${site.id}".publicHolidays`);
        }

        if (site.timeZone !== undefined) assertSiteZone(site.id, site.timeZone, periodTimeZone);

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
