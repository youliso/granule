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

export function useElement<T, K extends keyof HTMLElementTagNameMap>(
  value: T,
  tagName?: K,
  className?: string
): [ProxyValue<T>, HTMLElementTagNameMap[K]] {
  const element = h(
    tagName || "span",
    { class: className },
    value as unknown as ComponentChild
  ) as HTMLElementTagNameMap[K];
  const data = newProxy(
    { value },
    (value: any) => (element.textContent = value)
  );
  return [data, element];
}
