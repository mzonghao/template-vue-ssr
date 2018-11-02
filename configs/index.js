import merge from 'lodash/merge';
import configBase from './config.base';

const env = process.env.NODE_ENV || 'development';

/* eslint-disable import/no-dynamic-require */
const configEnv = require(`./config.${env}.js`).default;
const configLocal = {};
try {
  const local = require(`./config.local.${env}.js`).default;
  Object.assign(configLocal, local);
} catch (e) {
  Object.assign(configLocal, {});
}

export default merge(configBase, configEnv, configLocal);
