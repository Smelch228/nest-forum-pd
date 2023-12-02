import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  public readonly client: Redis;
  constructor(private readonly configService: ConfigService) {
    this.client = new Redis(configService.getOrThrow('REDIS_URL'));
  }
}
