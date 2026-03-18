import { NextRequest, NextResponse } from "next/server";
import pg from "pg";
import { SIGNATURE_DISHES } from "@/lib/signatureDishes";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  try {
    await pool.query(`DELETE FROM "OrderItem"`);
    await pool.query(`DELETE FROM "Order"`);
    await pool.query(`DELETE FROM "Product"`);

    for (let index = 0; index < SIGNATURE_DISHES.length; index++) {
      const dish = SIGNATURE_DISHES[index];
      const price = parseInt(dish.price.replace("$", ""), 10) * 100;
      await pool.query(
        `INSERT INTO "Product" (id, name, description, price, image, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
        [
          `demo-product-${index + 1}`,
          dish.english,
          dish.description,
          price,
          dish.image,
        ],
      );
    }

    await pool.query(
      `INSERT INTO "Admin" (id, email, "passwordHash", "createdAt")
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (email) DO UPDATE SET "passwordHash" = $3`,
      ["demo-admin-1", "demo-admin@example.com", "oauth-no-password"],
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  } finally {
    await pool.end();
  }
}
