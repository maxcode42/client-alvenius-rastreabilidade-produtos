describe("Application smoke test", () => {
  describe("Anonymous user", () => {
    test("should have NODE_ENV defined", () => {
      expect(process.env.NODE_ENV).toBeDefined();
    });
  });
});
