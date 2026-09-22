-- book-slot.lua
-- Atomically reserve one worker's time for one slotted assignment.
--
-- Checking for a clash and then writing the booking is not safe: two sweeps
-- booking two different tasks into one worker's 14:00 both pass the check and
-- both write. The whole decision therefore happens inside one script.
--
-- KEYS[1] = bookings hash          (assignmentId -> JSON booking record)
-- KEYS[2] = booking spans hash     (assignmentId -> "<startAt>:<endAt>")
-- KEYS[3] = this user's bookings   (zset of assignmentId scored by startAt)
--
-- ARGV[1] = assignment id
-- ARGV[2] = startAt (epoch ms)
-- ARGV[3] = endAt   (epoch ms, exclusive)
-- ARGV[4] = lookback ms -- how far back the overlap probe reaches. Bounds the
--           range read: any booking starting earlier than startAt - lookback
--           cannot still be running, given the longest slot the caller allows.
-- ARGV[5] = the booking record to store (JSON)
--
-- Returns:
--   {'booked'}
--   {'already-booked', holderUserId}
--   {'clash', clashingAssignmentId}

local bookings_key = KEYS[1]
local spans_key = KEYS[2]
local user_key = KEYS[3]

local assignment_id = ARGV[1]
local start_at = tonumber(ARGV[2])
local end_at = tonumber(ARGV[3])
local lookback = tonumber(ARGV[4])
local record = ARGV[5]

-- The bookings hash is the single index answering "who holds this", so its
-- presence is the claim gate: a second booker finds it taken.
local existing = redis.call('HGET', bookings_key, assignment_id)
if existing then
    local ok, decoded = pcall(cjson.decode, existing)
    local holder = ''
    if ok and decoded and decoded.userId then
        holder = decoded.userId
    end
    return {'already-booked', holder}
end

-- Every booking that could still be running when this one starts: it must
-- begin before this slot ends, and no earlier than the lookback bound. The
-- upper bound is exclusive, so a booking starting exactly at end_at -- the
-- back-to-back case -- is never even considered.
local lower = start_at - lookback
if lower < 0 then
    lower = 0
end
local candidates = redis.call('ZRANGEBYSCORE', user_key, lower, '(' .. end_at)

for i = 1, #candidates do
    local candidate = candidates[i]
    if candidate ~= assignment_id then
        local span = redis.call('HGET', spans_key, candidate)
        if span then
            local sep = string.find(span, ':', 1, true)
            if sep then
                local candidate_end = tonumber(string.sub(span, sep + 1))
                -- Half-open intervals: a job ending at 15:00 and one starting
                -- at 15:00 are an ordinary working day, not a clash.
                if candidate_end and candidate_end > start_at then
                    return {'clash', candidate}
                end
            end
        end
    end
end

redis.call('HSET', bookings_key, assignment_id, record)
redis.call('HSET', spans_key, assignment_id, tostring(start_at) .. ':' .. tostring(end_at))
redis.call('ZADD', user_key, start_at, assignment_id)

return {'booked'}
