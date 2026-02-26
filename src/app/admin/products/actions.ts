"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addProduct } from "@/lib/addProduct";
import { updateProduct } from "@/lib/updateProduct";
import { deleteProduct } from "@/lib/deleteProduct";
import { defaultProductRepository } from "@/server/productRepository";
import { parsePrice } from "@/lib/price";
import { ROUTES } from "@/lib/routes";

export async function createProductAction(input: {
  name: string;
  description: string;
  price: number;
}) {
  const parsedPrice = parsePrice(input.price);
  if (parsedPrice === null) {
    throw new Error("Invalid price");
  }

  const repo = defaultProductRepository();
  await addProduct(repo, {
    name: input.name,
    description: input.description,
    price: parsedPrice,
  });

  revalidatePath(ROUTES.ADMIN_PRODUCTS);
  redirect(ROUTES.ADMIN_PRODUCTS);
}

export async function updateProductAction(
  id: string,
  input: { name: string; description: string; price: number }
) {
  const parsedPrice = parsePrice(input.price);
  if (parsedPrice === null) {
    throw new Error("Invalid price");
  }

  const repo = defaultProductRepository();
  await updateProduct(repo, id, {
    name: input.name,
    description: input.description,
    price: parsedPrice,
  });

  revalidatePath(ROUTES.ADMIN_PRODUCTS);
  redirect(ROUTES.ADMIN_PRODUCTS);
}

export async function deleteProductAction(id: string) {
  const repo = defaultProductRepository();
  await deleteProduct(repo, id);

  revalidatePath(ROUTES.ADMIN_PRODUCTS);
}
