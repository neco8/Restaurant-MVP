"use server";

import { destroySession } from "@/lib/session";

export async function logout() {
  await destroySession();
}
