import { createPrismaAdminRepository } from "./prismaAdminRepository";

test("findByEmail returns admin when found", async () => {
  const mockFindUnique = vi.fn().mockResolvedValue({
    id: "admin-1",
    email: "admin@test.com",
    passwordHash: "",
    createdAt: new Date(),
  });
  const mockPrisma = { admin: { findUnique: mockFindUnique } };
  const repository = createPrismaAdminRepository(mockPrisma);
  const admin = await repository.findByEmail("admin@test.com");
  expect(admin).toEqual({ id: "admin-1", email: "admin@test.com" });
  expect(mockFindUnique).toHaveBeenCalledWith({
    where: { email: "admin@test.com" },
  });
});

test("findByEmail returns null when admin not found", async () => {
  const mockPrisma = {
    admin: { findUnique: vi.fn().mockResolvedValue(null) },
  };
  const repository = createPrismaAdminRepository(mockPrisma);
  const admin = await repository.findByEmail("unknown@test.com");
  expect(admin).toBeNull();
});
