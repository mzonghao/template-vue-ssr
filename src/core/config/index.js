import get from 'lodash/get';
import configs from '../../../configs';

export default class Config {
  get(key) {
    return get(configs, key);
  }

  getAll() {
    return configs;
  }
}
