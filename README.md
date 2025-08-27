# `assignment-user-matcher`: Lightning-Fast, Tag-Based User & Assignment Matching

[![npm version](https://badge.fury.io/js/assignment-user-matcher.svg)](https://badge.fury.io/js/assignment-user-matcher)
[![CI Pipeline](https://github.com/ViljarVoidula/assignment-user-matcher/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/ViljarVoidula/assignment-user-matcher/actions/workflows/npm-publish.yml)

<!-- Add other badges if you have them, e.g., build status, test coverage -->

**Tired of inefficiently assigning tasks or struggling to connect the right users with the right work? `assignment-user-matcher` is a specialized Node.js library designed for high-performance, near real-time matching of a smaller pool of users to a large volume of assignments, primarily based on shared tags and priority.**

It leverages the speed and efficiency of Redis to deliver a robust solution perfect for scenarios like call centers, customer support queues, back-office operations, and more.

## The Challenge: Efficiently Connecting Users to Work

In many applications, from customer service platforms to internal task management systems, the core challenge remains the same: how do you quickly and accurately assign incoming work (assignments) to the best available person (user)? This becomes particularly complex when dealing with:

- **Large volumes of incoming assignments:** Tasks can pile up quickly, demanding immediate attention.
- **Real-time requirements:** Users expect instant responses, and assignments need prompt handling.
- **Varying skill sets and priorities:** Not all users are equipped for all tasks, and some assignments are more critical than others.

Traditional matching systems can become bottlenecks, leading to delays, suboptimal pairings, and frustrated users or customers.

## Introducing `assignment-user-matcher`: Your Solution for Smart Task Distribution

`assignment-user-matcher` tackles these challenges head-on by providing a specialized engine optimized for a common pattern: a relatively small, active set of users (like support agents or back-office staff) processing a continuous, large stream of assignments.

**Key Features:**

- **Tag-Based Matching:** Intelligently connect users and assignments based on an intersection of descriptive tags (e.g., skills, language, department).
- **Priority-Aware:** Ensure that high-priority assignments are surfaced and processed first.
- **Redis-Powered:** Utilizes Redis for its in-memory data structures, enabling blazing-fast lookups and operations.
- **Optimized for Specific Scenarios:** Excels where a smaller group of users handles a large number of assignments.
- **User Backlog Management:** Prevents users from being overwhelmed by limiting the number of assignments they can be tentatively matched with.

## Why `assignment-user-matcher`?

- 🚀 **Speed:** Designed for near real-time performance, ensuring assignments are matched and delivered swiftly.
- 🎯 **Accuracy:** Improves the quality of matches by considering relevant tags and priorities.
- ⚙️ **Efficiency:** Optimizes resource allocation, ensuring users are working on the most appropriate and urgent tasks.
- 😌 **Improved Experience:** Leads to faster response times for customers and a more streamlined workflow for users.
- 💡 **Scalable (for its niche):** Handles a large throughput of assignments efficiently.

## Core Concepts: How It Works

`assignment-user-matcher` operates on a few key principles:

1.  **Users and Assignments Have Tags:**

    - **Users:** Each user is defined by an ID and a set of `tags` representing their skills, capabilities, or any other relevant attributes (e.g., `['english', 'billing_support', 'tier_1']`).
    - **Assignments:** Each assignment has an ID, `tags` describing its requirements (e.g., `['english', 'billing_inquiry']`), and a `createdAt` timestamp (or a custom priority score) to determine its urgency.

2.  **Matching via Tag Intersection:**
    The core matching logic finds users whose tags have a common intersection with an assignment's tags.

3.  **Prioritization Engine:**
    Assignments are typically processed in the order they are received or by a custom prioritization function you can provide. This ensures that older or more critical assignments get attention first. The library aims to match the highest priority assignments to available, suitable users.

4.  **Redis as the Backbone:**
    Redis is used to store user availability, assignment details, and manage the matching process. Its speed is crucial for the near real-time performance of the library. Users are maintained in sorted sets based on their backlog size and last activity, ensuring fair and efficient distribution.

5.  **User Backlog (`maxUserBacklogSize`):**
    To prevent any single user from being assigned too many tasks at once (even if they are a match), `assignment-user-matcher` maintains a backlog for each user. New assignments are only matched if a user's backlog is below this threshold.

## Real-World Use Cases

`assignment-user-matcher` is particularly well-suited for:

- **📞 Call Centers:** Routing incoming calls (assignments) to the agent (user) with the right language skills, product knowledge, and availability.
- **🎫 Customer Support Ticketing:** Assigning new support tickets to support agents based on their expertise (e.g., "technical_issue," "api_support") and the ticket's urgency.
- **🗄️ Back-Office Operations:** Distributing tasks like data entry, document verification, or claims processing to available staff members based on task type and employee skills.
- **🚗 Gig Economy Platforms (Niche):** Matching available service providers to incoming customer requests where the provider pool is managed and assignments are plentiful (e.g., a dispatch system for a fleet of delivery drivers).
- ** Leads Distribution:** Assigning sales leads to representatives based on territory, product specialization, or lead score.

## Getting Started

### 1. Installation

```bash
npm install assignment-user-matcher redis
# or
yarn add assignment-user-matcher redis
# or
pnpm add assignment-user-matcher redis
```

### 2. Basic Usage

Here's a simple example to get you up and running:

```javascript
import AssignmentMatcher from 'assignment-user-matcher'; // or `import { AssignmentMatcher } from 'assignment-user-matcher';`
import { createClient } from 'redis';

async function runExample() {
    // Connect to your Redis instance
    const redisClient = createClient({
        // url: 'redis://your-redis-host:6379' // Optional: specify Redis URL if not default
    });
    await redisClient.connect();
    console.log('Connected to Redis.');

    const assignmentMatcher = new AssignmentMatcher(redisClient, {
        redisPrefix: 'exampleApp:', // Good practice to namespace your Redis keys
        maxUserBacklogSize: 5, // Max 5 assignments per user backlog
        enableDefaultMatching: true,
    });

    // Add a user
    await assignmentMatcher.addUser({
        id: 'agent_007',
        tags: ['english', 'technical_support', 'vip_clients'],
    });
    console.log("User 'agent_007' added.");

    // Add an assignment
    await assignmentMatcher.addAssignment({
        id: 'ticket_12345',
        tags: ['english', 'technical_support'],
        createdAt: new Date().getTime(), // Use current time for priority
    });
    console.log("Assignment 'ticket_12345' added.");

    // Run the matching process
    // This will attempt to match pending assignments to available users
    console.log('Running matching process...');
    await assignmentMatcher.matchUsersAssignments();

    // Check current assignments for the user
    const userAssignments = await assignmentMatcher.getCurrentAssignmentsForUser('agent_007');
    console.log(`Assignments for 'agent_007':`, userAssignments);

    if (userAssignments && userAssignments.length > 0) {
        console.log(`User 'agent_007' is matched with assignment '${userAssignments[0].id}'.`);
    } else {
        console.log(`User 'agent_007' has no assignments currently.`);
    }

    // Clean up (optional, depending on your Redis setup)
    // await redisClient.flushDb(); // Be careful with this in production!
    await redisClient.quit();
    console.log('Disconnected from Redis.');
}

runExample().catch(console.error);
```

## API Reference

The main class provided is `AssignmentMatcher`.

### `new AssignmentMatcher(redisClient, options?)`

Creates a new `AssignmentMatcher` instance.

- `redisClient`: An initialized and connected `redis` client instance (version 4+).
- `options` (Optional): Configuration options for the matcher. See [Options](#options) below.

### `addUser(user: User): Promise<void>`

Adds or updates a user in the system.

- `user`: An object representing the user.
    - `id: string`: Unique identifier for the user.
    - `tags: string[]`: Array of tags associated with the user.

### `addAssignment(assignment: Assignment): Promise<void>`

Adds a new assignment to be matched.

- `assignment`: An object representing the assignment.
    - `id: string`: Unique identifier for the assignment.
    - `tags: string[]`: Array of tags required for the assignment.
    - `createdAt: number`: Timestamp (e.g., `new Date().getTime()`) indicating when the assignment was created. Used for default prioritization (older assignments get higher priority). Can be influenced by `prioritizationFunction`.
    - `priority?: number | string`: Optional explicit priority. If `prioritizationFunction` is used, this might be an input to it.

### `matchUsersAssignments(): Promise<void>`

Triggers the matching process. This method iterates through pending assignments and tries to match them with suitable, available users based on tags and user backlog capacity.

### `getCurrentAssignmentsForUser(userId: string): Promise<Assignment[]>`

Retrieves the current list of assignments that a user is tentatively matched with (i.e., in their backlog).

- `userId: string`: The ID of the user.

### `removeUser(userId: string): Promise<void>`

Removes a user from the system and clears their assignment backlog.

### `removeAssignment(assignmentId: string, tags: string[]): Promise<void>`

Removes a specific assignment from the system. Requires tags to efficiently locate the assignment in Redis.

### `completeAssignmentForUser(userId: string, assignmentId: string): Promise<void>`

Marks an assignment as completed by a user, removing it from their backlog and potentially making them available for new assignments.

## Options

You can pass an options object to the `AssignmentMatcher` constructor:

```typescript
type Options = {
    // How many of the highest-priority assignments to consider in one matching batch.
    // A larger batch might find more matches but could be slower.
    relevantBatchSize?: number; // Default: 50

    // Prefix for all Redis keys used by this library. Useful for namespacing
    // if you use the same Redis instance for multiple applications or purposes.
    redisPrefix?: string; // Default: '' (empty string)

    // The maximum number of assignments a user can have in their "tentative" backlog.
    // Once a user reaches this limit, they won't be matched with new assignments
    // until some are completed or removed.
    maxUserBacklogSize?: number; // Default: 9

    // Whether to enable the default tag-based matching logic.
    // If set to false, you MUST provide a custom `matchingFunction`.
    enableDefaultMatching?: boolean; // Default: true

    // A custom function to determine the priority of an assignment.
    // The function receives assignment objects (or undefined if fewer than 3 are available for comparison)
    // and should return a numerical priority score. Higher scores mean higher priority.
    // Useful if `createdAt` is not sufficient for your prioritization needs.
    prioritizationFunction?: (...args: (Assignment | undefined)[]) => Promise<number>;

    // A custom function to determine if a user can be matched with an assignment
    // and the "cost" or "rank" of that match.
    // If `enableDefaultMatching` is true, this function can augment or override the default logic.
    // If `enableDefaultMatching` is false, this function is solely responsible for matching.
    // It should return a tuple: `[matchRank, userCost]`.
    // - `matchRank`: A score indicating the quality of the match (higher is better).
    //                A rank of 0 or less means no match.
    // - `userCost`: A score indicating the "cost" of assigning this task to this user
    //               (lower is better, used for tie-breaking among users).
    matchingFunction?: (
        user: User,
        assignmentTags: string[],
        assignmentPriority: number | string, // This is the score from prioritizationFunction or createdAt
        assignmentId?: string,
    ) => Promise<[number, number]>;
};
```

## Detailed Example & Performance Insights

The following example demonstrates adding multiple users and assignments and then measures the performance of the matching process.

```javascript
// Save this as example.ts and ensure you have ts-node and typescript installed
// npm install -D ts-node typescript
// Then run: ./example.ts

import AssignmentMatcher, { User, Assignment } from 'assignment-user-matcher';
import { createClient } from 'redis';

async function bootstrap(userCount: number, assignmentCount: number) {
  const redisClient = await createClient({});
  await redisClient.connect();
  // It's good practice to clear keys for a fresh test run,
  // but be VERY careful with flushDb in production.
  await redisClient.flushDb();


  const assignmentMatcher = new AssignmentMatcher(redisClient, {
    relevantBatchSize: 100, // Larger batch for testing
    maxUserBacklogSize: 10,
    redisPrefix: 'perfTest:',
  });

  console.log(`Setting up ${userCount} users and ${assignmentCount} assignments...`);

  // Add Users
  for (let i = 0; i < userCount; i++) {
    await assignmentMatcher.addUser({
      id: `user_${i}`,
      tags: ['tag1', 'tag2', `unique_skill_${i % 5}`], // Varied tags with smaller modulo for more matches
    });
  }

  // Add Assignments
  for (let i = 0; i < assignmentCount; i++) {
    await assignmentMatcher.addAssignment({
      id: `assignment_${i}`,
      tags: ['tag1', `unique_skill_${i % 5}`], // Ensure more matches
      createdAt: new Date().getTime() + i, // Stagger creation time slightly
    });
  }
  console.log('Setup complete.');

  // --- Performance Measurement for Initial Matching ---
  console.log('Performing initial matching...');
  performance.mark('match-start');
  await assignmentMatcher.matchUsersAssignments();
  performance.mark('match-end');
  const matchMeasure = performance.measure('Initial Matching Process', 'match-start', 'match-end');
  console.log(`Initial matching execution time: ${matchMeasure.duration.toFixed(2)}ms`);

  // --- Log initial assignments for all users ---
  console.log('\nInitial assignments for users:');
  for (let i = 0; i < userCount; i++) {
    const userAssignments = await assignmentMatcher.getCurrentAssignmentsForUser(`user_${i}`);
    console.log(`User 'user_${i}' has ${userAssignments.length} assignments.`);
  }

  // --- Simulate completing assignments ---
  console.log('\nSimulating users completing assignments...');
  for (let i = 0; i < userCount; i++) {
    // Only process for the first 15 users
    if (i >= 15) break;

    // Get the current assignments for this user
    const userAssignments = await assignmentMatcher.getCurrentAssignmentsForUser(`user_${i}`);

    if (userAssignments.length > 0) {
      // Simulate completing half of the assignments
      const assignmentsToComplete = userAssignments.slice(0, Math.ceil(userAssignments.length / 2));
      console.log(`User 'user_${i}' completing ${assignmentsToComplete.length} assignments...`);

      // Remove these assignments from the user's queue
      for (const assignmentId of assignmentsToComplete) {
        await redisClient.sRem(assignmentMatcher.redisPrefix + `user:user_${i}:assignments`, `assignment:${assignmentId}`);
      }
    }
  }

  // --- Perform another matching after completion ---
  console.log('\nPerforming second matching after assignment completion...');
  performance.mark('rematch-start');
  await assignmentMatcher.matchUsersAssignments();
  performance.mark('rematch-end');
  const rematchMeasure = performance.measure('Second Matching Process', 'rematch-start', 'rematch-end');
  console.log(`Second matching execution time: ${rematchMeasure.duration.toFixed(2)}ms`);

  // --- Final check of assignments for all users ---
  console.log('\nFinal assignments for users:');
  for (let i = 0; i < userCount; i++) {
    if (i >= 15) break; // Only show for the first 15 users
    const userAssignments = await assignmentMatcher.getCurrentAssignmentsForUser(`user_${i}`);
    console.log(`User 'user_${i}' now has ${userAssignments.length} assignments.`);
  }

  console.log(
    `
Summary:
    Users: ${userCount} (simulated 15 users completing assignments)
    Assignments: ${assignmentCount}
    Initial Matching Duration: ${matchMeasure.duration.toFixed(2)}ms
    Second Matching Duration: ${rematchMeasure.duration.toFixed(2)}ms`
  );

  await redisClient.quit();
}

// Adjust these numbers to test different scales
const USER_COUNT = 30;
const ASSIGNMENT_COUNT = 150000;

bootstrap(USER_COUNT, ASSIGNMENT_COUNT)
  .then(() => {
    console.log('Performance test finished.');
    // process.exit(0); // Exit cleanly
  })
  .catch((err) => {
    console.error('Error during bootstrap:', err);
    // process.exit(1);
  });
```

### Example Performance Results

When running the above example with 30 users and 150,000 assignments, you might see results similar to this:

```
Summary:
    Users: 30 (simulated 15 users completing assignments)
    Assignments: 150000
    Initial Matching Duration: 3.83ms
    Second Matching Duration: 0.83ms
Performance test finished.
```

This demonstrates the library's impressive performance even with large numbers of assignments and shows how subsequent matching operations can be even faster after initial assignment distribution.

## Important Considerations (Disclaimer)

- **Optimized for a Specific Use Case:** `assignment-user-matcher` is primarily designed and optimized for scenarios with a **relatively small set of active users processing a large volume of incoming assignments** (e.g., call centers, customer support teams, back-office operations). While it might work for other scenarios, its performance characteristics are best suited for this model.
- **Redis Dependency:** This library requires a running Redis instance. Ensure your Redis server is adequately provisioned for your workload.
- **Near Real-Time, Not Instantaneous:** While fast, the matching process involves Redis operations and logic execution. "Near real-time" means it's quick, but not strictly instantaneous with nanosecond precision. The `matchUsersAssignments()` method needs to be called periodically or triggered by events (e.g., new assignment, user becomes available) to perform matching.

## Contributing

Contributions are welcome! If you have ideas for improvements, new features, or bug fixes, please feel free to:

1.  Fork the repository.
2.  Create a new branch for your feature or fix.
3.  Make your changes.
4.  Add tests for your changes.
5.  Ensure all tests pass.
6.  Submit a pull request.

Please open an issue first to discuss significant changes.

## License

This library is licensed under the MIT License. (Assuming MIT - please update if incorrect)
