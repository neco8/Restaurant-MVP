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
  password,
}: {
  email: string;
  password: string;
}): Promise<void> {
  const pool = createPool();
  try {
    // TODO: implement admin seeding once the admin auth schema exists
    throw new Error("seedTestAdmin not yet implemented");
  } finally {
    await pool.end();
  }
}

export async function cleanupTestAdmin(email: string): Promise<void> {
  const pool = createPool();
  try {
    // TODO: implement admin cleanup once the admin auth schema exists
    throw new Error("cleanupTestAdmin not yet implemented");
  } finally {
    await pool.end();
  }
}
