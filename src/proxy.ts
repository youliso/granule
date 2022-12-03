import type { ComponentChild } from "./types";
import { h } from "./element";

export type ProxyValue<T> = { value: T };

export function newProxy(data: any, callback: Function) {
  return new Proxy(data, {
    construct(target, args) {
      console.log(target);
      const result = new target(...args);
      const originToStringTag = Object.prototype.toString
        .call(result)
        .slice(1, -1)
        .split(" ")[1];
      result[Symbol.toStringTag] = "Proxy-" + originToStringTag;
      return result;
    },
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
  tagName: K | "span" = "span",
  className?: string
): [ProxyValue<T>, HTMLElementTagNameMap[K]] {
  const element = h(
    tagName,
    { class: className },
    value as unknown as ComponentChild
  ) as HTMLElementTagNameMap[K];
  const data = newProxy(
    { value },
    (value: any, p: string, target: any) => (element.textContent = value)
  );
  console.log(data);
  return [data, element];
}
