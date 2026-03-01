import type { Page } from "@playwright/test";
import { seedTestAdmin, cleanupTestAdmin } from "./test-admin";

const SHARED_ADMIN = {
  email: "e2e-shared-admin@test.local",
  password: "Shared-Admin-Password-123!",
};

export { SHARED_ADMIN };

export async function ensureAdminSeeded(): Promise<void> {
  await seedTestAdmin(SHARED_ADMIN);
}

export async function cleanupSharedAdmin(): Promise<void> {
  await cleanupTestAdmin(SHARED_ADMIN.email);
}

export async function loginAsAdmin(page: Page): Promise<void> {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(SHARED_ADMIN.email);
  await page.getByLabel("Password").fill(SHARED_ADMIN.password);
  await page.getByRole("button", { name: /log in/i }).click();
  await page.waitForURL(/\/admin(?!\/login)/);
}
