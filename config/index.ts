// npm
import * as _ from 'lodash';

export interface IConfig {
  env: string,
  web: {
    image: {
      port: number,
    },
  },
  storage: {
    path: string,
  },
}

const env = process.env.NODE_ENV || 'default';

export const config = {
  env,
  web: {
    image: {
      port: 7000,
    },
  },
  storage: {
    path: './storage',
  },
};

if (process.env.NODE_ENV && process.env.NODE_ENV !== 'default') {
  const overridingConfig = require(`./${process.env.NODE_ENV}`).config;
  _.merge(config, overridingConfig);
}
