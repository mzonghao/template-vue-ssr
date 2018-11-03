import { DI } from 'core';

export default class Utils {
  getUA() {
    return DI.get('navigator').userAgent.toLowerCase();
  }

  isFromWeChat() {
    return this.getUA().indexOf('micromessenger') > -1;
  }

  isFromAndroid() {
    return this.getUA().indexOf('android') > -1;
  }

  isFromiOS() {
    return this.getUA().indexOf('iphone') > -1;
  }

  isFromPC() {
    const notPC = [
      'Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'
    ];
    const ua = this.getUA();
    let flag = true;
    notPC.forEach((n) => {
      if (ua.includes(n.toLowerCase())) {
        flag = false;
      }
    });
    return flag;
  }

  setTitle(title) {
    DI.get('vue').$emit('set-title', title);
    document.title = title;
  }

  loadScript(url) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.src = url;
      s.onload = resolve;
      s.onerror = reject;
      document.body.appendChild(s);
    });
  }
}
