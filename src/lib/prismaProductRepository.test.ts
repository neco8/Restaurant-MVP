import {
  createPrismaProductRepository,
  type PrismaProductClient,
} from "./prismaProductRepository";

test("findAll returns empty list when no products exist", async () => {
  const mockPrisma: PrismaProductClient = {
    product: {
      findMany: async () => [],
    },
  };

  const repo = createPrismaProductRepository(mockPrisma);
  const result = await repo.findAll();

  expect(result).toEqual([]);
});
