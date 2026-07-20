import { expect } from 'chai';
import { checkGeoMatch } from '../src/utils/geo';
import type { User, Assignment } from '../src/types/matcher';

describe('checkGeoMatch', function () {
    it('is eligible at any distance when neither side sets a distance cap', function () {
        const user: User = { id: 'u1', tags: [], latitude: 59.437, longitude: 24.7536 };
        const assignment: Assignment = { id: 'a1', tags: [], latitude: 40.7128, longitude: -74.006 };

        const result = checkGeoMatch(user, assignment, { enabled: true });
        expect(result.eligible).to.equal(true);
        expect(result.effectiveMaxDistanceKm).to.be.undefined;
        expect(result.distanceKm).to.be.a('number');
    });
});
