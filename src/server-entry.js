import { DI } from 'core';
import each from 'lodash/each';
import { setupApp, setupVuePlugins, bootstrap } from './setup-app';

export default context => (
  new Promise((resolve, reject) => {
    setupApp();
    const { app, router, store } = bootstrap();
    DI.bindValue('vue', app);
    DI.bindValue('router', router);
    DI.bindValue('store', store);
    setupVuePlugins();

    const t = DI.get('isDev') && Date.now();
    const { req } = context;
    router.push(req.url);

    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents();
      const preFetchPromises = [];
      let errorObj = {};
      if (!matchedComponents.length) {
        errorObj = { code: 404 };
        reject(errorObj);
      }
      const preFilter = (componentsGroup) => {
        each(componentsGroup, (component) => {
          if (component.components) {
            preFilter(component.components);
          }
          if (component.name && component.asyncData) {
            preFetchPromises.push(component.asyncData({
              store,
              route: router.currentRoute
            })
              .then((content) => {
                DI.get('ssr').setContent(content, component.name);
              })
              .catch((error) => {
                errorObj = { code: 500, error };
                reject(errorObj);
              }));
          }
        });
      };
      preFilter(matchedComponents);
      Promise.all(preFetchPromises)
        .then(() => {
          Object.assign(context, { state: store.state });
          if (DI.get('isDev')) {
            console.log(`fetch: ${Date.now() - t}ms`);
          }
          resolve(app);
        })
        .catch((error) => {
          errorObj = { code: 500, error };
          reject(errorObj);
        });
    }, reject);
  })
);
