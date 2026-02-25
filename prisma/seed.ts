import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const products = [
  { name: "Ramen", description: "Rich tonkotsu broth with chashu pork", price: 1200 },
  { name: "Gyoza", description: "Pan-fried pork dumplings", price: 750 },
  { name: "Takoyaki", description: "Octopus balls with bonito flakes", price: 800 },
];

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.name.toLowerCase() },
      update: { ...product },
      create: { id: product.name.toLowerCase(), ...product },
    });
  }
  console.log(`Seeded ${products.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
