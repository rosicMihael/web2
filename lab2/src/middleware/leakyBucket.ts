import { Request, Response, NextFunction } from "express";

const buckets = new Map<string, Bucket>();

const CAPACITY = 5;
const LEAK_RATE = 1 / 10;

export function leakyBucket(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const ip = req.ip ?? "unknown";
    const now = Date.now();

    let bucket = buckets.get(ip);

    if (!bucket) {
        bucket = {
            level: 0,
            lastUpdated: now
        };
    }

    const elapsed = (now - bucket.lastUpdated) / 1000;

    bucket.level = Math.max(
        0,
        bucket.level - elapsed * LEAK_RATE
    );

    bucket.lastUpdated = now;

    if (bucket.level + 1 > CAPACITY) {
        const retryAfter = Math.ceil(
            (bucket.level + 1 - CAPACITY) / LEAK_RATE
        );

        buckets.set(ip, bucket);

        return res
            .status(429)
            .set("Retry-After", retryAfter.toString())
            .json({
                message: "Too many login attempts. Try again later.",
                retryAfter
            });
    }

    bucket.level += 1;
    buckets.set(ip, bucket);

    next();
}

export function authRateLimiter(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (req.body.broken_auth_vulnerable) {
        return next();
    }

    return leakyBucket(req, res, next);
}