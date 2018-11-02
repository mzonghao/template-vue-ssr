import { DI } from 'core';
import BaseHttp from './base-http';

export default class BaseSpareHttp extends BaseHttp {
  constructor() {
    super({
      baseURL: DI.get('config').get('api.spare')
    });
  }
}
