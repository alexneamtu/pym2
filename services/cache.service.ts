// npm
// @ts-ignore
import * as Redis from 'async-redis';
import * as _ from 'lodash';

// config
import { config } from '../config';

const hitsKey = 'hits';
const missesKey = 'misses';

export class CacheService {
  public static getInstance(): CacheService {
    return this.instance || (this.instance = new this());
  }

  private static instance: CacheService;
  private client: Redis.AsyncRedis;

  private constructor() {}

  public initialize() {
    this.client = Redis.createClient(config.redis);
  }

  public async incrementHits(): Promise<number> {
    return this.client.incr(hitsKey);
  }

  public async incrementMisses(): Promise<number> {
    return this.client.incr(missesKey);
  }

  public async getHits(): Promise<number> {
    const hits = _.parseInt(await this.client.get(hitsKey));
    return hits || 0;
  }

  public async getMisses(): Promise<number> {
    const misses = _.parseInt(await this.client.get(missesKey));
    return misses || 0;
  }

  public async cleanup(): Promise<void> {
    return this.client.flushall();
  }
}
