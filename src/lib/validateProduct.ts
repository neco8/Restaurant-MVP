type ValidResult = {
  valid: true;
  data: { name: string; description: string; price: number };
};

type InvalidResult = {
  valid: false;
  error: string;
};

export type ValidationResult = ValidResult | InvalidResult;

export function validateProduct(body: Record<string, unknown>): ValidationResult {
  const { name, description, price } = body;

  if (!name || typeof name !== "string") {
    return { valid: false, error: "Name is required" };
  }
  if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
    return { valid: false, error: "Invalid price" };
  }

  return {
    valid: true,
    data: {
      name,
      description: (description as string) || "",
      price,
    },
  };
}
