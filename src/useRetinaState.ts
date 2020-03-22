import { useEffect, useState } from "react";
import { RetinaState, Key } from "./retinaState";
import retinaStateInstance from "./retinaStateInstance";

type UseRetinaStateParams = {
  key: Key;
  retinaState?: RetinaState;
};

function useRetinaState<S>({
  key,
  retinaState = retinaStateInstance
}: UseRetinaStateParams): [S | undefined, (value: S) => void] {
  const value: S | undefined = retinaState.getValue<S>(key);
  if (value === undefined) {
    retinaState.setValue(key, value);
  }
  const [state, setState] = useState<S | undefined>(value);

  function setValue(value: S): void {
    retinaState.setValue(key, value);
  }

  useEffect(() => {
    const unSub = retinaState.subscribe(key, (value: S) => setState(value));
    return () => unSub();
  }, [key, retinaState]);

  return [state, setValue];
}

export default useRetinaState;
