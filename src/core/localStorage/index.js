const localStorage = process.env.VUE_ENV === 'client' ? window.localStorage : {};

export default class ClientStorage {
  get(key) {
    return localStorage.getItem(key);
  }

  set(key, value) {
    localStorage.setItem(key, value);
    return this;
  }

  remove(key) {
    localStorage.removeItem(key);
    return this;
  }

  has(key) {
    return !!this.get(key);
  }
}
