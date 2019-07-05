// npm
import * as _ from 'lodash';

export interface IConfig {
  env: string,
  web: {
    image: {
      port: number,
    },
    stats: {
      port: number,
    }
  },
  storage: {
    sourcesPath: string,
    cachePath: string,
  },
  redis: {
    host: string,
  }
}

const env = process.env.NODE_ENV || 'default';

export const config = {
  env,
  web: {
    image: {
      port: parseInt(process.env.APP_IMAGE_PORT, 10) || 7000,
    },
    stats: {
      port: parseInt(process.env.APP_IMAGE_PORT, 10) || 8000,
    }
  },
  storage: {
    sourcesPath: process.env.STORAGE_SOURCES_PATH || './storage',
    cachePath: process.env.STORAGE_CACHE_PATH || './storage/cache',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  }
};

if (process.env.NODE_ENV && process.env.NODE_ENV !== 'default') {
  const overridingConfig = require(`./${process.env.NODE_ENV}`).config;
  _.merge(config, overridingConfig);
}
