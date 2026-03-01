import { PUT } from "./route";

vi.mock("@/server/prismaClient", () => ({
  prisma: {
    order: {
      update: vi.fn(),
    },
  },
}));

import { prisma } from "@/server/prismaClient";

const mockUpdate = vi.mocked(prisma.order.update);

beforeEach(() => {
  vi.clearAllMocks();
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

describe("PUT /api/admin/orders/[id]", () => {
  test("updates order status and returns updated order", async () => {
    mockUpdate.mockResolvedValue({
      id: "o1",
      status: "pending",
      total: 2700,
      createdAt: new Date("2026-01-15T10:00:00.000Z"),
      updatedAt: new Date(),
    } as never);

    const res = await PUT(createRequest({ status: "pending" }), createContext("o1"));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({ id: "o1", status: "pending" });
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "o1" },
      data: { status: "pending" },
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

  test("accepts completed as a valid status", async () => {
    mockUpdate.mockResolvedValue({
      id: "o1",
      status: "completed",
      total: 2700,
      createdAt: new Date("2026-01-15T10:00:00.000Z"),
      updatedAt: new Date(),
    } as never);

    const res = await PUT(createRequest({ status: "completed" }), createContext("o1"));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({ id: "o1", status: "completed" });
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "o1" },
      data: { status: "completed" },
    });
  });
});
