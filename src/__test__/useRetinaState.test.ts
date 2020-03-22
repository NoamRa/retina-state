import { renderHook, act } from "@testing-library/react-hooks";
import useRetinaState from "../useRetinaState";
import createRetinaState from "../retinaState";
import retinaStateInstance from "../retinaStateInstance";

describe("Test useRetinaState", () => {
  const myKey = "myKey";
  const exampleValue1 = { a: 1 };
  const exampleValue2 = { b: 2 };

  beforeEach(() => {
    retinaStateInstance.flush();
  });

  it("should be able to initialize with and without passing instance", () => {
    const { result: res1 } = renderHook(() => useRetinaState({ key: myKey }));

    const [state1] = res1.current;
    expect(state1).toBeUndefined();

    const rsInstance2 = createRetinaState({ name: "another instance" });
    rsInstance2.setValue(myKey, exampleValue1);
    const { result: res2 } = renderHook(() =>
      useRetinaState({ key: myKey, retinaState: rsInstance2 })
    );
    const [state2] = res2.current;
    expect(state2).toBe(exampleValue1);
  });

  it("should be able to set and get values", () => {
    const rsInstance2 = createRetinaState({ name: "another instance" });

    const { result } = renderHook(() => useRetinaState({ key: myKey, retinaState: rsInstance2 }));
    const [state1, setState1] = result.current;
    expect(state1).toBeUndefined();

    act(() => setState1(exampleValue1));
    const [state2] = result.current;
    expect(state2).toBe(exampleValue1);
    expect(rsInstance2.getValue(myKey)).toBe(exampleValue1);

    act(() => rsInstance2.setValue(myKey, exampleValue2));
    const [state3] = result.current;
    expect(state3).toBe(exampleValue2);
  });
});
