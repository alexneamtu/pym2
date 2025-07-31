// npm
import * as _ from 'lodash';

export interface IConfig {
  env: string;
  redis: {
    host: string,
    port?: number,
    mock?: boolean,
  };
  storage: {
    cachePath: string,
    sourcesPath: string,
  };
  web: {
    image: {
      port: number,
    },
    stats: {
      port: number,
    },
  };
}

const env = process.env.NODE_ENV || 'default';

export const config = {
  env,
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    mock: false, // default to false, can be overridden
  },
  storage: {
    cachePath: process.env.STORAGE_CACHE_PATH || './storage/cache',
    sourcesPath: process.env.STORAGE_SOURCES_PATH || './storage',
  },
  web: {
    image: {
      port: parseInt(process.env.APP_IMAGE_PORT, 10) || 7000,
    },
    stats: {
      port: parseInt(process.env.APP_IMAGE_PORT, 10) || 8000,
    },
  },

};

if (process.env.NODE_ENV && process.env.NODE_ENV !== 'default') {
  // tslint:disable-next-line:no-var-requires
  const overridingConfig = require(`./${process.env.NODE_ENV}`).config;
  _.merge(config, overridingConfig);
}
