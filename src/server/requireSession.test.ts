import { requireSession, getSession } from "@/server/session";
import { prisma } from "@/server/prismaClient";

vi.mock("@/server/session", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/server/session")>();
  return {
    ...actual,
    getSession: vi.fn(),
  };
});

vi.mock("@/server/prismaClient", () => ({
  prisma: {
    admin: {
      findUnique: vi.fn(),
    },
  },
}));

const mockGetSession = getSession as ReturnType<typeof vi.fn>;
const mockFindUnique = prisma.admin.findUnique as ReturnType<typeof vi.fn>;

function buildRequest(): Request {
  return new Request("http://localhost/api/admin/test");
}

test("returns 401 when no session exists", async () => {
  mockGetSession.mockReturnValue(null);

  const result = await requireSession(buildRequest());

  expect(result).toBeInstanceOf(Response);
  expect((result as Response).status).toBe(401);
});

test("returns 403 when email is not a registered admin", async () => {
  mockGetSession.mockReturnValue({ email: "unknown@test.com" });
  mockFindUnique.mockResolvedValue(null);

  const result = await requireSession(buildRequest());

  expect(result).toBeInstanceOf(Response);
  expect((result as Response).status).toBe(403);
  expect(mockFindUnique).toHaveBeenCalledWith({
    where: { email: "unknown@test.com" },
  });
});

test("returns session with admin info when email is a registered admin", async () => {
  mockGetSession.mockReturnValue({ email: "admin@test.com" });
  mockFindUnique.mockResolvedValue({ id: "admin-1", email: "admin@test.com" });

  const result = await requireSession(buildRequest());

  expect(result).toEqual({ email: "admin@test.com", adminId: "admin-1" });
  expect(mockFindUnique).toHaveBeenCalledWith({
    where: { email: "admin@test.com" },
  });
});
