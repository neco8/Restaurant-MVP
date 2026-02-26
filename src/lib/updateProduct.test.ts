import { updateProduct } from "./updateProduct";
import { price } from "./price";
import type { Product } from "./types";

const mockUpdate = vi.fn();

const repository = {
  update: mockUpdate,
};

test("calls repository.update with id and input, returns updated product", async () => {
  const updated: Product = { id: "1", name: "Spicy Ramen", price: price(12.0), description: "Hot" };
  mockUpdate.mockResolvedValue(updated);

  const result = await updateProduct(repository, "1", { name: "Spicy Ramen" });

  expect(mockUpdate).toHaveBeenCalledWith("1", { name: "Spicy Ramen" });
  expect(result).toEqual(updated);
});
