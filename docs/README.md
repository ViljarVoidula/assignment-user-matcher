assignment-engine / [Exports](modules.md)

Install with `npm install match-assignment`.

## API

```js
// default export is the main rimraf function, or use named imports
import matcher from 'match-assignment';
import { createClient } from 'redis';

const redisClient = await createClient({});
const assignmentMatcher = new AssignmentMatcher(redisClient, options);
```

## Options

```js
// default export is the main rimraf function, or use named imports
type options = {
  relevantBatchSize?: number, // 50
  redisPrefix?: string, // ''
  maxUserBacklogSize?: number, // default: 9
  enableDefaultMatching: boolean // default: true
  prioritizationFunction?: (
    ...args: (Assignment | undefined)[]
  ) => Promise<number>,
  matchingFunction?: (
    user: User,
    assignmentTags: string,
    assignmentPriority: number | string,
    assignmentId?: string
  ) => Promise<[number, number]>,
};
```

## Disclaimer

`match-assignment` is optimized for **small sets of users processing large sets of assignments** such as (call centers, customer support, back-office operations) in near real time.

## Why ?

Matching users to assignments based on their tags, cost, and priority is a common problem in many applications, such as job matching platforms, dating apps, or recommendation systems. Solving this problem efficiently and accurately can lead to better user experiences, increased engagement, and improved business outcomes. However, implementing an efficient and scalable matching algorithm can be a complex task, especially when dealing with large datasets and near **real-time matching** requirements. That's where `match-assignment` comes into play

## How ?

`match-assignment` is built on assumption that users are matched with assignments based on common intersection of tags (`string[]`) and also provides prioritization mechanic (so most important assignments would be processed faster)

## Example

```js
#!/usr/bin/env ./node_modules/.bin/ts-node-script
import AssignmentMatcher from './src/matcher.class';
import { createClient } from 'redis';

async function bootstrap(userCount: number, assignmentCount: number) {
  const redisClient = await createClient({});
  const assignmentMatcher = new AssignmentMatcher(redisClient, {
    relevantBatchSize: 50,
    maxUserBacklogSize: 100,
  });

  let userAccumulator = 0;
  let assignmentAccumulator = 0;
  for (let i = 0; i < userCount; i++) {
    userAccumulator += 1;

    await assignmentMatcher.addUser({
      id: i.toString(),
      tags: ['tag1', 'tag2', 'tag3'],
    });
  }

  for (let i = 0; i < assignmentCount; i++) {
    await assignmentMatcher.addAssignment({
      id: i.toString(),
      tags: ['tag1', 'tag2', 'tag3'],
      createdAt: new Date().getTime(),
    });
    assignmentAccumulator += 1;
  }

  performance.mark('match-start');
  await assignmentMatcher.matchUsersAssignments();
  performance.mark('match-end');
  const matchMeasure = performance.measure('match', 'match-start', 'match-end');

  performance.mark('current-assignment-start');
  await assignmentMatcher.getCurrentAssignmentsForUser('1');
  performance.mark('current-assignment-end');
  const currentTask = performance.measure(
    'current',
    'current-assignment-start',
    'current-assignment-end'
  );

  for (let j = 0; j < userAccumulator; j++) {
    await assignmentMatcher.getCurrentAssignmentsForUser(j.toString());
  }

  console.debug(
    `users count: ${userAccumulator} | assignmentCount: ${assignmentAccumulator} | matching execution time ${matchMeasure.duration}ms | current assignment time ${currentTask.duration}ms`
  );
}

bootstrap(100, 1000).then(() => {
  process.exit(1);
});
```
