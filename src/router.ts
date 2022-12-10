import type { Routes, Route, View } from "./types/Router";

/**
 * 对象转参数
 * @param data
 */
function queryParams(data: any): string {
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
function toParams(str: string) {
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

export class Router {
  // 当前路由类型
  public type: "history" | "hash";
  // 当前路由是否加载中
  public isRing: boolean = false;
  // 当前路由挂载节点
  public element: JSX.Element | undefined;
  // 当前路由全地址
  public currentPath: string = "";
  // 当前路由key
  public currentKey: string = "";
  // 当前挂载路由
  private routes: Routes = {};

  // 路由监听
  public onBeforeRoute: (
    form: string,
    to: string
  ) => Promise<boolean> | boolean = () => true;

  public onAfterRoute: (path: string) => Promise<void> | void = () => {};

  constructor(type: "history" | "hash", routes: Routes) {
    this.type = type;
    this.onHistory();
    this.routes = routes;
  }

  private onHistory() {
    switch (this.type) {
      case "history":
        window.addEventListener("popstate", (e) => {
          this.replace(
            window.location.pathname + window.location.search,
            e.state
          ).catch(console.error);
        });
        break;
      case "hash":
        window.addEventListener("popstate", (e) => {
          !this.isRing &&
            this.replace(
              window.location.hash.substring(1),
              e.state || {}
            ).catch(console.error);
        });
        break;
    }
  }

  private getChildRoute(keys: string[], routes: Routes) {
    let rs: Route[] = [];
    if (!keys[0]) return rs;
    const route = routes[keys[0]];
    if (!route) return rs;
    rs.push(route);
    if (route.children && keys.length > 1) {
      rs.push(...this.getChildRoute(keys.slice(1), route.children));
    }
    return rs;
  }

  private getRoute(path: string) {
    const route = this.routes[path];
    if (!route) {
      let rs: Route[] = [];
      const keys = Object.keys(this.routes);
      const mainRouteKey = keys.filter((key) => path.startsWith(key))[0];
      if (!mainRouteKey) return rs;
      const mainRoute = this.routes[mainRouteKey];
      if (mainRoute) rs.push(mainRoute);
      if (mainRoute.children) {
        const childKey = path.slice(
          path.indexOf(mainRouteKey) + 1,
          path.length
        );
        rs.push(...this.getChildRoute(childKey.split("/"), mainRoute.children));
      }
      return rs;
    }
    return [this.routes[path]];
  }

  mount(element: JSX.Element | HTMLElement | string, path?: string) {
    if (typeof element === "string") {
      const dom = document.getElementById(element);
      if (!dom) throw new Error(`element ${element} null`);
      this.element = dom;
    } else this.element = element;
    if (!this.element) throw new Error(`element ${element} null`);

    if (this.type === "hash") path = path || window.location.hash.substring(1);
    else if (this.type === "history")
      path = path || document.location.pathname + document.location.search;
    this.replace(path || "/").catch(console.error);
  }

  setRoute(route: Routes) {
    this.routes = Object.assign(this.routes, route);
  }

  async back() {
    history.back();
  }

  async go(num: number = 1) {
    history.go(num);
  }

  async replace(path: string, params?: any) {
    if (this.currentPath === path) return;
    const [key, args] = path.split("?");
    const query = toParams(args);
    this.rIng("replace", path, key, query, params);
  }

  async push(path: string, params?: any) {
    if (this.currentPath === path) return;
    const [key, args] = path.split("?");
    const query = toParams(args);
    this.rIng("push", path, key, query, params);
  }

  async uIng(key: string) {
    const routes = this.getRoute(this.currentKey);
    if (!routes) return;
    for (const route of routes) {
      if (
        route.$view?.beforeRoute &&
        !(await route.$view?.beforeRoute(this.currentKey, key))
      )
        return false;
      if (route.isAlive) {
        route.$view?.onActivated && route.$view.onActivated();
      } else {
        route.$view?.onUnmounted && route.$view.onUnmounted();
      }
    }
    return true;
  }

  async rIng(
    type: string,
    path: string,
    key: string,
    query?: any,
    params?: any
  ) {
    const isR = await this.onBeforeRoute(this.currentKey, key);
    if (!isR) return false;
    if (this.currentKey && !this.uIng(key)) return false;
    const routes = this.getRoute(key);
    if (!routes) {
      throw new Error(`beyond the history of ${key}`);
    }
    this.isRing = true;
    let newElement: JSX.Element = document.createDocumentFragment();
    for (let index = 0; index < routes.length; index++) {
      const route = routes[index];
      let element: JSX.Element | undefined;
      if (index > 0) {
        element = routes[index - 1].$view?.$element?.querySelector(
          "div[router]"
        ) as JSX.Element;
        if (!element) {
          throw new Error(`[${key}] parent node is null`);
        }
      }
      let component: View | undefined;
      if (route.isAlive && route.$view) {
        element && element.appendChild(route.$view.$element as JSX.Element);
        route.$view.onAlive && route.$view.onAlive(query, params);
        continue;
      } else if (typeof route.component?.render === "function") {
        component = { ...route.component } as View;
      } else if (typeof route.component === "function") {
        component = { ...(await route.component()) } as View;
      } else {
        throw new Error("component error");
      }
      component.onLoad && component.onLoad(query, params);
      component.$element = await component.render();
      if (
        component.$element &&
        // @ts-ignore
        component.$element[Symbol.toStringTag] === "DocumentFragment"
      ) {
        throw new Error(`[${key}] node cannot be a DocumentFragment`);
      }
      if (index > 0) element!.appendChild(component.$element as JSX.Element);
      else newElement.appendChild(component.$element);
      component.onReady && component.onReady();
      route.$view = component;
    }
    if (this.currentKey) {
      this.element?.replaceChild(
        newElement,
        this.element.firstChild as JSX.Element
      );
    } else this.element?.appendChild(newElement);
    const url = `${this.type === "hash" ? "#" : ""}${path}`;
    switch (type) {
      case "replace":
        history.replaceState(params, key, url);
        break;
      case "push":
        history.pushState(params, key, url);
        break;
    }
    this.currentPath = path;
    this.currentKey = key;
    await this.onAfterRoute(this.currentKey);
    this.isRing = false;
    return true;
  }
}
