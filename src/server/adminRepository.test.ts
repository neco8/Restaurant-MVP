import { defaultAdminRepository } from "./adminRepository";

vi.mock("./prismaClient", () => ({
  prisma: {
    admin: {
      findUnique: vi.fn(),
    },
  },
}));

describe("defaultAdminRepository", () => {
  test("returns an AdminRepository with findByEmail method", () => {
    const repository = defaultAdminRepository();
    expect(repository).toHaveProperty("findByEmail");
    expect(typeof repository.findByEmail).toBe("function");
  });

  describe("when DEMO_MODE is true", () => {
    beforeEach(() => {
      process.env.DEMO_MODE = "true";
    });

    afterEach(() => {
      delete process.env.DEMO_MODE;
    });

    test("returns a working repository without database", async () => {
      const repository = defaultAdminRepository();
      const admin = await repository.findByEmail("test@example.com");
      expect(admin).toBeNull();
    });
  });
});
