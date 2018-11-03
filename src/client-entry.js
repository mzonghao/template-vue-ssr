import Vue from 'vue';
import 'es6-promise/auto';
import each from 'lodash/each';
import { DI } from 'core';
import { ProgressBar } from './components';
import { setupApp, bootstrap } from './setup-app';

// add progress bar
Vue.prototype.$bar = new Vue(ProgressBar).$mount();
const bar = Vue.prototype.$bar;
document.body.appendChild(bar.$el);

// setupApp
setupApp();
const { app, router, store } = bootstrap();
DI.bindValue('router', router);
DI.bindValue('store', store);
DI.bindValue('vue', app);

/* eslint-disable no-underscore-dangle */
if (window && window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
}

router.onReady(() => {
  router.beforeEach((to, from, next) => {
    // todo... can do something while enter new page, example: Authentication
    next();
  });
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to);
    const prevMatched = router.getMatchedComponents(from);
    const preFetchPromises = [];
    let diffed = false;
    const preFilter = (componentsGroup) => {
      each(componentsGroup, (component) => {
        if (component.components) {
          preFilter(component.components);
        }
        if (component.name && component.asyncData) {
          preFetchPromises.push(component.asyncData({
            store,
            route: to
          })
            .then((content) => {
              DI.get('ssr').setContent(content, component.name);
            }));
        }
      });
    };
    const activated = matched.filter((c, i) => {
      diffed = prevMatched[i] !== c;
      return diffed;
    });
    if (!activated.length) {
      return next();
    }
    bar.start();
    preFilter(activated);
    return Promise.all(preFetchPromises)
      .then(() => {
        window.scrollTo(0, 0);
        bar.finish();
        next();
      })
      .catch(next);
  });
  app.$mount('#app');
});
