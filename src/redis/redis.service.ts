import { Injectable } from '@nestjs/common';
import Redis, { RedisKey } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  private readonly client: Redis;
  constructor(private readonly configService: ConfigService) {
    this.client = new Redis(configService.getOrThrow('REDIS_URL'));
  }

  async addToSet(key: RedisKey, ...members: string[]) {
    await this.client.sadd(key, ...members);
  }

  async remFromSet(key: RedisKey, ...members: string[]) {
    await this.client.srem(key, ...members);
  }

  async getSetMembers(key: RedisKey) {
    return this.client.smembers(key);
  }

  async delete(...keys: RedisKey[]) {
    await this.client.del(...keys);
  }

  async clearSessionTokens(userId: string) {
    const userTokensKey = `user:${userId}:tokens`;
    const tokens = await this.client.smembers(userTokensKey);
    if (tokens.length > 0) {
      await this.client.del(tokens);
    }
    await this.client.del(userTokensKey);
  }

  async getByKey(key: RedisKey) {
    return this.client.get(key);
  }

  async addWithEx(
    key: RedisKey,
    seconds: string | number,
    value: string | Buffer | number,
  ) {
    return this.client.setex(key, seconds, value);
  }
}
