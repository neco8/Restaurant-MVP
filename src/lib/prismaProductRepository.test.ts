import {
  createPrismaProductRepository,
  type PrismaProductClient,
} from "./prismaProductRepository";
import { price } from "./price";

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

test("findAll returns domain products mapped from prisma rows with cents-to-dollars conversion", async () => {
  const mockPrisma: PrismaProductClient = {
    product: {
      findMany: async () => [
        { id: "1", name: "Ramen", description: "Rich broth", price: 1200 },
        { id: "2", name: "Gyoza", description: "Dumplings", price: 750 },
      ],
    },
  };

  const repo = createPrismaProductRepository(mockPrisma);
  const result = await repo.findAll();

  expect(result).toEqual([
    { id: "1", name: "Ramen", description: "Rich broth", price: price(12.0) },
    { id: "2", name: "Gyoza", description: "Dumplings", price: price(7.5) },
  ]);
});
