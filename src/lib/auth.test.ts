import { verifyAdminCredentials } from "./auth";
import { findAdminByEmail } from "@/lib/admin-repository";

vi.mock("@/lib/admin-repository", () => ({
  findAdminByEmail: vi.fn(),
}));

const mockFindAdminByEmail = findAdminByEmail as ReturnType<typeof vi.fn>;

test("returns false when no admin exists with that email", async () => {
  mockFindAdminByEmail.mockResolvedValue(null);

  const result = await verifyAdminCredentials(
    "nonexistent@example.com",
    "any-password"
  );

  expect(result).toBe(false);
  expect(mockFindAdminByEmail).toHaveBeenCalledWith("nonexistent@example.com");
});
