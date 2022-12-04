export interface Route {
  beforeRoute?: (form: string, to: string, next: () => Promise<void>) => void;
  render: (query?: any, params?: any, alive?: boolean) => Promise<JSX.Element>;
  onUnmounted?: () => void;
  onActivated?: () => void;
  onready?: () => void;
  element?: JSX.Element;
}
export interface Routes {
  [key: string]: Route;
}
