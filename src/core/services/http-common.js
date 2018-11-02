import { DI } from 'core';

export default class HttpCommon {
  getUsers() {
    return DI.get('baseMainHttp').get('/vue_ssr?limit=1000');
  }

  postUser(data) {
    return DI.get('baseMainHttp').post('/vue_ssr', data);
  }
}
