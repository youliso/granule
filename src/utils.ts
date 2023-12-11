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

const isComplexDataType = (obj: any) =>
  (typeof obj === 'object' || typeof obj === 'function') && obj !== null;

export function deepClone<T>(obj: any, hash = new WeakMap()): T {
  if (hash.has(obj)) return hash.get(obj);
  let type = [Date, RegExp, Set, Map, WeakMap, WeakSet];
  if (type.includes(obj.constructor)) return new obj.constructor(obj);
  let allDesc = Object.getOwnPropertyDescriptors(obj);
  let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc);
  let symKeys = Object.getOwnPropertySymbols(obj);
  if (symKeys.length > 0) {
    symKeys.forEach((symKey) => {
      cloneObj[symKey] = isComplexDataType(obj[symKey])
        ? deepClone(obj[symKey], hash)
        : obj[symKey];
    });
  }
  hash.set(obj, cloneObj);
  for (let key of Reflect.ownKeys(obj)) {
    cloneObj[key] =
      isComplexDataType(obj[key]) && typeof obj[key] !== 'function'
        ? deepClone(obj[key], hash)
        : obj[key];
  }
  return cloneObj;
}
