import {
  createPrismaProductRepository,
  type PrismaLike,
} from "./prismaProductRepository";
import { price } from "./price";

function createMockPrisma(overrides: Partial<PrismaLike["product"]> = {}): PrismaLike {
  return {
    product: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      ...overrides,
    },
  };
}

test("findAll returns empty array when no products exist", async () => {
  const mockPrisma = createMockPrisma();
  const repository = createPrismaProductRepository(mockPrisma);
  const products = await repository.findAll();
  expect(products).toEqual([]);
});

test("findAll maps Prisma rows to domain products with price conversion", async () => {
  const mockPrisma = createMockPrisma({
    findMany: vi.fn().mockResolvedValue([
      { id: "abc", name: "Ramen", description: "Rich broth", price: 1200 },
      { id: "def", name: "Gyoza", description: "Dumplings", price: 750 },
    ]),
  });
  const repository = createPrismaProductRepository(mockPrisma);
  const products = await repository.findAll();
  expect(products).toEqual([
    { id: "abc", name: "Ramen", description: "Rich broth", price: price(12.0) },
    { id: "def", name: "Gyoza", description: "Dumplings", price: price(7.5) },
  ]);
});

test("create calls prisma.product.create and returns domain product", async () => {
  const mockPrisma = createMockPrisma({
    create: vi.fn().mockResolvedValue({
      id: "new-1", name: "Udon", description: "Thick noodles", price: 1000,
    }),
  });
  const repository = createPrismaProductRepository(mockPrisma);
  const result = await repository.create({
    name: "Udon", description: "Thick noodles", price: price(10.0),
  });
  expect(mockPrisma.product.create).toHaveBeenCalledWith({
    data: { name: "Udon", description: "Thick noodles", price: 1000 },
  });
  expect(result).toEqual({
    id: "new-1", name: "Udon", description: "Thick noodles", price: price(10.0),
  });
});

test("findById returns domain product when found", async () => {
  const mockPrisma = createMockPrisma({
    findUnique: vi.fn().mockResolvedValue({
      id: "1", name: "Ramen", description: "Broth", price: 1200,
    }),
  });
  const repository = createPrismaProductRepository(mockPrisma);
  const result = await repository.findById("1");
  expect(mockPrisma.product.findUnique).toHaveBeenCalledWith({ where: { id: "1" } });
  expect(result).toEqual({
    id: "1", name: "Ramen", description: "Broth", price: price(12.0),
  });
});

test("findById returns null when not found", async () => {
  const mockPrisma = createMockPrisma();
  const repository = createPrismaProductRepository(mockPrisma);
  const result = await repository.findById("nonexistent");
  expect(result).toBeNull();
});

test("update calls prisma.product.update and returns domain product", async () => {
  const mockPrisma = createMockPrisma({
    update: vi.fn().mockResolvedValue({
      id: "1", name: "Spicy Ramen", description: "Broth", price: 1200,
    }),
  });
  const repository = createPrismaProductRepository(mockPrisma);
  const result = await repository.update("1", { name: "Spicy Ramen" });
  expect(mockPrisma.product.update).toHaveBeenCalledWith({
    where: { id: "1" },
    data: { name: "Spicy Ramen" },
  });
  expect(result).toEqual({
    id: "1", name: "Spicy Ramen", description: "Broth", price: price(12.0),
  });
});

test("delete calls prisma.product.delete", async () => {
  const mockPrisma = createMockPrisma({
    delete: vi.fn().mockResolvedValue({ id: "1", name: "Ramen", description: "Broth", price: 1200 }),
  });
  const repository = createPrismaProductRepository(mockPrisma);
  await repository.delete("1");
  expect(mockPrisma.product.delete).toHaveBeenCalledWith({ where: { id: "1" } });
});
