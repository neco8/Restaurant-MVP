import {
  createPrismaProductRepository,
  type PrismaLike,
} from "./prismaProductRepository";
import { price } from "./price";

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

test("findAll maps Prisma rows to domain products with price conversion", async () => {
  const mockPrisma: PrismaLike = {
    product: {
      findMany: vi.fn().mockResolvedValue([
        {
          id: "abc",
          name: "Ramen",
          description: "Rich broth",
          price: 1200,
          image: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "def",
          name: "Gyoza",
          description: "Dumplings",
          price: 750,
          image: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    },
  };
  const repository = createPrismaProductRepository(mockPrisma);
  const products = await repository.findAll();
  expect(products).toEqual([
    { id: "abc", name: "Ramen", description: "Rich broth", price: price(12.0) },
    { id: "def", name: "Gyoza", description: "Dumplings", price: price(7.5) },
  ]);
});
