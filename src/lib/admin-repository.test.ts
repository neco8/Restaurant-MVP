import { findAdminByEmail } from "./admin-repository";

test("findAdminByEmail returns admin when one exists with that email", async () => {
  const expectedAdmin = {
    id: "1",
    email: "admin@test.com",
    passwordHash: "hashed",
  };

  const mockPrisma = {
    admin: {
      findUnique: vi.fn().mockResolvedValue(expectedAdmin),
    },
  };

  const result = await findAdminByEmail(mockPrisma, "admin@test.com");

  expect(mockPrisma.admin.findUnique).toHaveBeenCalledWith({
    where: { email: "admin@test.com" },
  });
  expect(result).toEqual(expectedAdmin);
});
