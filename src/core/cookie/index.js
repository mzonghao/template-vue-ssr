export default class Cookie {
  get(name) {
    const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
    const arr = document.cookie.match(reg);
    return arr ? unescape(arr[2]) : '';
  }
}
