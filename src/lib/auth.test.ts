import bcrypt from "bcryptjs";
import { verifyAdminCredentials } from "./auth";
import { findAdminByEmail } from "@/lib/admin-repository";

vi.mock("@/lib/admin-repository", () => ({
  findAdminByEmail: vi.fn(),
}));

const mockFindAdminByEmail = findAdminByEmail as ReturnType<typeof vi.fn>;

const fakePrisma = {} as Parameters<typeof verifyAdminCredentials>[0];

test("returns false when no admin exists with that email", async () => {
  mockFindAdminByEmail.mockResolvedValue(null);

  const result = await verifyAdminCredentials(
    fakePrisma,
    "nonexistent@example.com",
    "any-password"
  );

  expect(result).toBe(false);
  expect(mockFindAdminByEmail).toHaveBeenCalledWith(
    fakePrisma,
    "nonexistent@example.com"
  );
});

test("returns true when admin exists and password matches hash", async () => {
  const passwordHash = bcrypt.hashSync("correct-password", 10);

  mockFindAdminByEmail.mockResolvedValue({
    id: "1",
    email: "admin@test.com",
    passwordHash,
  });

  const result = await verifyAdminCredentials(
    fakePrisma,
    "admin@test.com",
    "correct-password"
  );

  expect(result).toBe(true);
  expect(mockFindAdminByEmail).toHaveBeenCalledWith(
    fakePrisma,
    "admin@test.com"
  );
});
