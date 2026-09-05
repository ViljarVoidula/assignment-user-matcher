import type { RedisClientType } from '../types/matcher';

/** Internal, deliberately limited unit of work for learning ingestion.
 * Reads remain sparse. Writes are simulated in Lua before any mutation so a
 * bad counter/type cannot leave an applied marker beside partially trained data.
 * Read dependencies are compared inside the same script; conflicts re-plan.
 */
export function prepareIngestion(
    client: RedisClientType,
    scripts: string[],
): { client: RedisClientType; commit(): Promise<boolean> } {
    const reads: any[] = [];
    const writes: any[] = [];
    const keys = new Set<string>();
    const readCommands: Record<string, string> = { get: 'GET', hmGet: 'HMGET', sMembers: 'SMEMBERS' };
    const writeCommands: Record<string, string> = {
        hSet: 'HSET',
        hIncrBy: 'HINCRBY',
        hIncrByFloat: 'HINCRBYFLOAT',
        incr: 'INCR',
        sAdd: 'SADD',
        set: 'SET',
        del: 'DEL',
        pExpire: 'PEXPIRE',
    };
    function stage(name: string, args: any[]) {
        if (name === 'eval') {
            const id = scripts.indexOf(args[0]);
            if (id < 0) throw new Error('Unsupported ingestion script');
            args[1].keys.forEach((key: string) => keys.add(key));
            writes.push({ script: id + 1, keys: args[1].keys, args: args[1].arguments });
            return;
        }
        const command = writeCommands[name];
        if (!command) throw new Error(`Unsupported ingestion write: ${name}`);
        keys.add(args[0]);
        let flat = args.flat();
        if (name === 'set' && args[2]) {
            flat = args.slice(0, 2);
            if (args[2].PX !== undefined) flat.push('PX', args[2].PX);
            if (args[2].XX) flat.push('XX');
        }
        writes.push({ command, args: flat.map(String) });
    }
    const batch: any = new Proxy(
        {},
        {
            get: (_, name: string) =>
                name === 'exec'
                    ? async () => []
                    : (...args: any[]) => {
                          stage(name, args);
                          return batch;
                      },
        },
    );
    const staged = new Proxy(
        {},
        {
            get: (_, name: string) => {
                if (name === 'multi') return () => batch;
                if (readCommands[name])
                    return async (...args: any[]) => {
                        keys.add(args[0]);
                        const value = await (client as any)[name](...args);
                        reads.push({
                            command: readCommands[name],
                            args: args.flat().map(String),
                            value: Array.isArray(value) ? [...value] : value,
                        });
                        return value;
                    };
                return async (...args: any[]) => {
                    stage(name, args);
                };
            },
        },
    ) as RedisClientType;
    return {
        client: staged,
        async commit(): Promise<boolean> {
            const result = await client.eval(commitScript(scripts), {
                keys: [...keys],
                arguments: [JSON.stringify({ reads, writes })],
            });
            return Number(result) === 1;
        },
    };
}

function commitScript(scripts: string[]): string {
    return `
local plan = cjson.decode(ARGV[1])
local real = redis
local function same(a, b)
  if b == cjson.null then return a == false end
  if type(b) ~= 'table' then return a == b end
  if type(a) ~= 'table' or #a ~= #b then return false end
  for i = 1, #b do if not same(a[i], b[i]) then return false end end
  return true
end
for _, r in ipairs(plan.reads) do
  local actual = real.call(r.command, unpack(r.args))
  if r.command == 'SMEMBERS' then table.sort(actual); table.sort(r.value) end
  if not same(actual, r.value) then return 0 end
end

-- Simulate every write against a sparse overlay. No real writes happen until
-- all types, numeric results, TTLs and embedded decay scripts have validated.
local state = {}
local commands = {}
local function load(key)
  if not state[key] then
    state[key] = { kind = real.call('TYPE', key).ok, fields = {}, members = {} }
  end
  return state[key]
end
local function expect(s, kind)
  if s.kind ~= 'none' and s.kind ~= kind then error('WRONGTYPE learning ingestion') end
end
local function number(value)
  local n = tonumber(value)
  if not n or n ~= n or n == math.huge or n == -math.huge then
    error('Invalid numeric learning value')
  end
  return n
end
local function emit(command, args)
  table.insert(commands, { command = command, args = args })
end
local call
call = function(command, ...)
  local a = {...}
  local key = a[1]
  local s = load(key)
  if command == 'HGET' then
    expect(s, 'hash')
    if s.fields[a[2]] == nil then s.fields[a[2]] = real.call('HGET', key, a[2]) end
    return s.fields[a[2]]
  elseif command == 'HSET' then
    expect(s, 'hash'); s.kind = 'hash'
    for i = 2, #a, 2 do s.fields[a[i]] = tostring(a[i+1]) end
    emit(command, a); return 1
  elseif command == 'HINCRBY' or command == 'HINCRBYFLOAT' then
    local old = call('HGET', key, a[2]) or '0'
    local value = number(old) + number(a[3])
    number(value)
    if command == 'HINCRBY' and (value % 1 ~= 0 or math.abs(value) > 9007199254740991) then
      error('Invalid integer learning counter')
    end
    return call('HSET', key, a[2], string.format('%.17g', value))
  elseif command == 'SADD' then
    expect(s, 'set'); s.kind = 'set'; emit(command, a); return 1
  elseif command == 'SET' then
    local ttl = nil
    local xx = false
    for i = 3, #a do
      if a[i] == 'PX' then
        ttl = number(a[i+1])
        if ttl <= 0 or ttl % 1 ~= 0 or ttl > 9007199254740991 then error('Invalid learning TTL') end
      elseif a[i] == 'XX' then xx = true end
    end
    if xx and s.kind == 'none' then return false end
    s.kind = 'string'; s.value = a[2]; emit(command, a); return 'OK'
  elseif command == 'INCR' then
    expect(s, 'string')
    local value = number(s.value or real.call('GET', key) or '0') + 1
    if value % 1 ~= 0 or math.abs(value) > 9007199254740991 then error('Invalid learning counter') end
    s.value = string.format('%.17g', value); s.kind = 'string'
    emit('SET', { key, s.value, 'KEEPTTL' }); return value
  elseif command == 'DEL' then
    s.kind = 'none'; s.fields = {}; s.value = nil; emit(command, a); return 1
  elseif command == 'PEXPIRE' then
    local ttl = number(a[2])
    if ttl <= 0 or ttl % 1 ~= 0 or ttl > 9007199254740991 then error('Invalid learning TTL') end
    emit(command, a); return 1
  end
  error('Unsupported ingestion command: ' .. command)
end
local redis = { call = call }
local scripts = {
${scripts.map((script) => `function(KEYS, ARGV)\n${script}\nend`).join(',\n')}
}
for _, w in ipairs(plan.writes) do
  if w.script then scripts[w.script](w.keys, w.args)
  else call(w.command, unpack(w.args)) end
end
for _, c in ipairs(commands) do real.call(c.command, unpack(c.args)) end
return 1
`;
}
