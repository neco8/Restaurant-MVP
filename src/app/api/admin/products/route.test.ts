import { GET, POST } from "./route";

vi.mock("@/server/prismaClient", () => ({
  prisma: {
    product: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { prisma } from "@/server/prismaClient";

const mockFindMany = vi.mocked(prisma.product.findMany);
const mockCreate = vi.mocked(prisma.product.create);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/admin/products", () => {
  test("returns all products with price in dollars", async () => {
    mockFindMany.mockResolvedValue([
      {
        id: "1",
        name: "Ramen",
        description: "Delicious",
        price: 1200,
        image: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ] as never);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual([
      {
        id: "1",
        name: "Ramen",
        description: "Delicious",
        price: 12.0,
      },
    ]);
  });

  test("returns empty array when no products", async () => {
    mockFindMany.mockResolvedValue([]);

    const res = await GET();
    const data = await res.json();

    expect(data).toEqual([]);
  });
});

describe("POST /api/admin/products", () => {
  test("creates a product with price converted to cents", async () => {
    mockCreate.mockResolvedValue({
      id: "new-1",
      name: "Tempura",
      description: "Crispy",
      price: 1450,
      image: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);

    const req = new Request("http://localhost/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Tempura", description: "Crispy", price: 14.5 }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.id).toBe("new-1");
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        name: "Tempura",
        description: "Crispy",
        price: 1450,
        image: "",
      },
    });
  });

  test("returns 400 for missing name", async () => {
    const req = new Request("http://localhost/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: "No name", price: 10 }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  test("returns 400 for invalid price", async () => {
    const req = new Request("http://localhost/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test", description: "Test", price: -5 }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
