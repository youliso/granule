import type { ProxyValue } from "./types/Proxy";
import type { ComponentChild } from "./types";
import { h } from "./element";

export function newProxy(data: any, callback: Function) {
  return new Proxy(data, {
    get: (target, p) => {
      return target[p];
    },
    set: (target, p, value) => {
      if (target[p] !== value) {
        target[p] = value;
        callback && callback(value, p as string, target);
      }
      return true;
    },
  });
}

export function useProxy<T>(
  value: T,
  callback: (value?: T, p?: string, target?: any) => void
): ProxyValue<T> {
  return newProxy({ value }, callback);
}

export function useElement<T>(
  value: T
): [ProxyValue<T>, (element: JSX.Element) => T] {
  let els: JSX.Element[] = [];
  const func = (element: JSX.Element) => {
    els.push(element);
    return data.value;
  };
  const data = newProxy({ value }, (value: any) => {
    els.forEach((el) => (el.textContent = value));
  });
  return [data, func];
}
