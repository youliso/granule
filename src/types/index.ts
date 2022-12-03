import type { EventAttributes } from "./EventAttributes";
import type { HTMLAttributes } from "./HTMLAtributes";
import type { StyleAttributes } from "./StyleAttributes";
import type { SVGAttributes } from "./SVGAttributes";
import type { ProxyValue } from "../proxy";

export type ComponentChild =
  | ComponentChild[]
  | JSX.Element
  | ProxyValue<any>
  | string
  | number
  | boolean
  | undefined
  | null;
export type ComponentChildren = ComponentChild | ComponentChild[];
export interface BaseProps {
  children?: ComponentChildren;
}
export type Component = (props: BaseProps) => JSX.Element;
export type ComponentAttributes = {
  [s: string]:
    | string
    | number
    | boolean
    | undefined
    | null
    | StyleAttributes
    | EventListenerOrEventListenerObject;
};

export interface HTMLComponentProps extends BaseProps {
  dangerouslySetInnerHTML?: string;
}

export type SVGAndHTMLElementKeys = keyof SVGElementTagNameMap &
  keyof HTMLElementTagNameMap;
export type SVGOnlyElementKeys = Exclude<
  keyof SVGElementTagNameMap,
  SVGAndHTMLElementKeys
>;
export type IntrinsicElementsHTML = {
  [TKey in keyof HTMLElementTagNameMap]?: HTMLAttributes &
    HTMLComponentProps &
    EventAttributes<HTMLElementTagNameMap[TKey]>;
};
export type IntrinsicElementsSVG = {
  [TKey in SVGOnlyElementKeys]?: SVGAttributes &
    HTMLComponentProps &
    EventAttributes<SVGElementTagNameMap[TKey]>;
};

export type IntrinsicElementsHTMLAndSVG = IntrinsicElementsHTML &
  IntrinsicElementsSVG;
