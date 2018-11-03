import { DI } from 'core';
import { ProgressBar } from 'components';

const pluginBar = {
  install: null,
  instance: null,
  $el: null
};

pluginBar.install = (Vue) => {
  const color = DI.get('config').get('progressBarColor');

  Vue.prototype.$bar = { //eslint-disable-line
    start() {
      if (!pluginBar.instance) {
        const BarFunc = Vue.extend(ProgressBar);
        pluginBar.instance = new BarFunc({
          propsData: {
            color
          }
        }).$mount();
        pluginBar.$el = pluginBar.instance.$el;
        document.body.appendChild(pluginBar.$el);
      }
      pluginBar.instance.start();
    },
    finish() {
      if (pluginBar.instance) {
        pluginBar.instance.finish();
      }
    }
  };
};

export default pluginBar;
