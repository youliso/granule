export interface View {
  [Symbol.toStringTag]: string;
  $element?: JSX.Element;
  render: () => Promise<JSX.Element>;
  onLoad?: (query?: any, params?: any) => void;
  onAlive?: (query?: any, params?: any) => void;
  onReady?: () => void;
  onUnmounted?: () => void;
  onActivated?: () => void;
  beforeRoute?: (form: string, to: string) => Promise<boolean>;
}

export interface Route {
  $view?: View;
  component: any;
  isAlive?: boolean;
  children?: { [key: string]: Route };
}

export interface Routes {
  [key: string]: Route;
}
