"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withCache = withCache;
const init_1 = require("./init");
function withCache(ttl = 3600) {
    return async (req, res, next) => {
        try {
            const key = `${req.method}:${req.originalUrl}`;
            const cached = await init_1.cacheProvider.get(key);
            if (cached) {
                res.setHeader("X-CACHE", "HIT");
                res.json(JSON.parse(cached));
                return;
            }
            const originalJson = res.json.bind(res);
            res.json = ((body) => {
                // Cache successful responses only
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    init_1.cacheProvider.set(key, JSON.stringify(body), ttl).catch(next);
                }
                res.setHeader("X-CACHE", "MISS");
                return originalJson(body);
            });
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
