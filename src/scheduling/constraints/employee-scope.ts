import type { AssignmentPair, ModelContext, SchedulingConstraint, SearchState, WorkingTimeRules } from '../types';
import { createDefaultConstraints, type DefaultConstraintOptions } from './constraint';
import { stableStringify } from '../provenance';

interface RuleGroup {
    rules: WorkingTimeRules;
    ids: Set<string>;
    constraints: Map<string, SchedulingConstraint>;
}

/** Rule families are instantiated once per effective configuration, then dispatched by employee. */
export function scopeEmployeeConstraints(
    options: DefaultConstraintOptions,
    rulesByEmployee: Map<string, WorkingTimeRules>,
): SchedulingConstraint[] {
    const base = createDefaultConstraints(options);
    if ([...rulesByEmployee.values()].every((rules) => stableStringify(rules) === stableStringify(options.rules ?? {}))) {
        return base;
    }
    const families = new Set([
        'min-rest',
        'daily-rest',
        'weekly-rest',
        'rolling-hours',
        'overtime',
        'duty-quota',
        'night-work',
        'consecutive-days',
        'consecutive-nights',
        'shift-succession',
        'start-interval',
        'in-shift-breaks',
        'rest-days',
        'engagement-floor',
        'notice',
        'fairness',
    ]);
    const groups = new Map<string, RuleGroup>();
    for (const [id, rules] of rulesByEmployee) {
        const key = stableStringify(rules);
        let group = groups.get(key);
        if (!group) {
            group = {
                rules,
                ids: new Set(),
                constraints: new Map(createDefaultConstraints({ ...options, rules }).map((c) => [c.id, c])),
            };
            groups.set(key, group);
        }
        group.ids.add(id);
    }
    const registry = new Map(base.map((c) => [c.id, c]));
    for (const group of groups.values()) {
        for (const [id, c] of group.constraints) if (families.has(id)) registry.set(id, c);
    }
    const contexts = new WeakMap<RuleGroup, WeakMap<ModelContext, ModelContext>>();
    for (const [id, prototype] of registry) {
        if (!families.has(id)) continue;
        const byEmployee = new Map<
            string,
            { constraint: SchedulingConstraint; context: (ctx: ModelContext) => ModelContext }
        >();
        const delegates: Array<{
            constraint: SchedulingConstraint;
            view: (state: SearchState, aggregate?: boolean) => SearchState;
        }> = [];
        // Unrelated personal overrides must not split a team-wide fairness group.
        const scopedGroups = id === 'fairness' ? new Map<string, RuleGroup>() : groups;
        if (id === 'fairness') {
            for (const group of groups.values()) {
                const key = stableStringify(group.rules.fairness);
                const existing = scopedGroups.get(key);
                if (existing) for (const employeeId of group.ids) existing.ids.add(employeeId);
                else scopedGroups.set(key, { ...group, ids: new Set(group.ids) });
            }
        }
        for (const group of scopedGroups.values()) {
            const constraint = group.constraints.get(id);
            if (!constraint) continue;
            const cache = contexts.get(group) ?? new WeakMap<ModelContext, ModelContext>();
            contexts.set(group, cache);
            const context = (ctx: ModelContext): ModelContext => {
                let scoped = cache.get(ctx);
                if (scoped) return scoped;
                const night = group.rules.nightWork;
                const instances =
                    stableStringify(night) === stableStringify(ctx.rules.nightWork)
                        ? ctx.instances
                        : ctx.instances.map((inst) => {
                              const nightMinutes = night
                                  ? ctx.clock.minutesInClockRange(
                                        { start: inst.startMinute, end: inst.endMinute },
                                        night.window,
                                    )
                                  : 0;
                              return {
                                  ...inst,
                                  nightMinutes,
                                  isNightShift: nightMinutes >= (night?.qualifiesAfterMinutes ?? 180),
                              };
                          });
                scoped = {
                    ...ctx,
                    rules: group.rules,
                    employees: ctx.employees.filter((e) => group.ids.has(e.id)),
                    instances,
                    instanceById: new Map(instances.map((inst) => [inst.id, inst])),
                };
                cache.set(ctx, scoped);
                return scoped;
            };
            const view = (state: SearchState, aggregate = false): SearchState => ({
                ...state,
                ctx: context(state.ctx),
                ...(aggregate
                    ? {
                          assignments: new Map(
                              [...state.assignments].map(([key, ids]) => [
                                  key,
                                  new Set([...ids].filter((employeeId) => group.ids.has(employeeId))),
                              ]),
                          ),
                      }
                    : {}),
            });
            delegates.push({ constraint, view });
            for (const employeeId of group.ids) byEmployee.set(employeeId, { constraint, context });
        }
        const delegate = (state: SearchState, pair: AssignmentPair) => {
            const found = byEmployee.get(pair.employeeId);
            return found && { c: found.constraint, state: { ...state, ctx: found.context(state.ctx) } };
        };
        registry.set(id, {
            ...prototype,
            delta(state, pair) {
                const d = delegate(state, pair);
                return d ? d.c.delta(d.state, pair) : 0;
            },
            explain(state, pair) {
                const d = delegate(state, pair);
                return d ? d.c.explain(d.state, pair) : null;
            },
            verdict(state, pair) {
                const d = delegate(state, pair);
                if (!d)
                    return {
                        ruleId: id,
                        pass: true,
                        severity: this.hardness,
                        message: `no ${id} rule applies to this employee`,
                    };
                return d.c.verdict
                    ? d.c.verdict(d.state, pair)
                    : {
                          ruleId: id,
                          pass: d.c.delta(d.state, pair) === 0,
                          severity: this.hardness,
                          message: d.c.explain(d.state, pair) ?? `satisfies ${id}`,
                      };
            },
            evaluate: delegates.some((d) => d.constraint.evaluate)
                ? (state) => delegates.flatMap((d) => d.constraint.evaluate?.(d.view(state, true)) ?? [])
                : undefined,
        });
    }
    return [...registry.values()];
}
