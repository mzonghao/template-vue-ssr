import { DI } from 'core';
import { Message } from 'components';

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
      })
      .catch(Message);
  }

  handleError({ error, code, path }) {
    if (DI.get('isClient')) {
      Message(error);
      return;
    }
    if (code === 301) {
      DI.get('router').push(path);
    } else if (code >= 500) {
      // todo...handle error
    } else {
      console.log(error, code); //eslint-disable-line
    }
  }
}
