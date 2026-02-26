import { describe, it, expect } from "vitest";
import { price } from "@/lib/price";

const mockFindAll = vi.fn();
vi.mock("@/server/productRepository", () => ({
  defaultProductRepository: () => ({ findAll: mockFindAll }),
}));

describe("GET /api/products", () => {
  beforeEach(() => {
    mockFindAll.mockResolvedValue([
      { id: "1", name: "Ramen", price: price(12.00), description: "Rich tonkotsu broth" },
      { id: "2", name: "Gyoza", price: price(7.50), description: "Pan-fried pork dumplings" },
    ]);
  });

  it("returns product list as JSON", async () => {
    const { GET } = await import("./route");
    const response = await GET();
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  it("returns products with id, name, price, and description", async () => {
    const { GET } = await import("./route");
    const response = await GET();
    const body = await response.json();
    const product = body[0];
    expect(product).toHaveProperty("id");
    expect(product).toHaveProperty("name");
    expect(product).toHaveProperty("price");
    expect(product).toHaveProperty("description");
  });
});
