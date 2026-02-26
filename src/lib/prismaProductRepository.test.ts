import { createPrismaProductRepository } from "./prismaProductRepository";
import { price } from "./price";

test("findAll returns empty list when no products in database", async () => {
  const prisma = { product: { findMany: async () => [] } };
  const repository = createPrismaProductRepository(prisma as never);
  const products = await repository.findAll();
  expect(products).toEqual([]);
});

test("findAll returns products mapped from database rows", async () => {
  const prisma = {
    product: {
      findMany: async () => [
        {
          id: "abc123",
          name: "Ramen",
          description: "Rich tonkotsu broth",
          price: 1200,
          image: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
  };
  const repository = createPrismaProductRepository(prisma as never);
  const products = await repository.findAll();
  expect(products).toEqual([
    {
      id: "abc123",
      name: "Ramen",
      description: "Rich tonkotsu broth",
      price: price(12.0),
    },
  ]);
});
