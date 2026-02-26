import { price } from "@/lib/price";

const mockFindAll = vi.fn();
const mockCreate = vi.fn();
vi.mock("@/server/productRepository", () => ({
  defaultProductRepository: () => ({ findAll: mockFindAll, create: mockCreate }),
}));

describe("GET /api/admin/products", () => {
  beforeEach(() => {
    mockFindAll.mockResolvedValue([
      { id: "1", name: "Ramen", price: price(12.0), description: "Tonkotsu" },
    ]);
  });

  it("returns product list as JSON", async () => {
    const { GET } = await import("./route");
    const response = await GET();
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body).toHaveLength(1);
    expect(body[0].name).toBe("Ramen");
  });
});

describe("POST /api/admin/products", () => {
  it("creates a product and returns 201", async () => {
    mockCreate.mockResolvedValue({
      id: "new-1",
      name: "Udon",
      price: price(10.0),
      description: "Thick noodles",
    });
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Udon", description: "Thick noodles", price: 10.0 }),
    });
    const response = await POST(request);
    const body = await response.json();
    expect(response.status).toBe(201);
    expect(body.name).toBe("Udon");
  });

  it("returns 400 when name is missing", async () => {
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: "Thick noodles", price: 10.0 }),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("returns 400 when price is negative", async () => {
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Udon", description: "Noodles", price: -5 }),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
