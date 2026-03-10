import type { Page } from "@playwright/test";
import { seedTestAdmin, cleanupTestAdmin } from "./test-admin";

const SHARED_ADMIN = {
  email: "e2e-shared-admin@test.local",
};

export { SHARED_ADMIN };

export async function ensureAdminSeeded(): Promise<void> {
  await seedTestAdmin({ email: SHARED_ADMIN.email });
}

export async function cleanupSharedAdmin(): Promise<void> {
  await cleanupTestAdmin(SHARED_ADMIN.email);
}

export async function loginAsAdmin(page: Page): Promise<void> {
  await page.context().addCookies([
    {
      name: "session",
      value: SHARED_ADMIN.email,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    },
  ]);
  await page.goto("/admin");
}
