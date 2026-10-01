-- claim-queued.lua
-- Claim queued assignments for one worker, atomically with everything that
-- makes the claim true: the pending record, its response deadline, its owner
-- and (when learning is on) the decision context.
--
-- The HDEL on the queued hash is the claim gate — only one caller ever gets 1
-- back for an id. Done as its own round trip, the assignment was then in no
-- store at all until the pending write landed: a concurrent read (cancel, GET,
-- explain) answered "not found" for live work, and a crash in that gap lost the
-- assignment outright. Here the gate and the move are one step.
--
-- KEYS[1] = queued assignments hash
-- KEYS[2] = pending assignments hash
-- KEYS[3] = pending expiry zset (score = response deadline)
-- KEYS[4] = assignment owner hash (assignmentId -> userId)
-- KEYS[5] = learning stats hash
--
-- ARGV[1] = the worker's user id
-- ARGV[2] = decision TTL in ms
-- then seven fields per assignment:
--   id, pending JSON, deadline (epoch ms), decision key ('' = no decision),
--   decision JSON, decision pointer key, decision id
--
-- Returns one integer per assignment, in order: 1 won, 0 lost.

local won = {}
local decisions = 0
for i = 3, #ARGV, 7 do
    local id = ARGV[i]
    if redis.call('HDEL', KEYS[1], id) == 1 then
        redis.call('HSET', KEYS[2], id, ARGV[i + 1])
        redis.call('ZADD', KEYS[3], ARGV[i + 2], id)
        redis.call('HSET', KEYS[4], id, ARGV[1])
        if ARGV[i + 3] ~= '' then
            redis.call('SET', ARGV[i + 3], ARGV[i + 4], 'PX', ARGV[2])
            redis.call('SET', ARGV[i + 5], ARGV[i + 6], 'PX', ARGV[2])
            decisions = decisions + 1
        end
        won[#won + 1] = 1
    else
        won[#won + 1] = 0
    end
end
if decisions > 0 then
    redis.call('HINCRBY', KEYS[5], 'decisions', decisions)
end
return won
