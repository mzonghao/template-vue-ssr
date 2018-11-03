import { DI } from 'core';

export default class HttpCommon {
  getUsers(limit) {
    return DI.get('baseMainHttp').get(`/vue_ssr?limit=${limit}`);
  }

  postUser(data) {
    return DI.get('baseMainHttp').post('/vue_ssr', data);
  }
}
