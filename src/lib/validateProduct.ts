export function validateProductInput(body: {
  name?: unknown;
  price?: unknown;
}): string | null {
  if (!body.name || typeof body.name !== "string") return "Name is required";
  if (
    typeof body.price !== "number" ||
    !Number.isFinite(body.price) ||
    body.price < 0
  )
    return "Invalid price";
  return null;
}
