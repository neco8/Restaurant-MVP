async function main() {
  const pg = await import("pg");
  const { PrismaPg } = await import("@prisma/adapter-pg");
  const { PrismaClient } = await import("../src/generated/prisma/client.js");

  const pool = new pg.default.Pool({
    connectionString: process.env["DATABASE_URL"],
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const products = [
    {
      id: "1",
      name: "Ramen",
      price: 1200,
      description: "Rich tonkotsu broth with chashu pork",
    },
    {
      id: "2",
      name: "Gyoza",
      price: 750,
      description: "Pan-fried pork dumplings",
    },
    {
      id: "3",
      name: "Takoyaki",
      price: 800,
      description: "Octopus balls with bonito flakes",
    },
    {
      id: "4",
      name: "Miso Soup",
      price: 500,
      description: "Traditional Japanese soybean soup",
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product,
    });
  }
  console.log(`Seeded ${products.length} products`);
  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
