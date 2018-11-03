export default class Cookie {
  get(name) {
    const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
    const arr = document.cookie.match(reg);
    return arr ? unescape(arr[2]) : '';
  }

  set(name, value, days) {
    const exp = new Date();
    exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${escape(value)};expires=${exp.toGMTString()}`;
  }
}
