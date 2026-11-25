
import { cacheProvider } from "./init";
import type { Request, Response, NextFunction } from "express";

export function withCache(ttl: number = 3600) {

    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {

        try {
            const key: string = `${req.method}:${req.originalUrl}`;

            const cached: string | null = await cacheProvider.get(key);

            if (cached) {
                res.setHeader("X-CACHE", "HIT");
                res.json(JSON.parse(cached));
                return;
            }

            const originalJson = res.json.bind(res);

            res.json = ((body: unknown) => {

                // Cache successful responses only
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    cacheProvider.set(
                        key,
                        JSON.stringify(body),
                        ttl
                    ).catch(next);
                }

                res.setHeader("X-CACHE", "MISS");

                return originalJson(body);

            }) as Response["json"];

            next();

        } catch (error) {
            next(error);
        }
    };
}
