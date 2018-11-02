const globalObject = {};

class DI {
  get(key) {
    if (!this.has(key)) {
      throw new Error(`${key} not found!`);
    }
    const value = globalObject[key];
    if (value.constructorFunc) {
      if (!value.instance) {
        const Func = value.constructorFunc;
        value.instance = new Func();
      }
      return value.instance;
    }
    return value.value;
  }

  getAll() {
    return globalObject;
  }

  bindClass(key, constructorFunc, lazy = true) {
    globalObject[key] = {
      constructorFunc,
      instance: null
    };
    if (!lazy) {
      this.get(key);
    }
    return this;
  }

  bindValue(key, value) {
    globalObject[key] = { value };
    return this;
  }

  bindAllClasses(all, lazy = true) {
    if (!(all instanceof Object)) {
      throw new Error('arguments is not Object');
    }

    Object.keys(all).forEach((key) => {
      this.bindClass(
        `${key.slice(0, 1).toLowerCase()}${key.slice(1)}`,
        all[key],
        lazy
      );
    });
  }

  bindAllValues(all) {
    if (!(all instanceof Object)) {
      throw new Error('arguments is not Object');
    }

    Object.keys(all).forEach((key) => {
      this.bindValue(key, all[key]);
    });
  }

  remove(key) {
    delete globalObject[key];
    return this;
  }

  removeAll() {
    Object.keys(globalObject).forEach((key) => {
      this.remove(key);
    });
    return this;
  }

  has(key) {
    return !!globalObject[key];
  }
}

export default new DI();
