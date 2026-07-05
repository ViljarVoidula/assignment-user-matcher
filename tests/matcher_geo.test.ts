import Matcher from '../src/matcher.class';
import { createClient } from 'redis';
import { expect } from 'chai';

describe('Matcher Geolocation Tests', function () {
    this.timeout(10000);

    let matcher: Matcher;
    let redisClient: any;
    const redisPrefix = 'geo_test:';

    before(async function () {
        redisClient = await createClient({});
        await redisClient.connect();

        matcher = new Matcher(redisClient, {
            maxUserBacklogSize: 5,
            relevantBatchSize: 20,
            redisPrefix,
            enableGeoMatching: true,
            geoDefaultMaxDistanceKm: 50,
        });
    });

    beforeEach(async function () {
        await matcher.redisClient.flushAll();
    });

    after(async function () {
        await redisClient.quit();
    });

    it('matches assignment when user is within effective geo radius', async function () {
        await matcher.addUser({
            id: 'user-near',
            tags: ['support'],
            latitude: 59.9139,
            longitude: 10.7522, // Oslo
        });

        await matcher.addAssignment({
            id: 'assignment-near',
            tags: ['support'],
            latitude: 59.95,
            longitude: 10.75,
            maxDistanceKm: 10,
        });

        await matcher.matchUsersAssignments('user-near');
        const assignments = await matcher.getCurrentAssignmentsForUser('user-near');

        expect(assignments).to.include('assignment-near');
    });

    it('rejects assignment when user is outside effective geo radius', async function () {
        await matcher.addUser({
            id: 'user-far',
            tags: ['support'],
            latitude: 59.9139,
            longitude: 10.7522, // Oslo
        });

        await matcher.addAssignment({
            id: 'assignment-far',
            tags: ['support'],
            latitude: 60.3913,
            longitude: 5.3221, // Bergen (~300km away)
            maxDistanceKm: 20,
        });

        await matcher.matchUsersAssignments('user-far');
        const assignments = await matcher.getCurrentAssignmentsForUser('user-far');

        expect(assignments).to.not.include('assignment-far');
    });

    it('uses strict requireGeo to reject users without coordinates', async function () {
        await matcher.addUser({
            id: 'user-no-geo',
            tags: ['support'],
        });

        await matcher.addAssignment({
            id: 'assignment-require-geo',
            tags: ['support'],
            requireGeo: true,
            latitude: 59.9139,
            longitude: 10.7522,
        });

        await matcher.matchUsersAssignments('user-no-geo');
        const assignments = await matcher.getCurrentAssignmentsForUser('user-no-geo');

        expect(assignments).to.not.include('assignment-require-geo');
    });

    it('rejects a user without coordinates when the assignment specifies coordinates, even without requireGeo', async function () {
        await matcher.addUser({
            id: 'user-no-coords',
            tags: ['support'],
        });

        await matcher.addAssignment({
            id: 'assignment-with-coords',
            tags: ['support'],
            latitude: 59.9139,
            longitude: 10.7522,
            maxDistanceKm: 10,
        });

        await matcher.matchUsersAssignments('user-no-coords');
        const assignments = await matcher.getCurrentAssignmentsForUser('user-no-coords');

        expect(assignments).to.not.include('assignment-with-coords');
    });

    it('still matches when neither the user nor the assignment configured coordinates', async function () {
        await matcher.addUser({
            id: 'user-no-coords-2',
            tags: ['support'],
        });

        await matcher.addAssignment({
            id: 'assignment-no-coords',
            tags: ['support'],
        });

        await matcher.matchUsersAssignments('user-no-coords-2');
        const assignments = await matcher.getCurrentAssignmentsForUser('user-no-coords-2');

        expect(assignments).to.include('assignment-no-coords');
    });

    it('uses the tightest cap among assignment, user, and global defaults', async function () {
        await matcher.addUser({
            id: 'user-tight-cap',
            tags: ['support'],
            latitude: 59.9139,
            longitude: 10.7522,
            maxTravelDistanceKm: 15,
        });

        await matcher.addAssignment({
            id: 'assignment-tight-cap',
            tags: ['support'],
            latitude: 60.0,
            longitude: 10.75, // ~9-10km away from user
            maxDistanceKm: 100,
        });

        await matcher.matchUsersAssignments('user-tight-cap');
        const assignments = await matcher.getCurrentAssignmentsForUser('user-tight-cap');

        expect(assignments).to.include('assignment-tight-cap');

        await matcher.removeUser('user-tight-cap');

        await matcher.addUser({
            id: 'user-tight-cap-2',
            tags: ['support'],
            latitude: 59.9139,
            longitude: 10.7522,
            maxTravelDistanceKm: 5,
        });

        await matcher.matchUsersAssignments('user-tight-cap-2');
        const secondAssignments = await matcher.getCurrentAssignmentsForUser('user-tight-cap-2');

        expect(secondAssignments).to.not.include('assignment-tight-cap');
    });

    it('honors custom geoMatchingFunction override', async function () {
        const overrideMatcher = new Matcher(redisClient, {
            redisPrefix: 'geo_override:',
            enableGeoMatching: true,
            geoMatchingFunction: async () => ({
                eligible: false,
            }),
        });

        await overrideMatcher.redisClient.flushAll();

        await overrideMatcher.addUser({
            id: 'user-custom',
            tags: ['support'],
            latitude: 59.9139,
            longitude: 10.7522,
        });

        await overrideMatcher.addAssignment({
            id: 'assignment-custom',
            tags: ['support'],
            latitude: 59.95,
            longitude: 10.75,
        });

        await overrideMatcher.matchUsersAssignments('user-custom');
        const assignments = await overrideMatcher.getCurrentAssignmentsForUser('user-custom');

        expect(assignments).to.not.include('assignment-custom');
    });

    it('indexes valid 0,0 coordinates in Redis GEO set', async function () {
        await matcher.addAssignment({
            id: 'assignment-zero',
            tags: ['support'],
            latitude: 0,
            longitude: 0,
        });

        const coords = await matcher.redisClient.geoPos(`${redisPrefix}assignments:geo`, 'assignment-zero');
        expect(coords).to.be.an('array');
        expect(coords[0]).to.not.equal(null);
    });
});
