import { createPrismaProductRepository } from "./prismaProductRepository";

test("findAll returns empty list when no products in database", async () => {
  const prisma = { product: { findMany: async () => [] } };
  const repository = createPrismaProductRepository(prisma as never);
  const products = await repository.findAll();
  expect(products).toEqual([]);
});
