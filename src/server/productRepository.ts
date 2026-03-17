import { createInMemoryProductRepository } from "@/lib/inMemoryProductRepository";
import { createPrismaProductRepository } from "@/lib/prismaProductRepository";
import { price } from "@/lib/price";
import type { Product, ProductRepository } from "@/lib/types";
import { prisma } from "./prismaClient";

const demoProducts: Product[] = [
  { id: "demo-1", name: "Tonkotsu Ramen", price: price(12.0), description: "Rich pork bone broth with chashu, egg, and nori" },
  { id: "demo-2", name: "Gyoza (6pc)", price: price(7.5), description: "Pan-fried pork and vegetable dumplings" },
  { id: "demo-3", name: "Karaage", price: price(9.0), description: "Japanese fried chicken with yuzu mayo" },
];

export function defaultProductRepository(): ProductRepository {
  if (process.env.DEMO_MODE === "true") {
    return createInMemoryProductRepository([...demoProducts]);
  }
  return createPrismaProductRepository(prisma);
}
