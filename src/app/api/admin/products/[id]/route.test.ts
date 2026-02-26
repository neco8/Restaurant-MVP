import { price } from "@/lib/price";

const mockFindById = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
vi.mock("@/server/productRepository", () => ({
  defaultProductRepository: () => ({
    findAll: vi.fn(),
    findById: mockFindById,
    create: vi.fn(),
    update: mockUpdate,
    delete: mockDelete,
  }),
}));

const params = { id: "1" };

describe("GET /api/admin/products/[id]", () => {
  it("returns product as JSON when found", async () => {
    mockFindById.mockResolvedValue({
      id: "1", name: "Ramen", price: price(12.0), description: "Tonkotsu",
    });
    const { GET } = await import("./route");
    const response = await GET(new Request("http://localhost"), { params });
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.name).toBe("Ramen");
  });

  it("returns 404 when product not found", async () => {
    mockFindById.mockResolvedValue(null);
    const { GET } = await import("./route");
    const response = await GET(new Request("http://localhost"), { params });
    expect(response.status).toBe(404);
  });
});

describe("PUT /api/admin/products/[id]", () => {
  it("updates product and returns it", async () => {
    mockUpdate.mockResolvedValue({
      id: "1", name: "Spicy Ramen", price: price(12.0), description: "Hot",
    });
    const { PUT } = await import("./route");
    const request = new Request("http://localhost", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Spicy Ramen" }),
    });
    const response = await PUT(request, { params });
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.name).toBe("Spicy Ramen");
  });
});

describe("DELETE /api/admin/products/[id]", () => {
  it("deletes product and returns 204", async () => {
    mockDelete.mockResolvedValue(undefined);
    const { DELETE } = await import("./route");
    const response = await DELETE(new Request("http://localhost"), { params });
    expect(response.status).toBe(204);
  });
});
