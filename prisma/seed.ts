import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const products = [
  { name: "Ramen", price: 1200, description: "Rich tonkotsu broth with chashu pork" },
  { name: "Gyoza", price: 750, description: "Pan-fried pork dumplings" },
  { name: "Takoyaki", price: 800, description: "Octopus balls with bonito flakes" },
];

async function main() {
  const count = await prisma.product.count();
  if (count > 0) {
    console.log(`Database already has ${count} products, skipping seed`);
    return;
  }
  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log(`Seeded ${products.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
