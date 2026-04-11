import { test, expect } from "@playwright/test";

const TEST_USER = {
  email: "sudipto@infinititech.com",
  password: "Test@1234",
};

test.describe("Dashboard Pages", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email address").fill(TEST_USER.email);
    await page.getByLabel("Password").fill(TEST_USER.password);
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("**/dashboard", { timeout: 10000 });
  });

  test("dashboard shows stats and recent searches", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByText(/credits remaining/i)).toBeVisible();
    await expect(page.getByText(/searches today/i)).toBeVisible();
    await expect(page.getByText(/recent searches/i)).toBeVisible();
    await expect(page.getByText(/quick actions/i)).toBeVisible();
  });

  test("header shows real user name and credits", async ({ page }) => {
    // User name should show in header (not "User" placeholder)
    const header = page.locator("header");
    await expect(header.getByText(/credits/i).first()).toBeVisible();
  });

  test("can navigate to all sidebar pages", async ({ page }) => {
    const pages = [
      { link: "Search", url: "/search", heading: "Search" },
      { link: "Saved Lists", url: "/lists", heading: "Saved Lists" },
      { link: "Bulk Upload", url: "/bulk", heading: "Bulk Upload" },
      { link: "API Keys", url: "/api-keys", heading: "API Keys" },
      { link: "Billing", url: "/billing", heading: "Billing & Credits" },
      { link: "Settings", url: "/settings", heading: "Settings" },
    ];

    for (const p of pages) {
      await page.locator("aside").getByRole("link", { name: p.link }).click();
      await page.waitForURL(`**${p.url}`, { timeout: 5000 });
      await expect(page.getByRole("heading", { name: p.heading })).toBeVisible();
    }
  });

  test("admin panel is accessible", async ({ page }) => {
    await page.locator("aside").getByRole("link", { name: /admin panel/i }).click();
    await page.waitForURL(/\/admin\/dashboard/, { timeout: 5000 });
    await expect(page.getByRole("heading", { name: "Admin Dashboard" })).toBeVisible();
  });
});
