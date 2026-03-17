import {
  createPrismaProductRepository,
  type PrismaLike,
} from "./prismaProductRepository";
import { price } from "./price";

test("findAll returns empty array when no products exist", async () => {
  const mockPrisma: PrismaLike = {
    product: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };
  const repository = createPrismaProductRepository(mockPrisma);
  const products = await repository.findAll();
  expect(products).toEqual([]);
});

test("findById returns a product when found", async () => {
  const mockPrisma: PrismaLike = {
    product: {
      findMany: vi.fn(),
      findUnique: vi.fn().mockResolvedValue({
        id: "abc",
        name: "Ramen",
        description: "Rich broth",
        price: 1200,
        image: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };
  const repository = createPrismaProductRepository(mockPrisma);
  const product = await repository.findById("abc");
  expect(product).toEqual({
    id: "abc",
    name: "Ramen",
    description: "Rich broth",
    price: price(12.0),
  });
});

test("findById returns null when product not found", async () => {
  const mockPrisma: PrismaLike = {
    product: {
      findMany: vi.fn(),
      findUnique: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };
  const repository = createPrismaProductRepository(mockPrisma);
  const product = await repository.findById("nonexistent");
  expect(product).toBeNull();
});

test("create stores a product and returns it with generated id", async () => {
  const mockPrisma: PrismaLike = {
    product: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn().mockResolvedValue({
        id: "new-id",
        name: "Tonkatsu",
        description: "Crispy pork",
        price: 1500,
        image: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };
  const repository = createPrismaProductRepository(mockPrisma);
  const product = await repository.create({
    name: "Tonkatsu",
    description: "Crispy pork",
    price: price(15.0),
  });
  expect(product).toEqual({
    id: "new-id",
    name: "Tonkatsu",
    description: "Crispy pork",
    price: price(15.0),
  });
});

test("update modifies a product and returns the updated domain product", async () => {
  const mockPrisma: PrismaLike = {
    product: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn().mockResolvedValue({
        id: "abc",
        name: "Updated Ramen",
        description: "New broth",
        price: 1500,
        image: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      delete: vi.fn(),
    },
  };
  const repository = createPrismaProductRepository(mockPrisma);
  const product = await repository.update("abc", {
    name: "Updated Ramen",
    description: "New broth",
    price: price(15.0),
  });
  expect(product).toEqual({
    id: "abc",
    name: "Updated Ramen",
    description: "New broth",
    price: price(15.0),
  });
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
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };
  const repository = createPrismaProductRepository(mockPrisma);
  const products = await repository.findAll();
  expect(products).toEqual([
    { id: "abc", name: "Ramen", description: "Rich broth", price: price(12.0) },
    { id: "def", name: "Gyoza", description: "Dumplings", price: price(7.5) },
  ]);
});

test("delete removes a product by id", async () => {
  const mockDelete = vi.fn().mockResolvedValue({});
  const mockPrisma: PrismaLike = {
    product: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: mockDelete,
    },
  };
  const repository = createPrismaProductRepository(mockPrisma);
  await repository.delete("abc");
  expect(mockDelete).toHaveBeenCalledWith({ where: { id: "abc" } });
});
