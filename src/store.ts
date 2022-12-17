import type {
  Actions,
  Store,
  SubscriptionFn,
  MappedActions
} from './types/Store';

export function createStore<T>(actions: Actions<T>, state: T): Store<T> {
  const subscriptions: SubscriptionFn<T>[] = [];
  const mappedActions: MappedActions<T> = {};
  let globalState = { ...state };

  for (let [key, fn] of Object.entries(actions)) {
    ((name, action) => {
      mappedActions[name] = (data) => {
        let newState = action(data);

        if (typeof newState === 'function') {
          newState = newState(globalState, mappedActions);
        }

        if (newState && !(newState instanceof Promise)) {
          globalState = {
            ...globalState,
            ...newState
          };

          subscriptions.forEach((subscription) => {
            subscription(globalState, name);
          });
        }
      };
    })(key, fn);
  }

  let store: Store<T>;
  store = {
    actions: mappedActions,
    getState: () => globalState,
    subscribe: (listener) => {
      subscriptions.push(listener);
    }
  };

  return store;
}
