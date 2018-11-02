import { DI } from 'core';
import BaseHttp from './base-http';

export default class BaseMainHttp extends BaseHttp {
  constructor() {
    super(DI.get('config').get('api.main'));
  }
}
