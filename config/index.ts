// npm
import * as _ from 'lodash';

export interface IConfig {
  env: string;
  web: {
    imageResize: {
      port: number
    }
  }
}

const env = process.env.NODE_ENV || 'default';

export const config = {
  env,
  web: {
    imageResize: {
      port: 7000,
    },
  },
};

if (process.env.NODE_ENV && process.env.NODE_ENV !== 'default') {
  const overridingConfig = require(`./${process.env.NODE_ENV}`).config;
  _.merge(config, overridingConfig);
}
