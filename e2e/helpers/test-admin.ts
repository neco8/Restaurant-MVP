import pg from "pg";

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  return new pg.Pool({ connectionString });
}

export async function seedTestAdmin({
  email,
}: {
  email: string;
}): Promise<void> {
  const pool = createPool();
  try {
    await pool.query(
      `INSERT INTO "Admin" (id, email, "passwordHash", "createdAt")
       VALUES (gen_random_uuid(), $1, $2, NOW())
       ON CONFLICT (email) DO NOTHING`,
      [email, "oauth-no-password"]
    );
  } finally {
    await pool.end();
  }
}

export async function cleanupTestAdmin(email: string): Promise<void> {
  const pool = createPool();
  try {
    await pool.query(`DELETE FROM "Admin" WHERE email = $1`, [email]);
  } finally {
    await pool.end();
  }
}
