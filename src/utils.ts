/**
 * 对象转参数
 * @param data
 */
export function queryParams(data: any): string {
  let _result = [];
  for (let key in data) {
    let value = data[key];
    if (['', undefined, null].includes(value)) {
      continue;
    }
    if (value.constructor === Array) {
      value.forEach((_value) => {
        _result.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(_value));
      });
    } else {
      _result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    }
  }
  return _result.length ? _result.join('&') : '';
}

/**
 * 参数转对象
 * @param str
 */
export function toParams(str: string) {
  if (!str) return null;
  let obj: any = {},
    index = str.indexOf('?') || 0,
    params = str.substring(index + 1);
  let parr = params.split('&');
  for (let i of parr) {
    let arr = i.split('=');
    obj[arr[0]] = decodeURIComponent(arr[1]);
  }
  return obj;
}

type Obj<Value> = {} & {
  [key: string]: Value | Obj<Value>;
};

export function getValueByAKey<Value>(
  data: { [key: string]: any },
  key: string
): Value | undefined {
  if (key === '') {
    console.error('Invalid key, the key can not be a empty string');
    return;
  }

  if (!key.includes('.') && Object.prototype.hasOwnProperty.call(data, key)) {
    return data[key] as Value;
  }

  const levels = key.split('.');
  let cur = data;
  for (const level of levels) {
    if (Object.prototype.hasOwnProperty.call(cur, level)) {
      cur = cur[level] as unknown as Obj<Value>;
    } else {
      return;
    }
  }
  return cur as unknown as Value;
}

export function deepClone<T>(target: T): T {
  const map = new WeakMap();

  function isObject(target: T) {
    return (typeof target === 'object' && target) || typeof target === 'function';
  }

  function clone(data: any) {
    if (!isObject(data)) {
      return data;
    }
    if ([Date, RegExp].includes(data.constructor)) {
      return new data.constructor(data);
    }
    if (typeof data === 'function') {
      return new Function('return ' + data.toString())();
    }
    const exist = map.get(data);
    if (exist) {
      return exist;
    }
    if (data instanceof Map) {
      const result = new Map();
      map.set(data, result);
      data.forEach((val, key) => {
        if (isObject(val)) {
          result.set(key, clone(val));
        } else {
          result.set(key, val);
        }
      });
      return result;
    }
    if (data instanceof Set) {
      const result = new Set();
      map.set(data, result);
      data.forEach((val) => {
        if (isObject(val)) {
          result.add(clone(val));
        } else {
          result.add(val);
        }
      });
      return result;
    }
    const keys = Reflect.ownKeys(data);
    const allDesc = Object.getOwnPropertyDescriptors(data);
    const result = Object.create(Object.getPrototypeOf(data), allDesc);
    map.set(data, result);
    keys.forEach((key) => {
      const val = data[key];
      if (isObject(val)) {
        result[key] = clone(val);
      } else {
        result[key] = val;
      }
    });
    return result;
  }

  return clone(target);
}