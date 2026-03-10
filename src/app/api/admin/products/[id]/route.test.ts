import { GET, PUT, DELETE } from "./route";

vi.mock("@/server/prismaClient", () => ({
  prisma: {
    product: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("@/server/session", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/server/session")>();
  return { ...actual, requireSession: vi.fn() };
});

import { NextResponse } from "next/server";
import { prisma } from "@/server/prismaClient";
import { requireSession } from "@/server/session";

const mockFindUnique = vi.mocked(prisma.product.findUnique);
const mockUpdate = vi.mocked(prisma.product.update);
const mockDelete = vi.mocked(prisma.product.delete);
const mockRequireSession = vi.mocked(requireSession);

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

beforeEach(() => {
  vi.clearAllMocks();
  mockRequireSession.mockReturnValue({ email: "admin@test.com" });
});

describe("GET /api/admin/products/[id]", () => {
  test("returns product with price in dollars", async () => {
    mockFindUnique.mockResolvedValue({
      id: "1",
      name: "Ramen",
      description: "Delicious",
      price: 1200,
      image: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);

    const req = new Request("http://localhost/api/admin/products/1");
    const res = await GET(req, makeParams("1"));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({
      id: "1",
      name: "Ramen",
      description: "Delicious",
      price: 12.0,
    });
  });

  test("returns 404 when product not found", async () => {
    mockFindUnique.mockResolvedValue(null);

    const req = new Request("http://localhost/api/admin/products/nonexistent");
    const res = await GET(req, makeParams("nonexistent"));

    expect(res.status).toBe(404);
  });
});

describe("PUT /api/admin/products/[id]", () => {
  test("updates product with price converted to cents", async () => {
    mockUpdate.mockResolvedValue({
      id: "1",
      name: "Updated Ramen",
      description: "Even better",
      price: 1500,
      image: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);

    const req = new Request("http://localhost/api/admin/products/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Updated Ramen",
        description: "Even better",
        price: 15.0,
      }),
    });

    const res = await PUT(req, makeParams("1"));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.id).toBe("1");
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "1" },
      data: {
        name: "Updated Ramen",
        description: "Even better",
        price: 1500,
      },
    });
  });

  test("returns 400 for missing name", async () => {
    const req = new Request("http://localhost/api/admin/products/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: "No name", price: 10 }),
    });

    const res = await PUT(req, makeParams("1"));
    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/admin/products/[id]", () => {
  test("deletes the product", async () => {
    mockDelete.mockResolvedValue({} as never);

    const req = new Request("http://localhost/api/admin/products/1", {
      method: "DELETE",
    });
    const res = await DELETE(req, makeParams("1"));

    expect(res.status).toBe(200);
    expect(mockDelete).toHaveBeenCalledWith({ where: { id: "1" } });
  });
});

describe("GET /api/admin/products/[id] without session", () => {
  test("returns 401 when no session is present", async () => {
    const unauthorizedResponse = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    mockRequireSession.mockReturnValue(unauthorizedResponse);

    const req = new Request("http://localhost/api/admin/products/1");
    const res = await GET(req, makeParams("1"));

    expect(res.status).toBe(401);
  });
});

describe("PUT /api/admin/products/[id] without session", () => {
  test("returns 401 when no session is present", async () => {
    const unauthorizedResponse = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    mockRequireSession.mockReturnValue(unauthorizedResponse);

    const req = new Request("http://localhost/api/admin/products/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test", price: 10 }),
    });
    const res = await PUT(req, makeParams("1"));

    expect(res.status).toBe(401);
  });
});

describe("DELETE /api/admin/products/[id] without session", () => {
  test("returns 401 when no session is present", async () => {
    const unauthorizedResponse = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    mockRequireSession.mockReturnValue(unauthorizedResponse);

    const req = new Request("http://localhost/api/admin/products/1", {
      method: "DELETE",
    });
    const res = await DELETE(req, makeParams("1"));

    expect(res.status).toBe(401);
  });
});
