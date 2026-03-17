import { defaultAdminRepository } from "./adminRepository";

vi.mock("./prismaClient", () => ({
  prisma: {
    admin: {
      findUnique: vi.fn(),
    },
  },
}));

test("returns an AdminRepository with findByEmail method", () => {
  const repository = defaultAdminRepository();
  expect(repository).toHaveProperty("findByEmail");
  expect(typeof repository.findByEmail).toBe("function");
});
