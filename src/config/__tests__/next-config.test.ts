describe("next.config pageExtensions", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  async function loadConfig() {
    const mod = await import("../../../next.config.mjs");
    return mod.default;
  }

  test("does not include demo extensions when DEMO_MODE is not set", async () => {
    vi.stubEnv("DEMO_MODE", "");

    const config = await loadConfig();

    const extensions = config.pageExtensions ?? ["tsx", "ts", "jsx", "js"];
    expect(extensions).not.toContain("demo.ts");
    expect(extensions).not.toContain("demo.tsx");
  });

  test("includes demo extensions when DEMO_MODE is true", async () => {
    vi.stubEnv("DEMO_MODE", "true");

    const config = await loadConfig();

    expect(config.pageExtensions).toContain("demo.ts");
    expect(config.pageExtensions).toContain("demo.tsx");
    // Should also include standard extensions
    expect(config.pageExtensions).toContain("ts");
    expect(config.pageExtensions).toContain("tsx");
  });
});
