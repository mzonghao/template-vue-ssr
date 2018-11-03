import { Toast } from 'components';

const pluginToast = {
  install: null,
  instance: null,
  $el: null
};

pluginToast.install = (Vue, options) => {
  const defaultOpts = {
    duration: 2000
  };
  const opts = {};

  if (options instanceof Object) {
    Object.assign(opts, defaultOpts, options);
  } else {
    Object.assign(opts, defaultOpts);
  }

  Vue.prototype.$toast = (text) => { //eslint-disable-line
    const ToastFunc = Vue.extend(Toast);

    pluginToast.instance = new ToastFunc({
      propsData: {
        text
      }
    }).$mount();

    if (!pluginToast.$el) {
      pluginToast.$el = pluginToast.instance.$el;
      document.body.appendChild(pluginToast.$el);

      setTimeout(() => {
        document.body.removeChild(pluginToast.$el);
        pluginToast.$el = null;
      }, opts.duration);
    }
  };
};

export default pluginToast;
