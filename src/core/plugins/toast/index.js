import { Toast } from 'components';

const pluginToast = {
  $el: null,
  install: null
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

    const toastNode = new ToastFunc({
      propsData: {
        text
      }
    }).$mount().$el;

    if (!pluginToast.$el) {
      pluginToast.$el = toastNode;
      document.body.appendChild(toastNode);

      setTimeout(() => {
        document.body.removeChild(pluginToast.$el);
        pluginToast.$el = null;
      }, opts.duration);
    }
  };
};

export default pluginToast;
