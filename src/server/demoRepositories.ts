import { createInMemoryAdminRepository } from "@/lib/inMemoryAdminRepository";
import { createInMemoryOrderRepository } from "@/lib/inMemoryOrderRepository";
import { createInMemoryProductRepository } from "@/lib/inMemoryProductRepository";
import { price } from "@/lib/price";
import type {
  AdminRepository,
  OrderRepository,
  Product,
  ProductRepository,
} from "@/lib/types";

const demoProducts: Product[] = [
  { id: "demo-1", name: "Tonkotsu Ramen", price: price(12.0), description: "Rich pork bone broth with chashu, egg, and nori" },
  { id: "demo-2", name: "Gyoza (6pc)", price: price(7.5), description: "Pan-fried pork and vegetable dumplings" },
  { id: "demo-3", name: "Karaage", price: price(9.0), description: "Japanese fried chicken with yuzu mayo" },
];

export function isDemoMode(): boolean {
  return process.env.DEMO_MODE === "true";
}

let cachedProductRepo: ProductRepository | null = null;
let cachedOrderRepo: OrderRepository | null = null;
let cachedAdminRepo: AdminRepository | null = null;

export function demoProductRepository(): ProductRepository {
  if (!cachedProductRepo) {
    cachedProductRepo = createInMemoryProductRepository([...demoProducts]);
  }
  return cachedProductRepo;
}

export function demoOrderRepository(): OrderRepository {
  if (!cachedOrderRepo) {
    cachedOrderRepo = createInMemoryOrderRepository();
  }
  return cachedOrderRepo;
}

export function demoAdminRepository(): AdminRepository {
  if (!cachedAdminRepo) {
    cachedAdminRepo = createInMemoryAdminRepository([]);
  }
  return cachedAdminRepo;
}
