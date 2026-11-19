"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCacheProvider = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
class RedisCacheProvider {
    client;
    constructor(config) {
        this.client = new ioredis_1.default({
            host: config.host,
            port: config.port,
            password: config.password,
            lazyConnect: true,
            maxLoadingRetryTime: 3,
        });
        this.client.on("error", (err) => {
            console.log(`Redis error: ${err.message}`);
        });
        this.client.connect().catch((err) => {
            console.log(`Redis connection error: ${err.message}`);
        });
    }
    async get(key) {
        return await this.client.get(key);
    }
    async set(key, value, ttl) {
        await this.client.set(key, value, "EX", ttl);
    }
    async del(key) {
        await this.client.del(key);
    }
    async ttl(key) {
        return await this.client.ttl(key);
    }
}
exports.RedisCacheProvider = RedisCacheProvider;
