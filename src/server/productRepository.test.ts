import { defaultProductRepository } from "./productRepository";
vi.mock("./prismaClient", () => ({
  prisma: {
    product: {
      findMany: vi.fn(),
    },
  },
}));

describe("defaultProductRepository", () => {
  test("returns a ProductRepository", () => {
    const repository = defaultProductRepository();
    expect(repository).toHaveProperty("findAll");
    expect(typeof repository.findAll).toBe("function");
  });

});
