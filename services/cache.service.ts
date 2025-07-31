// npm
import * as _ from 'lodash';
import { createClient } from 'redis';

// config
import { config } from '../config';

const hitsKey = 'hits';
const missesKey = 'misses';

export class CacheService {
  public static getInstance(): CacheService {
    return this.instance || (this.instance = new this());
  }

  private static instance: CacheService;
  private client: any;
  private mockMode: boolean = false;
  private mockStore: Record<string, number> = {};

  private constructor() {
  }

  public initialize() {
    if (config.redis.mock) {
      this.mockMode = true;
      this.mockStore = {};
      return;
    }
    this.client = createClient({
      socket: {
        host: config.redis.host,
        port: config.redis.port,
      },
    });
    this.client.connect().catch(console.error);
  }

  public async incrementHits(): Promise<number> {
    if (this.mockMode) {
      this.mockStore[hitsKey] = (this.mockStore[hitsKey] || 0) + 1;
      return this.mockStore[hitsKey];
    }
    return this.client.incr(hitsKey);
  }

  public async incrementMisses(): Promise<number> {
    if (this.mockMode) {
      this.mockStore[missesKey] = (this.mockStore[missesKey] || 0) + 1;
      return this.mockStore[missesKey];
    }
    return this.client.incr(missesKey);
  }

  public async getHits(): Promise<number> {
    if (this.mockMode) {
      return this.mockStore[hitsKey] || 0;
    }
    const hits = _.parseInt(await this.client.get(hitsKey));
    return hits || 0;
  }

  public async getMisses(): Promise<number> {
    if (this.mockMode) {
      return this.mockStore[missesKey] || 0;
    }
    const misses = _.parseInt(await this.client.get(missesKey));
    return misses || 0;
  }

  public async cleanup(): Promise<void> {
    if (this.mockMode) {
      this.mockStore = {};
      return;
    }
    await this.client.flushAll();
  }
}
