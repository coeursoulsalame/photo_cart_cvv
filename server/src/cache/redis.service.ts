import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private redis: Redis;

    constructor(private readonly configService: ConfigService) {}

    async onModuleInit() {
        this.redis = new Redis({
            host: this.configService.get<string>('REDIS_HOST', ''),
            port: this.configService.get<number>('REDIS_PORT', 6379),
            lazyConnect: true
        });

        this.redis.on('error', (err) => {
            console.warn('Redis connection error:', err.message);
        });

        this.redis.on('connect', () => {
            console.log('Connected to Redis successfully');
        });
    }

    async onModuleDestroy() {
        if (this.redis) {
            await this.redis.quit();
            console.log('Redis connection closed');
        }
    }

    getClient(): Redis {
        return this.redis;
    }

    async get(key: string): Promise<string | null> {
        return this.redis.get(key);
    }

    async setex(key: string, seconds: number, value: string): Promise<'OK'> {
        return this.redis.setex(key, seconds, value);
    }

    async del(key: string): Promise<number> {
        return this.redis.del(key);
    }

    async hset(key: string, field: string, value: string): Promise<number> {
        return this.redis.hset(key, field, value);
    }

    async hgetall(key: string): Promise<Record<string, string>> {
        return this.redis.hgetall(key);
    }

    async hdel(key: string, field: string): Promise<number> {
        return this.redis.hdel(key, field);
    }

    async keys(pattern: string): Promise<string[]> {
        return this.redis.keys(pattern);
    }

    async ttl(key: string): Promise<number> {
        return this.redis.ttl(key);
    }

    async set(key: string, value: string): Promise<'OK'> {
        return this.redis.set(key, value);
    }
}