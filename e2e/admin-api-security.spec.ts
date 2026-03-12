import { test, expect, request as playwrightRequest } from "@playwright/test";

test.describe("Admin API Security", () => {
  test("GET /api/admin/products returns 401 without session cookie", async ({
    request,
  }) => {
    const response = await request.get("/api/admin/products");

    expect(response.status()).toBe(401);
  });

  test("GET /api/admin/products returns 403 for unregistered email", async () => {
    const context = await playwrightRequest.newContext({
      baseURL: "http://localhost:3000",
      extraHTTPHeaders: {
        cookie: "session=unregistered-user@test.local",
      },
    });

    const response = await context.get("/api/admin/products");

    expect(response.status()).toBe(403);

    await context.dispose();
  });

  test("GET /api/admin/orders returns 401 without session cookie", async ({
    request,
  }) => {
    const response = await request.get("/api/admin/orders");

    expect(response.status()).toBe(401);
  });

  test("PUT /api/admin/orders/non-existent returns 401 without session cookie", async ({
    request,
  }) => {
    const response = await request.put("/api/admin/orders/non-existent", {
      data: { status: "COMPLETED" },
    });

    expect(response.status()).toBe(401);
  });
});
