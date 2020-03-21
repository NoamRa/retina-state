import createRetinaState from "../retinaState";

describe("Test Retina State", () => {
  const exampleValue1 = { a: 1 };
  const exampleValue2 = { b: 2 };

  const sub1 = jest.fn();
  const sub2 = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should test initialization", () => {
    const retinaState1 = createRetinaState();
    expect(retinaState1.name).toBe("retina state");
    expect(Object.isFrozen(retinaState1)).toBeTruthy();

    const retinaState2 = createRetinaState({});
    expect(retinaState2.name).toBe("retina state");

    const retinaState3 = createRetinaState({ name: "my state" });
    expect(retinaState3.name).toBe("my state");
  });

  it("shoudl be able to set and get state", () => {
    const retinaState = createRetinaState();

    expect(retinaState.getValue("key1")).toBeUndefined();
    retinaState.setValue("key1", exampleValue1);
    expect(retinaState.getValue("key1")).toBe(exampleValue1);
    retinaState.setValue("key1", exampleValue2);
    expect(retinaState.getValue("key1")).toBe(exampleValue2);

    expect(retinaState.getValue("key2")).toBeUndefined();
    retinaState.setValue("key2", exampleValue1);
    expect(retinaState.getValue("key2")).toBe(exampleValue1);
    retinaState.setValue("key2", exampleValue2);
    expect(retinaState.getValue("key2")).toBe(exampleValue2);
  });

  it("should call subscribers on state change", () => {
    const retinaState = createRetinaState();
    const unsub1 = retinaState.subscribe("key1", sub1);
    expect(sub1).not.toHaveBeenCalled();
    expect(retinaState.getValue("key1")).toBeUndefined();
    expect(sub1).not.toHaveBeenCalled();

    retinaState.setValue("key1", exampleValue1);
    expect(retinaState.getValue("key1")).toBe(exampleValue1);
    expect(sub1).toHaveBeenCalledWith(exampleValue1);
    expect(sub1).toHaveBeenCalledTimes(1);

    retinaState.subscribe("key1", sub2);
    retinaState.setValue("key1", exampleValue2);
    expect(retinaState.getValue("key1")).toBe(exampleValue2);
    expect(sub1).toHaveBeenCalledWith(exampleValue2);
    expect(sub1).toHaveBeenCalledTimes(2);
    expect(sub2).toHaveBeenCalledWith(exampleValue2);
    expect(sub2).toHaveBeenCalledTimes(1);

    unsub1();
    retinaState.setValue("key1", exampleValue1);
    expect(retinaState.getValue("key1")).toBe(exampleValue1);
    expect(sub1).toHaveBeenCalledWith(exampleValue1);
    expect(sub1).toHaveBeenCalledTimes(2);
    expect(sub2).toHaveBeenCalledWith(exampleValue1);
    expect(sub2).toHaveBeenCalledTimes(2);
  });

  it("should be able to retrive keys", () => {
    const retinaState = createRetinaState();
    expect(retinaState.listKeys()).toEqual([]);

    retinaState.setValue("key1", exampleValue1);
    expect(retinaState.listKeys()).toEqual(["key1"]);

    retinaState.setValue("key2", exampleValue2);
    expect(retinaState.listKeys()).toEqual(["key1", "key2"]);
  });

  it("should be able to clear all values", () => {
    const retinaState = createRetinaState();
    // flush should work on newly created instance
    retinaState.flush();
    retinaState.setValue("key1", exampleValue1);
    retinaState.setValue("key2", exampleValue2);
    const unsub1 = retinaState.subscribe("key1", sub1);

    expect(retinaState.listKeys()).toEqual(["key1", "key2"]);

    retinaState.flush();
    expect(retinaState.listKeys()).toEqual([]);
    expect(retinaState.getValue("key1")).toBeUndefined();
    expect(sub1).toHaveBeenCalledWith(undefined);

    // unsubsbriber can still be called after flushing
    unsub1();
  });
});
