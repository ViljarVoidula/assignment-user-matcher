import { expect } from 'chai';
import { parseIPv4, parseIPv6, parseIP, parseCIDR, isIpInCidr, checkCidrMatch } from '../src/utils/cidr';

/**
 * CIDR/IP parsing is what gatekeeps location-restricted tasks (`allowedCidrs`)
 * — a parsing bug here either wrongly admits an out-of-range worker or wrongly
 * locks out an in-range one. Pure functions, tested directly as a black box.
 */
describe('CIDR/IP matching utilities', function () {
    describe('parseIPv4', function () {
        it('rejects an address with the wrong number of octets', function () {
            expect(parseIPv4('1.2.3')).to.be.null;
        });

        it('rejects an out-of-range octet', function () {
            expect(parseIPv4('1.256.3.4')).to.be.null;
        });

        it('parses a valid IPv4 address', function () {
            expect(parseIPv4('192.168.1.1')).to.equal((192n << 24n) | (168n << 16n) | (1n << 8n) | 1n);
        });
    });

    describe('parseIPv6', function () {
        it('rejects an invalid embedded IPv4-mapped address', function () {
            expect(parseIPv6('::ffff:999.1.1.1')).to.be.null;
        });

        it('parses a valid IPv4-mapped address', function () {
            expect(parseIPv6('::ffff:192.168.1.1')).to.not.be.null;
        });

        it('rejects an address with more than one "::" group', function () {
            expect(parseIPv6('1::2::3')).to.be.null;
        });

        it('rejects "::" expansion that would need a negative number of groups', function () {
            expect(parseIPv6('1:2:3:4:5:6:7::8:9')).to.be.null;
        });

        it('rejects a full address without "::" that has the wrong group count', function () {
            expect(parseIPv6('1:2:3:4:5:6:7')).to.be.null;
        });

        it('rejects a group longer than 4 hex digits', function () {
            expect(parseIPv6('1:2:3:4:5:6:7:abcde')).to.be.null;
        });

        it('rejects an empty group outside of "::" expansion', function () {
            expect(parseIPv6('1:2:3:4:5:6:7:')).to.be.null;
        });

        it('rejects a non-hex group', function () {
            expect(parseIPv6('1:2:3:4:5:6:7:gggg')).to.be.null;
        });

        it('parses a valid compressed address', function () {
            expect(parseIPv6('2001:db8::1')).to.not.be.null;
        });
    });

    describe('parseIP', function () {
        it('returns null for an invalid dotted address with no colon', function () {
            expect(parseIP('999.1.1.1')).to.be.null;
        });

        it('returns null for an unparseable address containing a colon', function () {
            expect(parseIP('not:valid:ip')).to.be.null;
        });

        it('returns null for an empty or non-string input', function () {
            expect(parseIP('')).to.be.null;
        });
    });

    describe('parseCIDR', function () {
        it('returns null for an empty input', function () {
            expect(parseCIDR('')).to.be.null;
        });

        it('returns null when there is no exactly-one "/"', function () {
            expect(parseCIDR('192.168.1.0')).to.be.null;
            expect(parseCIDR('192.168.1.0/24/extra')).to.be.null;
        });

        it('returns null when the address part is unparseable', function () {
            expect(parseCIDR('garbage/24')).to.be.null;
        });

        it('returns null when the prefix length is not a number or out of range', function () {
            expect(parseCIDR('192.168.1.0/abc')).to.be.null;
            expect(parseCIDR('192.168.1.0/-1')).to.be.null;
            expect(parseCIDR('192.168.1.0/33')).to.be.null;
            expect(parseCIDR('2001:db8::/129')).to.be.null;
        });

        it('parses a valid IPv4 and IPv6 CIDR', function () {
            expect(parseCIDR('192.168.1.0/24')).to.deep.include({ prefixLength: 24, isIPv6: false });
            expect(parseCIDR('2001:db8::/32')).to.deep.include({ prefixLength: 32, isIPv6: true });
        });
    });

    describe('isIpInCidr', function () {
        it('returns false when the IP or CIDR is unparseable', function () {
            expect(isIpInCidr('not-an-ip', '192.168.1.0/24')).to.equal(false);
            expect(isIpInCidr('192.168.1.5', 'not-a-cidr')).to.equal(false);
        });

        it('returns false when IP and CIDR versions differ', function () {
            expect(isIpInCidr('2001:db8::1', '192.168.1.0/24')).to.equal(false);
        });

        it('returns true for an IP inside the range and false for one outside it', function () {
            expect(isIpInCidr('192.168.1.42', '192.168.1.0/24')).to.equal(true);
            expect(isIpInCidr('192.168.2.42', '192.168.1.0/24')).to.equal(false);
        });
    });

    describe('checkCidrMatch', function () {
        it('allows any IP when no CIDRs are specified', function () {
            expect(checkCidrMatch('1.2.3.4', undefined)).to.equal(true);
            expect(checkCidrMatch('1.2.3.4', [])).to.equal(true);
        });

        it('denies a match when CIDRs are specified but the user has no IP', function () {
            expect(checkCidrMatch(undefined, ['192.168.1.0/24'])).to.equal(false);
        });

        it('matches against any CIDR in the list', function () {
            expect(checkCidrMatch('10.0.0.5', ['192.168.1.0/24', '10.0.0.0/8'])).to.equal(true);
        });

        it('denies when the IP matches none of the CIDRs', function () {
            expect(checkCidrMatch('172.16.0.5', ['192.168.1.0/24', '10.0.0.0/8'])).to.equal(false);
        });
    });
});
