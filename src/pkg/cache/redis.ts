import Redis from "ioredis";
import type { ICacheProvider } from "./cache.interface.js";

interface RedisConfig {
    host: string;
    port: number;
    password?: string;
}

export class RedisCacheProvider implements ICacheProvider {
    private client: Redis;

    constructor(config: RedisConfig) {
        this.client = new Redis({
            host: config.host,
            port: config.port,
            password: config.password,
            lazyConnect: true,
            maxLoadingRetryTime: 3,
        });

        this.client.on("error", (err: Error) => {
            console.log(`Redis error: ${err.message}`);
        });

        this.client.connect().catch((err: Error) => {
            console.log(`Redis connection error: ${err.message}`);
        });
    }

    async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }

    async set(key: string, value: string, ttl: number): Promise<void> {
        await this.client.set(key, value, "EX", ttl);
    }

    async del(key: string): Promise<void> {
        await this.client.del(key);
    }

    async ttl(key: string): Promise<number> {
        return await this.client.ttl(key);
    }
}