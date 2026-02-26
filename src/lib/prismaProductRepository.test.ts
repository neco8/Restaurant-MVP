import {
  createPrismaProductRepository,
  type PrismaLike,
} from "./prismaProductRepository";

test("findAll returns empty array when no products exist", async () => {
  const mockPrisma: PrismaLike = {
    product: {
      findMany: vi.fn().mockResolvedValue([]),
    },
  };
  const repository = createPrismaProductRepository(mockPrisma);
  const products = await repository.findAll();
  expect(products).toEqual([]);
});
