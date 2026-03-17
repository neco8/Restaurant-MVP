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

  describe("when DEMO_MODE is true", () => {
    beforeEach(() => {
      process.env.DEMO_MODE = "true";
    });

    afterEach(() => {
      delete process.env.DEMO_MODE;
    });

    test("returns a working repository without database", async () => {
      const repository = defaultProductRepository();
      const products = await repository.findAll();
      expect(Array.isArray(products)).toBe(true);
    });
  });
});
