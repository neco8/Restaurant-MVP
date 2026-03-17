import { createInMemoryAdminRepository } from "./inMemoryAdminRepository";

test("findByEmail returns admin when found", async () => {
  const repository = createInMemoryAdminRepository([
    { id: "admin-1", email: "admin@test.com" },
  ]);
  const admin = await repository.findByEmail("admin@test.com");
  expect(admin).toEqual({ id: "admin-1", email: "admin@test.com" });
});

test("findByEmail returns null when not found", async () => {
  const repository = createInMemoryAdminRepository([]);
  const admin = await repository.findByEmail("unknown@test.com");
  expect(admin).toBeNull();
});
