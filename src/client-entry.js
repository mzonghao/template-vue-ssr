import 'es6-promise/auto';
import each from 'lodash/each';
import { DI } from 'core';
import { setupApp, setupVuePlugins, bootstrap } from './setup-app';

// setupApp
setupApp();
const { app, router, store } = bootstrap();
DI.bindValue('vue', app);
DI.bindValue('router', router);
DI.bindValue('store', store);
setupVuePlugins();

const LoadingBar = DI.get('vue').$bar;
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
    LoadingBar.start();
    preFilter(activated);
    return Promise.all(preFetchPromises)
      .then(() => {
        window.scrollTo(0, 0);
        LoadingBar.finish();
        next();
      })
      .catch(next);
  });
  app.$mount('#app');
});
