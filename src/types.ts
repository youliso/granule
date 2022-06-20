export type ProxyValue<T> = { value: T };
export type ViewParameters = { query?: any; params?: any };

interface VSource {
  $el?: JSX.Element;
  onLoad?: (parame: ViewParameters) => void;
  onReady?: () => void;
  onUnmounted?: () => void;
  onActivated?: (parame: ViewParameters) => void;
  onDeactivated?: () => void;
  render?: () => JSX.Element | JSX.Element[];
}

export interface Route {
  path: string;
  name?: string;
  instance?: boolean;
  component: any;
}

export interface Component extends VSource {
  $key?: string;
  $currentPath?: string;
  onLoad?: () => void;
  onActivated?: () => void;
  render?: () => JSX.Element;
}

export interface View extends VSource {
  $instance?: boolean;
  beforeRoute?: (to: string, from: string, next?: () => void) => boolean;
}

export type ComponentChild =
  | ComponentChild[]
  | JSX.Element
  | string
  | number
  | boolean
  | undefined
  | null;
export type ComponentChildren = ComponentChild | ComponentChild[];
export interface BaseProps {
  children?: ComponentChildren;
}
export type ComponentFactory = (props: BaseProps) => JSX.Element;
export type ComponentAttributes = {
  [s: string]:
    | string
    | number
    | boolean
    | undefined
    | null
    | Partial<CSSStyleDeclaration>
    | EventListenerOrEventListenerObject;
};