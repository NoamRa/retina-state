type Key = string; // | number | Symbol | object;
type Value = any;
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

type CreateRetinaStateReturn = {
  readonly name?: string;
  readonly getValue: GetValue;
  readonly setValue: SetValue;
  readonly subscribe: Subscribe;
  readonly listKeys: ListKeys;
};

function createRetinaState({
  name = "retina state"
}: CreateRetinaStateParams = {}): CreateRetinaStateReturn {
  const state = new Map<Key, ValueAndSubscribers>();

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
      val!.subscribers = val!.subscribers.filter(sub => sub !== subscriber);
    };

    return unSubscribe;
  }

  function listKeys(): Key[] {
    return [...state.keys()];
  }

  return Object.freeze({
    name,
    getValue,
    setValue,
    subscribe,
    listKeys
  });
}

export default createRetinaState;
