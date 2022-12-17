import type { ProxyValue } from './types/Proxy';
import { getValueByAKey } from './utils';

export function newProxyArray(obj: any, callback: Function, sKey?: any) {
  if (typeof obj === 'object') {
    for (let key in obj) {
      if (typeof obj[key] === 'object') {
        obj[key] = newProxyArray(obj[key], callback, `${sKey ? `${sKey}.` : ''}${key as unknown as string}`);
      }
    }
  }
  return new Proxy(obj, {
    set: function(target, key, value, receiver) {
      if (typeof value === 'object') {
        value = newProxyArray(value, callback, `${sKey ? `${sKey}.` : ''}${key as unknown as string}`);
      }
      let cbType = target[key] == undefined ? 'create' : 'modify';
      if (!(Array.isArray(target) && key === 'length')) {
        callback(cbType, { target, key, value, aKey: sKey ? `${sKey}.${key as unknown as string}` : '' });
      }
      return Reflect.set(target, key, value, receiver);
    },
    deleteProperty(target, key) {
      callback('delete', { target, key });
      return Reflect.deleteProperty(target, key);
    }
  });
}

export function useProxy<T>(value: T): [ProxyValue<T>, (...arg: any) => T] {
  let funks: any[] = [];
  const func = (callback: (...arg: any) => void) => {
    funks.push(callback);
    return data.value;
  };
  let data = newProxyArray({ value }, (...arg: any) =>
    funks.forEach((e) => e(...arg))
  );
  return [data, func];
}

export function useElement<T>(
  value: T
): [ProxyValue<T>, (str: TemplateStringsArray) => (element: JSX.Element) => T] {
  let els: { [key: string]: JSX.Element[] } = {};
  const template = (str: TemplateStringsArray) => {
    return ((element: JSX.Element) => {
      const key = typeof data.value === 'object' ? 'value.' + (str && str[0]) : 'value';
      if (!key) {
        throw new Error(`key does not exist`);
      }
      if (!els[key]) els[key] = [];
      els[key].push(element);
      return getValueByAKey(data, key) as T;
    });
  };
  const data = newProxyArray({ value }, (type: any, ob: any) => {
    let key = ob.key;
    if (!!ob.aKey) key = ob.aKey;
    els[key] && els[key].forEach((el) => (el.textContent = JSON.stringify(ob.value)));
  });
  return [data, template];
}
