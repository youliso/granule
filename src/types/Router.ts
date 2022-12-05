export interface Route {
  beforeRoute?: (form: string, to: string) => Promise<boolean>;
  render: () => Promise<JSX.Element>;
  onLoad?: (query?: any, params?: any) => void;
  onAlive?: (query?: any, params?: any) => void;
  onReady?: () => void;
  onUnmounted?: () => void;
  onActivated?: () => void;
  isAlive?: boolean;
  element?: JSX.Element;
  children?: { [key: string]: Route };
}

export interface Routes {
  [key: string]: Route;
}
