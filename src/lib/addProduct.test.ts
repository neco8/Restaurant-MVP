import { addProduct } from "./addProduct";
import { price } from "./price";
import type { Product } from "./types";

const mockCreate = vi.fn();

const repository = {
  findAll: vi.fn(),
  create: mockCreate,
};

test("calls repository.create with input and returns created product", async () => {
  const input = { name: "Udon", description: "Thick noodles", price: price(10.0) };
  const created: Product = { id: "1", ...input };
  mockCreate.mockResolvedValue(created);

  const result = await addProduct(repository, input);

  expect(mockCreate).toHaveBeenCalledWith(input);
  expect(result).toEqual(created);
});
