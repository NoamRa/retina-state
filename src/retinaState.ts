export type Key = string; // | number | Symbol | object;
export type Value = any;
type UnSubscribe = () => void;
type Subscriber = (...args: any) => any;

type ValueAndSubscribers = {
  value: Value;
  subscribers: Subscriber[];
};

type CreateRetinaStateParams = {
  name?: string;
};

type GetValue = <Value>(key: Key) => Value | undefined;
type SetValue = (key: Key, value: Value) => void;
type Subscribe = (key: Key, subscriber: Subscriber) => UnSubscribe;
type ListKeys = () => Key[];

export type RetinaState = {
  readonly name?: string;
  readonly getValue: GetValue;
  readonly setValue: SetValue;
  readonly subscribe: Subscribe;
  readonly listKeys: ListKeys;
  readonly flush: () => void;
};

function createRetinaState({
  name = "retina state"
}: CreateRetinaStateParams = {}): RetinaState {
  const state = new Map<Key, ValueAndSubscribers>();
  const allSubscribers = new Set<Subscriber>();

  const genValueAndSubscribers = (value?: Value): ValueAndSubscribers => ({
    value,
    subscribers: []
  });

  function getValue<Value>(key: Key): Value | undefined {
    const value: ValueAndSubscribers | undefined = state.get(key);
    return value?.value;
  }

  function setValue(key: Key, value: Value): void {
    let currentValue: ValueAndSubscribers | undefined = state.get(key);
    if (currentValue === undefined) {
      state.set(key, genValueAndSubscribers(value));
      return;
    }

    state.set(key, { value, subscribers: currentValue.subscribers });
    currentValue.subscribers.forEach(subscriber => subscriber(value));
  }

  function subscribe(key: Key, subscriber: Subscriber): UnSubscribe {
    let currentValue: ValueAndSubscribers | undefined = state.get(key);

    if (currentValue === undefined) {
      currentValue = genValueAndSubscribers();
      state.set(key, currentValue);
    }

    currentValue.subscribers.push(subscriber);
    const unSubscribe: UnSubscribe = () => {
      const val = state.get(key);
      if (val && val.subscribers) {
        val.subscribers = val.subscribers.filter(sub => sub !== subscriber);
      }
    };

    return unSubscribe;
  }

  function listKeys(): Key[] {
    return [...state.keys()];
  }

  function flush(): void {
    for (const key of state.keys()) {
      setValue(key, undefined);
    }
    allSubscribers.forEach(sub => sub());
    state.clear();
  }

  return Object.freeze({
    name,
    getValue,
    setValue,
    subscribe,
    listKeys,
    flush
  });
}

export default createRetinaState;
