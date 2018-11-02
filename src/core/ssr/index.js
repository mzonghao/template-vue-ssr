import { DI } from 'core';

export default class SSR {
  getContent(name) {
    return DI.get('store').state.ssr.content[name];
  }

  setContent(content, name) {
    DI.get('store').commit('prefetch', { content, name });
  }

  syncContent(instance, callback) {
    const { asyncData, name } = instance.$options;
    asyncData({ route: instance.$route })
      .then((content) => {
        this.setContent(content, name);
        if (typeof callback === 'function') {
          callback();
        }
      }).catch((error) => {
        console.log(error);
      });
  }
}
