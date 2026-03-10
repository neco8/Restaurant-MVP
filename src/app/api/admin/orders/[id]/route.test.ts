import { PUT } from "./route";

vi.mock("@/server/prismaClient", () => ({
  prisma: {
    order: {
      update: vi.fn(),
      findUnique: vi.fn(),
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

const mockUpdate = vi.mocked(prisma.order.update);
const mockFindUnique = vi.mocked(prisma.order.findUnique);
const mockRequireSession = vi.mocked(requireSession);

beforeEach(() => {
  vi.clearAllMocks();
  mockRequireSession.mockReturnValue({ email: "admin@test.com" });
});

function createRequest(body: object) {
  return new Request("http://localhost/api/admin/orders/o1", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function createContext(id: string) {
  return { params: Promise.resolve({ id }) };
}

describe("PUT /api/admin/orders/[id] without session", () => {
  test("returns 401 when no session is present", async () => {
    const unauthorizedResponse = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    mockRequireSession.mockReturnValue(unauthorizedResponse);

    const res = await PUT(createRequest({ status: "pending" }), createContext("o1"));

    expect(res.status).toBe(401);
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});

describe("PUT /api/admin/orders/[id]", () => {
  test("updates order status and returns updated order", async () => {
    mockFindUnique.mockResolvedValue({
      id: "o1",
      status: "pending",
      total: 2700,
      createdAt: new Date("2026-01-15T10:00:00.000Z"),
      updatedAt: new Date(),
    } as never);
    mockUpdate.mockResolvedValue({
      id: "o1",
      status: "preparing",
      total: 2700,
      createdAt: new Date("2026-01-15T10:00:00.000Z"),
      updatedAt: new Date(),
    } as never);

    const res = await PUT(createRequest({ status: "preparing" }), createContext("o1"));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({ id: "o1", status: "preparing" });
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "o1" },
      data: { status: "preparing" },
    });
  });

  test("returns 400 when status is missing", async () => {
    const res = await PUT(createRequest({}), createContext("o1"));

    expect(res.status).toBe(400);
  });

  test("returns 400 when status is invalid", async () => {
    const res = await PUT(createRequest({ status: "invalid" }), createContext("o1"));

    expect(res.status).toBe(400);
  });

  test("accepts preparing as a valid status", async () => {
    mockFindUnique.mockResolvedValue({
      id: "o1",
      status: "pending",
      total: 2700,
      createdAt: new Date("2026-01-15T10:00:00.000Z"),
      updatedAt: new Date(),
    } as never);
    mockUpdate.mockResolvedValue({
      id: "o1",
      status: "preparing",
      total: 2700,
      createdAt: new Date("2026-01-15T10:00:00.000Z"),
      updatedAt: new Date(),
    } as never);

    const res = await PUT(createRequest({ status: "preparing" }), createContext("o1"));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({ id: "o1", status: "preparing" });
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "o1" },
      data: { status: "preparing" },
    });
  });

  test("accepts done as a valid status", async () => {
    mockFindUnique.mockResolvedValue({
      id: "o1",
      status: "preparing",
      total: 2700,
      createdAt: new Date("2026-01-15T10:00:00.000Z"),
      updatedAt: new Date(),
    } as never);
    mockUpdate.mockResolvedValue({
      id: "o1",
      status: "done",
      total: 2700,
      createdAt: new Date("2026-01-15T10:00:00.000Z"),
      updatedAt: new Date(),
    } as never);

    const res = await PUT(createRequest({ status: "done" }), createContext("o1"));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({ id: "o1", status: "done" });
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "o1" },
      data: { status: "done" },
    });
  });

  test("rejects completed as an invalid status", async () => {
    const res = await PUT(createRequest({ status: "completed" }), createContext("o1"));

    expect(res.status).toBe(400);
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test("returns 400 when status transition is invalid (done → pending)", async () => {
    mockFindUnique.mockResolvedValue({
      id: "o1",
      status: "done",
      total: 2700,
      createdAt: new Date("2026-01-15T10:00:00.000Z"),
      updatedAt: new Date(),
    } as never);

    const res = await PUT(createRequest({ status: "pending" }), createContext("o1"));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toMatch(/invalid status transition/i);
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test("returns 404 when order is not found", async () => {
    mockFindUnique.mockResolvedValue(null);

    const res = await PUT(createRequest({ status: "preparing" }), createContext("o1"));

    expect(res.status).toBe(404);
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});
