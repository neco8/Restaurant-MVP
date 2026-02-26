import { defineConfig, devices } from "@playwright/test";

function proxyConfig() {
  const proxyUrl =
    process.env.GLOBAL_AGENT_HTTP_PROXY ||
    process.env.https_proxy ||
    process.env.HTTPS_PROXY;
  if (!proxyUrl) return {};

  const url = new URL(proxyUrl);
  return {
    proxy: {
      server: `${url.protocol}//${url.host}`,
      bypass: "localhost,127.0.0.1",
      ...(url.username ? { username: decodeURIComponent(url.username) } : {}),
      ...(url.password ? { password: decodeURIComponent(url.password) } : {}),
    },
  };
}

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  timeout: 60_000,
  expect: {
    timeout: 30_000,
  },
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    ignoreHTTPSErrors: true,
    ...proxyConfig(),
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run build && npm start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
