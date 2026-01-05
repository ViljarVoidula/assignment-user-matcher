-- workflow-transition.lua
-- Atomic workflow state transition with optimistic locking (CAS)
-- 
-- KEYS[1] = workflow instance key
-- ARGV[1] = expected version
-- ARGV[2] = new data (JSON string)
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
return cjson.encode({ok = true})

