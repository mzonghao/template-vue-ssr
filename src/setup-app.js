import Vue from 'vue';
import VueRouter from 'vue-router';
import {
  DI, config, clientStorage, constants, filter, plugins,
  services, Router, Store, SSR, utils
} from 'core';
import { Root } from 'components';

const isDev = process.env.NODE_ENV === 'development';
const isClient = process.env.VUE_ENV === 'client';
const { createRouter } = Router;
const { createStore } = Store;

// setup app, bind all values
export const setupApp = () => {
  DI.bindValue('isDev', isDev);
  DI.bindValue('isClient', isClient);
  DI.bindValue('navigator', isClient ? window.navigator : global.navigator);
  DI.bindClass('config', config);
  DI.bindClass('ssr', SSR);
  DI.bindClass('clientStorage', clientStorage);
  DI.bindValue('filter', filter);
  DI.bindAllValues(constants);
  DI.bindAllClasses(services);
  DI.bindClass('utils', utils);
};

// register vue
Object.keys(filter).forEach((key) => {
  Vue.filter(key, filter[key]);
});

Object.keys(plugins).forEach((key) => {
  Vue.use(plugins[key]);
});

Vue.use(VueRouter);

// create new instance
export const bootstrap = () => {
  const router = createRouter();
  const store = createStore();
  const app = new Vue({
    router,
    store,
    render: h => h(Root)
  });
  return { app, router, store };
};
