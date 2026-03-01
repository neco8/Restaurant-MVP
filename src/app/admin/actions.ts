"use server";

import { redirect } from "next/navigation";
import { destroySession } from "@/server/session";

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
