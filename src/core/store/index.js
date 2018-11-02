import Vue from 'vue';
import Vuex from 'vuex';
import { DI } from 'core';
import ssr from './ssr';

Vue.use(Vuex);

export ssr from './ssr';

export const createStore = () => (
  new Vuex.Store({
    strict: DI.get('isDev'),
    modules: {
      ssr: ssr()
    }
  })
);
