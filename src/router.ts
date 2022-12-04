import type { Routes, Route } from "./types/Router";

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
  public type: "history" | "hash";
  // 当前路由挂载dom
  public element: JSX.Element | HTMLElement;

  public routes: Routes = {};

  public history: { path: string; query: any; parame: any }[] = [];

  public currentPath: string = "";

  public currentParame: {
    query?: any;
    params?: any;
  } = {};

  // 路由监听
  public onBeforeRoute: (
    form: string,
    to: string
  ) => Promise<boolean> | boolean = () => true;

  public onAfterRoute: (path: string) => Promise<void> | void = () => {};

  constructor(
    type: "history" | "hash",
    element: JSX.Element | HTMLElement | string,
    routes: Routes
  ) {
    this.type = type;
    this.onHistory();
    if (typeof element === "string") {
      const dom = document.getElementById(element);
      if (!dom) throw new Error(`element ${element} null`);
      this.element = dom;
    } else this.element = element;
    if (!this.element) throw new Error(`element ${element} null`);
    this.routes = routes;
  }

  private onHistory() {
    switch (this.type) {
      case "history":
        window.onpopstate = (e) => {
          this.replace(
            document.location.pathname + document.location.search,
            e.state
          ).catch(console.error);
        };
        break;
    }
  }

  private setHistory(path: string, query?: any, parame?: any) {
    this.history.unshift({ path, query, parame });
  }

  init(path?: string) {
    if (this.type === "hash") path = path || window.location.hash.substring(1);
    else if (this.type === "history")
      path = path || document.location.pathname + document.location.search;
    this.replace(path || "/").catch(console.error);
  }

  getRoute(path: string) {
    return this.routes[path];
  }

  setRoute(route: Routes) {
    this.routes = Object.assign(this.routes, route);
  }

  killAlive(path: string) {
    delete this.routes[path]?.element;
  }

  async back() {
    if (this.type === "history") {
      history.back();
      return;
    }
    let historyData = this.history[1];
    if (!historyData) {
      this.replace("/");
      return;
    }
    await this.rIng(
      "back",
      historyData.path,
      historyData.query,
      historyData.parame
    );
  }

  async go(num: number = 1) {
    if (this.type === "history") {
      history.go(num);
      return;
    }
    num < 0 && (num = -num);
    let historyData = this.history[num];
    if (!historyData) {
      console.error(`beyond the history of back(${num})`);
      return;
    }
    await this.rIng(
      `go${num}`,
      historyData.path,
      historyData.query,
      historyData.parame
    );
  }

  async replace(path: string, params?: any, alive: boolean = false) {
    const [key, args] = path.split("?");
    const query = toParams(args);
    this.rIng("replace", key, query, params, alive);
  }

  async push(path: string, params?: any, alive: boolean = false) {
    const [key, args] = path.split("?");
    const query = toParams(args);
    this.rIng("push", key, query, params, alive);
  }

  async rIng(
    type: string,
    path: string,
    query?: any,
    params?: any,
    alive?: boolean
  ) {
    const isR = await this.onBeforeRoute(this.currentPath, path);
    if (!isR) return;
    const route = this.getRoute(path);
    if (!route) {
      throw new Error(`beyond the history of ${path}`);
    }
    const render = async () => {
      while (this.element.firstElementChild) {
        this.element.firstElementChild.remove();
      }
      if (route.element) {
        route.render(query, params, true);
        this.element.appendChild(route.element);
      } else if (alive && !route.element) {
        route.element = await route.render(query, params, false);
        this.element.appendChild(route.element);
      } else {
        delete route.element;
        this.element.appendChild(await route.render(query, params, false));
      }
      this.currentPath = path;
      this.currentParame = { query, params };
      const queryStr = queryParams(query);
      const url = `${path}${queryStr ? "?" + queryStr : ""}`;
      if (this.type === "history") {
        switch (type) {
          case "replace":
            history.replaceState(params, path, url);
            break;
          case "push":
            history.pushState(params, path, url);
            break;
        }
      } else {
        if (type.startsWith("go")) {
          this.history.splice(0, Number(this.type.slice(2)));
        } else if (type === "back") {
          this.history.splice(0, 1);
        } else {
          this.setHistory(path, query, params);
        }
        window.location.hash = url;
      }
      await this.onAfterRoute(this.currentPath);
    };
    if (route.beforeRoute) {
      route.beforeRoute(this.currentPath, path, render);
    } else await render();
  }
}
