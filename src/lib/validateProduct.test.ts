import { validateProduct } from "./validateProduct";

describe("validateProduct", () => {
  test("returns valid with data when body has name and price", () => {
    const result = validateProduct({ name: "Ramen", description: "Delicious", price: 12.5 });
    expect(result).toEqual({
      valid: true,
      data: { name: "Ramen", description: "Delicious", price: 12.5 },
    });
  });

  test("defaults description to empty string when missing", () => {
    const result = validateProduct({ name: "Ramen", price: 10 });
    expect(result).toEqual({
      valid: true,
      data: { name: "Ramen", description: "", price: 10 },
    });
  });

  test("returns error when name is missing", () => {
    const result = validateProduct({ price: 10 });
    expect(result).toEqual({ valid: false, error: "Name is required" });
  });

  test("returns error when name is empty string", () => {
    const result = validateProduct({ name: "", price: 10 });
    expect(result).toEqual({ valid: false, error: "Name is required" });
  });

  test("returns error when name is not a string", () => {
    const result = validateProduct({ name: 123, price: 10 });
    expect(result).toEqual({ valid: false, error: "Name is required" });
  });

  test("returns error when price is missing", () => {
    const result = validateProduct({ name: "Ramen" });
    expect(result).toEqual({ valid: false, error: "Invalid price" });
  });

  test("returns error when price is negative", () => {
    const result = validateProduct({ name: "Ramen", price: -5 });
    expect(result).toEqual({ valid: false, error: "Invalid price" });
  });

  test("returns error when price is not a number", () => {
    const result = validateProduct({ name: "Ramen", price: "ten" });
    expect(result).toEqual({ valid: false, error: "Invalid price" });
  });

  test("returns error when price is Infinity", () => {
    const result = validateProduct({ name: "Ramen", price: Infinity });
    expect(result).toEqual({ valid: false, error: "Invalid price" });
  });
});
