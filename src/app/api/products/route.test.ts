import { describe, it, expect } from "vitest";
import { GET } from "./route";

describe("GET /api/products", () => {
  it("returns product list as JSON", async () => {
    const response = await GET();
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  it("returns products with id, name, price, and description", async () => {
    const response = await GET();
    const body = await response.json();
    const product = body[0];
    expect(product).toHaveProperty("id");
    expect(product).toHaveProperty("name");
    expect(product).toHaveProperty("price");
    expect(product).toHaveProperty("description");
  });
});
