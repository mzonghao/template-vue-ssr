import axios from 'axios';
import { DI } from 'core';

export default class BaseHttp {
  constructor(configs) {
    this.instance = axios.create(configs);
    this.instance.interceptors.request.use((config) => {
      const newConfig = config;
      if (!DI.get('isClient')) {
        newConfig.headers['user-agent'] = global.reqHeaders['user-agent'];
      }
      newConfig.headers['X-LC-Id'] = 'Dl4bEIDuzgpV5pEDuCJNnqjO-9Nh9j0Va';
      newConfig.headers['X-LC-Key'] = 'Hxe4nUqTUAwHbBiOuyk7Kn5l';
      newConfig.headers['Content-Type'] = 'application/json';
      return newConfig;
    });
    this.instance.interceptors.response.use(
      response => (response.data),
      (error) => {
        let message = '';
        let errorObj = {};
        if (error && error.response) {
          if (error.response.status >= 500) {
            message = '服务器维护中...';
            errorObj = { message, error };
            return Promise.reject(errorObj);
          }
          errorObj = { error };
          return Promise.reject(errorObj);
        }
        errorObj = { error };
        return Promise.reject(errorObj);
      }
    );
  }

  get(url, configs) {
    return this.instance.get(url, configs);
  }

  post(url, data, configs) {
    return this.instance.post(url, data, configs);
  }

  put(url, data, configs) {
    return this.instance.put(url, data, configs);
  }

  remove(url, configs) {
    return this.instance.delete(url, configs);
  }

  getInstance() {
    return this.instance;
  }
}
