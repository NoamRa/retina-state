import retinaStateInstace from "../retinaStateInstance";

describe("Text retinaStateInstace", () => {
  it("should act as singleton", () => {
    import("../retinaStateInstance").then(secondImport => {
      const anotherRetinaStateInstance = secondImport.default;
      expect(retinaStateInstace).toBe(anotherRetinaStateInstance);

      const myObj = { a: 1 };
      retinaStateInstace.setValue("myKey", myObj)
      expect(anotherRetinaStateInstance.getValue("myKey")).toBe(myObj);
    });
  });
});
