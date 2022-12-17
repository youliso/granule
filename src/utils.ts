/**
 * 对象转参数
 * @param data
 */
export function queryParams(data: any): string {
    let _result = [];
    for (let key in data) {
        let value = data[key];
        if (["", undefined, null].includes(value)) {
            continue;
        }
        if (value.constructor === Array) {
            value.forEach((_value) => {
                _result.push(
                    encodeURIComponent(key) + "[]=" + encodeURIComponent(_value)
                );
            });
        } else {
            _result.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
        }
    }
    return _result.length ? _result.join("&") : "";
}

/**
 * 参数转对象
 * @param str
 */
export function toParams(str: string) {
    if (!str) return null;
    let obj: any = {},
        index = str.indexOf("?") || 0,
        params = str.substring(index + 1);
    let parr = params.split("&");
    for (let i of parr) {
        let arr = i.split("=");
        obj[arr[0]] = decodeURIComponent(arr[1]);
    }
    return obj;
}