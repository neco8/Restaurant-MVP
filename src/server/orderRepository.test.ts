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

});
