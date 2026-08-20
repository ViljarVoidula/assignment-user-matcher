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

local current = redis.call('HGET', key, 'data')
if not current then
    return cjson.encode({err = 'NOT_FOUND'})
end

local parsed = cjson.decode(current)
if parsed.version ~= expected_version then
    return cjson.encode({err = 'VERSION_MISMATCH', current_version = parsed.version})
end

redis.call('HSET', key, 'data', new_data)
if KEYS[2] and ARGV[3] then
    redis.call('SET', KEYS[2], '1', 'PX', tonumber(ARGV[3]))
end
return cjson.encode({ok = true})
