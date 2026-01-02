import AssignmentMatcher from './matcher.class';

export type { Assignment, options, Stats, User } from './matcher.class';

// Utility exports for advanced usage
export * from './utils/cidr';
export { createKeyBuilders, type KeyBuilders, type RedisKeyConfig } from './utils/keys';

export { AssignmentMatcher };
export default AssignmentMatcher;
