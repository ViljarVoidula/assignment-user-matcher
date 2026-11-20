-- workflow-transition.lua
-- Atomic workflow state transition with optimistic locking (CAS)
--
-- KEYS[1] = workflow instance key
-- KEYS[2] = (optional) processed-event marker key, set atomically with the
--           transition so a replay of the same event after a crash between
--           "state written" and "marker written" is recognized as processed
-- ARGV[1] = expected version
-- ARGV[2] = new data (JSON string)
-- ARGV[3] = (optional) marker TTL in ms, required when KEYS[2] is present
--
-- Returns:
--   {ok = true} on success
--   {err = 'NOT_FOUND'} if instance doesn't exist
--   {err = 'VERSION_MISMATCH', current_version = N} if version doesn't match

local key = KEYS[1]
local expected_version = tonumber(ARGV[1])
local new_data = ARGV[2]

-- The version lives in its own field so a transition does not have to decode
-- the whole instance (definition snapshot, history, context) to compare one
-- number. The field is only trusted while `sum` still matches the stored JSON:
-- a replica on a release from before these fields existed writes `data`
-- alone, leaving the field behind, and trusting it then either refuses every
-- later save or — when it happens to equal what a stale reader expects —
-- lets that reader overwrite the newer run. Hashing the string is far cheaper
-- than decoding it; the JSON is decoded only when the fields cannot vouch.
local current = redis.call('HGET', key, 'data')
if not current then
    return cjson.encode({err = 'NOT_FOUND'})
end

local current_version = redis.call('HGET', key, 'version')
local sum = redis.call('HGET', key, 'sum')
if not current_version or not sum or redis.sha1hex(current) ~= sum then
    current_version = cjson.decode(current).version
end

if tonumber(current_version) ~= expected_version then
    return cjson.encode({err = 'VERSION_MISMATCH', current_version = tonumber(current_version)})
end

redis.call('HSET', key, 'data', new_data, 'version', expected_version + 1, 'sum', redis.sha1hex(new_data))
if KEYS[2] and ARGV[3] then
    redis.call('SET', KEYS[2], '1', 'PX', tonumber(ARGV[3]))
end
return cjson.encode({ok = true})
