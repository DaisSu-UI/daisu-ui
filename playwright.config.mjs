import { chromium, defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";
const detectedExecutable =
  process.env.DAISU_DOCS_CHROME_EXECUTABLE ||
  [
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/opt/google/chrome/chrome",
  ].find((path) => existsSync(path));
const executablePath =
  process.env.DAISU_DOCS_CHROME_EXECUTABLE ||
  (process.env.CI && existsSync(chromium.executablePath())
    ? undefined
    : detectedExecutable);
const port = process.env.DAISU_DOCS_TEST_PORT || "3094";
const basePath = process.env.DAISU_DOCS_BASE_PATH || "/";
const baseURL = `http://127.0.0.1:${port}${basePath}`;
export default defineConfig({
  testDir: "./apps/docs/e2e",
  testMatch: "**/*.spec.mjs",
  timeout: 45000,
  fullyParallel: true,
  workers: 2,
  retries: process.env.CI ? 1 : 0,
  outputDir: "artifacts/docs-browser-results",
  reporter: [
    ["list"],
    ...(process.env.CI ? [["github"]] : []),
    ["html", { outputFolder: "artifacts/docs-browser-report", open: "never" }],
  ],
  use: {
    baseURL,
    launchOptions: { executablePath },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
  ],
  webServer: {
    command: "node apps/docs/serve.mjs",
    url: baseURL,
    reuseExistingServer: false,
    env: {
      DAISU_DOCS_HOST: "127.0.0.1",
      DAISU_DOCS_PORT: port,
      DAISU_DOCS_BASE_PATH: basePath,
    },
  },
});
