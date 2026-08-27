[assignment-user-matcher](../README.md) / [Exports](../modules.md) / WorkflowExternalTask

# Interface: WorkflowExternalTask

External (callback) task metadata: the step is completed by a caller outside
the process — a downstream service, an integrator's server, or an AI agent —
via `completeWorkflowStep()`/`failWorkflowStep()` rather than an in-process
handler. Unlike machine steps, no code needs to be registered with this
matcher instance, which is what makes external steps usable from a
multi-tenant host (e.g. the platform) that cannot run customer code.
External steps require a timeout (`timeoutMs` or the workflow's
`defaultTimeoutMs`) so an uncalled-back step cannot hang a run forever.

## Table of contents

### Properties

- [input](WorkflowExternalTask.md#input)
- [name](WorkflowExternalTask.md#name)

## Properties

### input

• `Optional` **input**: `Record`\<`string`, `any`\>

Optional static input merged with workflow context, surfaced to the caller

#### Defined in

[src/types/matcher.ts:1367](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/types/matcher.ts#L1367)

___

### name

• **name**: `string`

Caller-facing name identifying what this step asks an external party to do

#### Defined in

[src/types/matcher.ts:1365](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/types/matcher.ts#L1365)
