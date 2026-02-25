import { createPrismaProductRepository } from "./prismaProductRepository";
import { price } from "../price";
import type { PrismaClient } from "@/generated/prisma/client";

function mockPrisma(products: Array<{ id: string; name: string; description: string; price: number }>) {
  return {
    product: { findMany: async () => products },
  } as unknown as PrismaClient;
}

test("findAll returns empty list when no products", async () => {
  const repository = createPrismaProductRepository(mockPrisma([]));
  const result = await repository.findAll();
  expect(result).toEqual([]);
});

test("findAll returns products with price converted from cents to dollars", async () => {
  const repository = createPrismaProductRepository(
    mockPrisma([
      { id: "1", name: "Ramen", description: "Rich tonkotsu broth", price: 1200 },
    ])
  );
  const result = await repository.findAll();
  expect(result).toEqual([
    { id: "1", name: "Ramen", description: "Rich tonkotsu broth", price: price(12.0) },
  ]);
});

test("findAll returns multiple products with fractional dollar prices", async () => {
  const repository = createPrismaProductRepository(
    mockPrisma([
      { id: "1", name: "Ramen", description: "Broth", price: 1200 },
      { id: "2", name: "Gyoza", description: "Dumplings", price: 750 },
      { id: "3", name: "Takoyaki", description: "Octopus balls", price: 800 },
    ])
  );
  const result = await repository.findAll();
  expect(result).toEqual([
    { id: "1", name: "Ramen", description: "Broth", price: price(12.0) },
    { id: "2", name: "Gyoza", description: "Dumplings", price: price(7.5) },
    { id: "3", name: "Takoyaki", description: "Octopus balls", price: price(8.0) },
  ]);
});
