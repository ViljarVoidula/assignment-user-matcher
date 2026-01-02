/**
 * CIDR/IP Matching Utilities
 * Pure functions for IPv4/IPv6 parsing and CIDR range matching
 */

/**
 * Parse an IPv4 address into a BigInt representation
 */
export function parseIPv4(ip: string): bigint | null {
    const parts = ip.split('.');
    if (parts.length !== 4) return null;
    
    let result = 0n;
    for (const part of parts) {
        const num = parseInt(part, 10);
        if (isNaN(num) || num < 0 || num > 255) return null;
        result = (result << 8n) | BigInt(num);
    }
    return result;
}

/**
 * Parse an IPv6 address into a BigInt representation
 * Handles full, compressed (::), and IPv4-mapped formats
 */
export function parseIPv6(ip: string): bigint | null {
    // Handle IPv4-mapped IPv6 (::ffff:192.168.1.1)
    const ipv4MappedMatch = ip.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
    if (ipv4MappedMatch) {
        const ipv4 = parseIPv4(ipv4MappedMatch[1]);
        if (ipv4 === null) return null;
        return 0xffff00000000n | ipv4;
    }

    // Handle :: expansion
    let fullIp = ip.toLowerCase();
    
    if (fullIp.includes('::')) {
        const parts = fullIp.split('::');
        if (parts.length > 2) return null; // Invalid: more than one ::
        
        const leftParts = parts[0] ? parts[0].split(':') : [];
        const rightParts = parts[1] ? parts[1].split(':') : [];
        const missingGroups = 8 - leftParts.length - rightParts.length;
        
        if (missingGroups < 0) return null;
        
        const allParts = [...leftParts, ...Array(missingGroups).fill('0'), ...rightParts];
        fullIp = allParts.join(':');
    }

    const groups = fullIp.split(':');
    if (groups.length !== 8) return null;

    let result = 0n;
    for (const group of groups) {
        if (group.length === 0 || group.length > 4) return null;
        const num = parseInt(group, 16);
        if (isNaN(num) || num < 0 || num > 0xffff) return null;
        result = (result << 16n) | BigInt(num);
    }
    return result;
}

/**
 * Parse an IP address (auto-detect IPv4 or IPv6)
 * Returns { value: BigInt, isIPv6: boolean } or null if invalid
 */
export function parseIP(ip: string): { value: bigint; isIPv6: boolean } | null {
    if (!ip || typeof ip !== 'string') return null;
    
    const trimmed = ip.trim();
    
    // Try IPv4 first (contains dots, no colons)
    if (trimmed.includes('.') && !trimmed.includes(':')) {
        const value = parseIPv4(trimmed);
        if (value !== null) return { value, isIPv6: false };
    }
    
    // Try IPv6 (contains colons)
    if (trimmed.includes(':')) {
        const value = parseIPv6(trimmed);
        if (value !== null) return { value, isIPv6: true };
    }
    
    return null;
}

/**
 * Parse a CIDR notation string (e.g., '192.168.1.0/24' or '2001:db8::/32')
 * Returns { network: BigInt, prefixLength: number, isIPv6: boolean } or null
 */
export function parseCIDR(cidr: string): { network: bigint; prefixLength: number; isIPv6: boolean } | null {
    if (!cidr || typeof cidr !== 'string') return null;
    
    const parts = cidr.trim().split('/');
    if (parts.length !== 2) return null;
    
    const ip = parseIP(parts[0]);
    if (!ip) return null;
    
    const prefixLength = parseInt(parts[1], 10);
    const maxPrefix = ip.isIPv6 ? 128 : 32;
    
    if (isNaN(prefixLength) || prefixLength < 0 || prefixLength > maxPrefix) return null;
    
    // Calculate network address by masking
    const totalBits = ip.isIPv6 ? 128 : 32;
    const hostBits = totalBits - prefixLength;
    const mask = hostBits === totalBits ? 0n : ((1n << BigInt(totalBits)) - 1n) ^ ((1n << BigInt(hostBits)) - 1n);
    const network = ip.value & mask;
    
    return { network, prefixLength, isIPv6: ip.isIPv6 };
}

/**
 * Check if an IP address is within a CIDR range
 */
export function isIpInCidr(ip: string, cidr: string): boolean {
    const parsedIp = parseIP(ip);
    const parsedCidr = parseCIDR(cidr);
    
    if (!parsedIp || !parsedCidr) return false;
    
    // IP version must match CIDR version
    if (parsedIp.isIPv6 !== parsedCidr.isIPv6) return false;
    
    const totalBits = parsedIp.isIPv6 ? 128 : 32;
    const hostBits = totalBits - parsedCidr.prefixLength;
    const mask = hostBits === totalBits ? 0n : ((1n << BigInt(totalBits)) - 1n) ^ ((1n << BigInt(hostBits)) - 1n);
    
    return (parsedIp.value & mask) === parsedCidr.network;
}

/**
 * Check if a user's IP matches any of the allowed CIDRs
 * Returns true if no CIDRs are specified (open assignment) or if IP matches any CIDR
 */
export function checkCidrMatch(userIp: string | undefined, allowedCidrs: string[] | undefined): boolean {
    // If no CIDR restrictions, assignment is open to all
    if (!allowedCidrs || allowedCidrs.length === 0) return true;
    
    // If CIDRs are specified but user has no IP, deny match
    if (!userIp) return false;
    
    // Check if user IP matches any allowed CIDR
    for (const cidr of allowedCidrs) {
        if (isIpInCidr(userIp, cidr)) return true;
    }
    
    return false;
}
