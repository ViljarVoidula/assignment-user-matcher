import Matcher from '../src/matcher.class';
import { createClient } from 'redis';
import { expect } from 'chai';
import { parseIPv6, isIpInCidr } from '../src/utils/cidr';

describe('Matcher CIDR/Network Matching Tests', function () {
    this.timeout(5000);
    let matcher: Matcher;
    let redisClient: any;

    before(async function () {
        redisClient = await createClient({});
        await redisClient.connect();

        matcher = new Matcher(redisClient, {
            maxUserBacklogSize: 5,
            relevantBatchSize: 20,
            redisPrefix: 'cidr_test:',
        });
    });

    beforeEach(async function () {
        await matcher.redisClient.flushAll();
    });

    after(async function () {
        await redisClient.quit();
    });

    describe('CIDR Utils Edge Cases', function () {
        it('should reject IPv6 with multiple :: compressions', function () {
            expect(parseIPv6('2001:db8::1::1')).to.equal(null);
        });

        it('should parse IPv4-mapped IPv6 and match CIDR', function () {
            // IPv4-mapped IPv6 addresses are treated as IPv6 in this implementation.
            expect(isIpInCidr('::ffff:192.168.1.1', '192.168.1.0/24')).to.equal(false);

            expect(isIpInCidr('::ffff:192.168.1.1', '::ffff:192.168.1.0/120')).to.equal(true);
            expect(isIpInCidr('::ffff:192.168.2.1', '::ffff:192.168.1.0/120')).to.equal(false);
        });
    });

    describe('IPv4 CIDR Matching', function () {
        it('should match user IP within allowed CIDR /24', async function () {
            // User with IP in 192.168.1.0/24 range
            await matcher.addUser({
                id: 'user1',
                tags: ['support'],
                ip: '192.168.1.100',
            });

            // Assignment restricted to 192.168.1.0/24
            await matcher.addAssignment({
                id: 'assignment1',
                tags: ['support'],
                priority: 100,
                allowedCidrs: ['192.168.1.0/24'],
            });

            await matcher.matchUsersAssignments();
            const assignments = await matcher.getCurrentAssignmentsForUser('user1');

            expect(assignments).to.include('assignment1');
        });

        it('should NOT match user IP outside allowed CIDR', async function () {
            // User with IP outside 192.168.1.0/24
            await matcher.addUser({
                id: 'user1',
                tags: ['support'],
                ip: '192.168.2.100',
            });

            // Assignment restricted to 192.168.1.0/24
            await matcher.addAssignment({
                id: 'assignment1',
                tags: ['support'],
                priority: 100,
                allowedCidrs: ['192.168.1.0/24'],
            });

            await matcher.matchUsersAssignments();
            const assignments = await matcher.getCurrentAssignmentsForUser('user1');

            expect(assignments).to.not.include('assignment1');
        });

        it('should match assignment with multiple allowed CIDRs', async function () {
            await matcher.addUser({
                id: 'user1',
                tags: ['support'],
                ip: '10.0.0.50',
            });

            await matcher.addAssignment({
                id: 'assignment1',
                tags: ['support'],
                priority: 100,
                allowedCidrs: ['192.168.1.0/24', '10.0.0.0/8'],
            });

            await matcher.matchUsersAssignments();
            const assignments = await matcher.getCurrentAssignmentsForUser('user1');

            expect(assignments).to.include('assignment1');
        });

        it('should match assignment without allowedCidrs to any user', async function () {
            await matcher.addUser({
                id: 'user1',
                tags: ['support'],
                ip: '203.0.113.50',
            });

            // No CIDR restriction
            await matcher.addAssignment({
                id: 'assignment1',
                tags: ['support'],
                priority: 100,
            });

            await matcher.matchUsersAssignments();
            const assignments = await matcher.getCurrentAssignmentsForUser('user1');

            expect(assignments).to.include('assignment1');
        });

        it('should match assignment without allowedCidrs to user without IP', async function () {
            await matcher.addUser({
                id: 'user1',
                tags: ['support'],
                // No IP specified
            });

            await matcher.addAssignment({
                id: 'assignment1',
                tags: ['support'],
                priority: 100,
            });

            await matcher.matchUsersAssignments();
            const assignments = await matcher.getCurrentAssignmentsForUser('user1');

            expect(assignments).to.include('assignment1');
        });

        it('should NOT match CIDR-restricted assignment to user without IP', async function () {
            await matcher.addUser({
                id: 'user1',
                tags: ['support'],
                // No IP specified
            });

            await matcher.addAssignment({
                id: 'assignment1',
                tags: ['support'],
                priority: 100,
                allowedCidrs: ['192.168.1.0/24'],
            });

            await matcher.matchUsersAssignments();
            const assignments = await matcher.getCurrentAssignmentsForUser('user1');

            expect(assignments).to.not.include('assignment1');
        });

        it('should handle /32 (single IP) CIDR', async function () {
            await matcher.addUser({
                id: 'user1',
                tags: ['support'],
                ip: '192.168.1.100',
            });

            await matcher.addAssignment({
                id: 'assignment1',
                tags: ['support'],
                priority: 100,
                allowedCidrs: ['192.168.1.100/32'],
            });

            await matcher.matchUsersAssignments();
            const assignments = await matcher.getCurrentAssignmentsForUser('user1');

            expect(assignments).to.include('assignment1');
        });

        it('should handle /0 (all IPs) CIDR', async function () {
            await matcher.addUser({
                id: 'user1',
                tags: ['support'],
                ip: '8.8.8.8',
            });

            await matcher.addAssignment({
                id: 'assignment1',
                tags: ['support'],
                priority: 100,
                allowedCidrs: ['0.0.0.0/0'],
            });

            await matcher.matchUsersAssignments();
            const assignments = await matcher.getCurrentAssignmentsForUser('user1');

            expect(assignments).to.include('assignment1');
        });
    });

    describe('IPv6 CIDR Matching', function () {
        it('should match user IPv6 within allowed CIDR /64', async function () {
            await matcher.addUser({
                id: 'user1',
                tags: ['support'],
                ip: '2001:db8:85a3::8a2e:370:7334',
            });

            await matcher.addAssignment({
                id: 'assignment1',
                tags: ['support'],
                priority: 100,
                allowedCidrs: ['2001:db8:85a3::/64'],
            });

            await matcher.matchUsersAssignments();
            const assignments = await matcher.getCurrentAssignmentsForUser('user1');

            expect(assignments).to.include('assignment1');
        });

        it('should NOT match user IPv6 outside allowed CIDR', async function () {
            await matcher.addUser({
                id: 'user1',
                tags: ['support'],
                ip: '2001:db8:1234::1',
            });

            await matcher.addAssignment({
                id: 'assignment1',
                tags: ['support'],
                priority: 100,
                allowedCidrs: ['2001:db8:85a3::/48'],
            });

            await matcher.matchUsersAssignments();
            const assignments = await matcher.getCurrentAssignmentsForUser('user1');

            expect(assignments).to.not.include('assignment1');
        });

        it('should handle compressed IPv6 addresses', async function () {
            await matcher.addUser({
                id: 'user1',
                tags: ['support'],
                ip: '::1', // localhost
            });

            await matcher.addAssignment({
                id: 'assignment1',
                tags: ['support'],
                priority: 100,
                allowedCidrs: ['::1/128'],
            });

            await matcher.matchUsersAssignments();
            const assignments = await matcher.getCurrentAssignmentsForUser('user1');

            expect(assignments).to.include('assignment1');
        });

        it('should handle full IPv6 addresses', async function () {
            await matcher.addUser({
                id: 'user1',
                tags: ['support'],
                ip: '2001:0db8:0000:0000:0000:0000:0000:0001',
            });

            await matcher.addAssignment({
                id: 'assignment1',
                tags: ['support'],
                priority: 100,
                allowedCidrs: ['2001:db8::/32'],
            });

            await matcher.matchUsersAssignments();
            const assignments = await matcher.getCurrentAssignmentsForUser('user1');

            expect(assignments).to.include('assignment1');
        });

        it('should handle /128 (single IP) IPv6 CIDR', async function () {
            await matcher.addUser({
                id: 'user1',
                tags: ['support'],
                ip: '2001:db8::1',
            });

            await matcher.addAssignment({
                id: 'assignment1',
                tags: ['support'],
                priority: 100,
                allowedCidrs: ['2001:db8::1/128'],
            });

            await matcher.matchUsersAssignments();
            const assignments = await matcher.getCurrentAssignmentsForUser('user1');

            expect(assignments).to.include('assignment1');
        });
    });

    describe('Mixed IPv4 and IPv6', function () {
        it('should NOT match IPv4 user with IPv6 CIDR', async function () {
            await matcher.addUser({
                id: 'user1',
                tags: ['support'],
                ip: '192.168.1.100',
            });

            await matcher.addAssignment({
                id: 'assignment1',
                tags: ['support'],
                priority: 100,
                allowedCidrs: ['2001:db8::/32'],
            });

            await matcher.matchUsersAssignments();
            const assignments = await matcher.getCurrentAssignmentsForUser('user1');

            expect(assignments).to.not.include('assignment1');
        });

        it('should NOT match IPv6 user with IPv4 CIDR', async function () {
            await matcher.addUser({
                id: 'user1',
                tags: ['support'],
                ip: '2001:db8::1',
            });

            await matcher.addAssignment({
                id: 'assignment1',
                tags: ['support'],
                priority: 100,
                allowedCidrs: ['192.168.1.0/24'],
            });

            await matcher.matchUsersAssignments();
            const assignments = await matcher.getCurrentAssignmentsForUser('user1');

            expect(assignments).to.not.include('assignment1');
        });

        it('should match when assignment allows both IPv4 and IPv6 ranges', async function () {
            await matcher.addUser({
                id: 'user_ipv4',
                tags: ['support'],
                ip: '192.168.1.100',
            });

            await matcher.addUser({
                id: 'user_ipv6',
                tags: ['support'],
                ip: '2001:db8::1',
            });

            await matcher.addAssignment({
                id: 'assignment1',
                tags: ['support'],
                priority: 100,
                allowedCidrs: ['192.168.1.0/24', '2001:db8::/32'],
            });

            await matcher.addAssignment({
                id: 'assignment2',
                tags: ['support'],
                priority: 100,
                allowedCidrs: ['192.168.1.0/24', '2001:db8::/32'],
            });

            await matcher.matchUsersAssignments();

            const ipv4Assignments = await matcher.getCurrentAssignmentsForUser('user_ipv4');
            const ipv6Assignments = await matcher.getCurrentAssignmentsForUser('user_ipv6');

            expect(ipv4Assignments.length).to.be.greaterThan(0);
            expect(ipv6Assignments.length).to.be.greaterThan(0);
        });
    });

    describe('Multiple Users with Different IPs', function () {
        it('should correctly distribute assignments based on CIDR restrictions', async function () {
            // User in office network
            await matcher.addUser({
                id: 'office_user',
                tags: ['support'],
                ip: '10.0.1.50',
            });

            // User in VPN network
            await matcher.addUser({
                id: 'vpn_user',
                tags: ['support'],
                ip: '172.16.0.100',
            });

            // Office-only assignment
            await matcher.addAssignment({
                id: 'office_assignment',
                tags: ['support'],
                priority: 100,
                allowedCidrs: ['10.0.0.0/8'],
            });

            // VPN-only assignment
            await matcher.addAssignment({
                id: 'vpn_assignment',
                tags: ['support'],
                priority: 100,
                allowedCidrs: ['172.16.0.0/12'],
            });

            await matcher.matchUsersAssignments();

            const officeAssignments = await matcher.getCurrentAssignmentsForUser('office_user');
            const vpnAssignments = await matcher.getCurrentAssignmentsForUser('vpn_user');

            expect(officeAssignments).to.include('office_assignment');
            expect(officeAssignments).to.not.include('vpn_assignment');
            expect(vpnAssignments).to.include('vpn_assignment');
            expect(vpnAssignments).to.not.include('office_assignment');
        });
    });

    describe('Edge Cases', function () {
        it('should handle empty allowedCidrs array as unrestricted', async function () {
            await matcher.addUser({
                id: 'user1',
                tags: ['support'],
                ip: '192.168.1.100',
            });

            await matcher.addAssignment({
                id: 'assignment1',
                tags: ['support'],
                priority: 100,
                allowedCidrs: [],
            });

            await matcher.matchUsersAssignments();
            const assignments = await matcher.getCurrentAssignmentsForUser('user1');

            expect(assignments).to.include('assignment1');
        });

        it('should handle invalid CIDR gracefully (no match)', async function () {
            await matcher.addUser({
                id: 'user1',
                tags: ['support'],
                ip: '192.168.1.100',
            });

            await matcher.addAssignment({
                id: 'assignment1',
                tags: ['support'],
                priority: 100,
                allowedCidrs: ['invalid-cidr'],
            });

            await matcher.matchUsersAssignments();
            const assignments = await matcher.getCurrentAssignmentsForUser('user1');

            // Invalid CIDR should not match
            expect(assignments).to.not.include('assignment1');
        });

        it('should handle invalid user IP gracefully', async function () {
            await matcher.addUser({
                id: 'user1',
                tags: ['support'],
                ip: 'not-an-ip',
            });

            await matcher.addAssignment({
                id: 'assignment1',
                tags: ['support'],
                priority: 100,
                allowedCidrs: ['192.168.1.0/24'],
            });

            await matcher.matchUsersAssignments();
            const assignments = await matcher.getCurrentAssignmentsForUser('user1');

            expect(assignments).to.not.include('assignment1');
        });

        it('should work with CIDR matching AND tag-based matching combined', async function () {
            // Create a separate matcher with enableDefaultMatching disabled for this test
            const strictMatcher = new Matcher(redisClient, {
                maxUserBacklogSize: 5,
                relevantBatchSize: 20,
                redisPrefix: 'cidr_strict_test:',
                enableDefaultMatching: false, // Disable default matching to test strict tag matching
            });
            await strictMatcher.redisClient.flushAll();

            // User with correct IP but wrong tags
            await strictMatcher.addUser({
                id: 'user_wrong_tags',
                tags: ['billing'],
                ip: '192.168.1.100',
            });

            // User with correct tags but wrong IP
            await strictMatcher.addUser({
                id: 'user_wrong_ip',
                tags: ['support'],
                ip: '10.0.0.1',
            });

            // User with both correct
            await strictMatcher.addUser({
                id: 'user_correct',
                tags: ['support'],
                ip: '192.168.1.50',
            });

            await strictMatcher.addAssignment({
                id: 'assignment1',
                tags: ['support'],
                priority: 100,
                allowedCidrs: ['192.168.1.0/24'],
            });

            await strictMatcher.matchUsersAssignments();

            const wrongTagsAssignments = await strictMatcher.getCurrentAssignmentsForUser('user_wrong_tags');
            const wrongIpAssignments = await strictMatcher.getCurrentAssignmentsForUser('user_wrong_ip');
            const correctAssignments = await strictMatcher.getCurrentAssignmentsForUser('user_correct');

            // Only user_correct should get the assignment (correct tags AND correct IP)
            expect(correctAssignments).to.include('assignment1');
            expect(wrongTagsAssignments).to.not.include('assignment1');
            expect(wrongIpAssignments).to.not.include('assignment1');
        });
    });
});
