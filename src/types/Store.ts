export type State<T> = {
  [K in keyof T]: T[K];
};

export type SimpleActionHandler<T> = (
  data?: any
) => Partial<State<T>> | void | Promise<State<T>>;

export type ComplexActionHandler<T> = (
  data?: any
) => (
  state: State<T>,
  actions: MappedActions<T>
) => Partial<State<T>> | void | Promise<State<T>>;

export type Actions<T> = {
  [key: string]: SimpleActionHandler<T> | ComplexActionHandler<T>;
};

export type MappedActions<T> = {
  [key: string]: (data?: any) => Partial<State<T>> | void | Promise<T>;
};

export type SubscriptionFn<T> = (
  state: State<T>,
  triggerAction?: keyof MappedActions<T>
) => void;

export type Store<T> = {
  getState: () => State<T>;
  actions: MappedActions<T>;
  subscribe: (listener: SubscriptionFn<T>) => void;
};
