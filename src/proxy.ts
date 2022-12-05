import type { ProxyValue } from "./types/Proxy";

export function newProxyArray(obj: any, callback: Function) {
  if (typeof obj === "object") {
    for (let key in obj) {
      if (typeof obj[key] === "object") {
        obj[key] = newProxyArray(obj[key], callback);
      }
    }
  }
  return new Proxy(obj, {
    set: function (target, key, value, receiver) {
      if (typeof value === "object") {
        value = newProxyArray(value, callback);
      }
      let cbType = target[key] == undefined ? "create" : "modify";
      if (!(Array.isArray(target) && key === "length")) {
        callback(cbType, { target, key, value });
      }
      return Reflect.set(target, key, value, receiver);
    },
    deleteProperty(target, key) {
      callback("delete", { target, key });
      return Reflect.deleteProperty(target, key);
    },
  });
}

export function newProxy(data: any, callback: Function) {
  return new Proxy(data, {
    set: (target, p, value) => {
      if (target[p] !== value) {
        target[p] = value;
        callback && callback(value, p as string, target);
      }
      return true;
    },
  });
}

export function useProxy<T>(value: T): [ProxyValue<T>, (...arg: any) => T] {
  let funcs: any[] = [];
  const func = (callback: (...arg: any) => void) => {
    funcs.push(callback);
    return data.value;
  };
  let data: any;
  if (Array.isArray(value))
    data = {
      value: newProxyArray(value, (...arg: any) =>
        funcs.forEach((e) => e(...arg))
      ),
    };
  data = newProxy({ value }, (...arg: any) => funcs.forEach((e) => e(...arg)));
  return [data, func];
}

export function useElement<T>(
  value: T
): [ProxyValue<T>, (element: JSX.Element) => T] {
  let els: JSX.Element[] = [];
  const func = (element: JSX.Element) => {
    els.push(element);
    return data.value;
  };
  const data = newProxy({ value }, (value: any, p: string, target: any) => {
    els.forEach((el) => (el.textContent = value));
  });
  return [data, func];
}
