import { defaultOrderRepository } from "./orderRepository";

vi.mock("./prismaClient", () => ({
  prisma: {
    order: {
      create: vi.fn(),
    },
  },
}));

describe("defaultOrderRepository", () => {
  test("returns an OrderRepository with save method", () => {
    const repository = defaultOrderRepository();
    expect(repository).toHaveProperty("save");
    expect(typeof repository.save).toBe("function");
  });

  describe("when DEMO_MODE is true", () => {
    beforeEach(() => {
      process.env.DEMO_MODE = "true";
    });

    afterEach(() => {
      delete process.env.DEMO_MODE;
    });

    test("returns a working repository without database", async () => {
      const repository = defaultOrderRepository();
      const count = await repository.count();
      expect(typeof count).toBe("number");
    });
  });
});
