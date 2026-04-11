import { test, expect } from "@playwright/test";

const TEST_USER = {
  email: "sudipto@infinititech.com",
  password: "Test@1234",
};

test.describe("Search Engine", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email address").fill(TEST_USER.email);
    await page.getByLabel("Password").fill(TEST_USER.password);
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("**/dashboard", { timeout: 10000 });
  });

  test("search page renders with all type tabs", async ({ page }) => {
    await page.goto("/search");
    await expect(page.getByRole("heading", { name: "Search" })).toBeVisible();

    // All search type tabs
    await expect(page.getByRole("button", { name: "Name", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Email", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Phone", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Username", exact: true })).toBeVisible();
  });

  test("search returns results for famous developer name", async ({ page }) => {
    await page.goto("/search");
    await page.getByPlaceholder(/john doe/i).fill("Linus Torvalds");
    await page.getByRole("button", { name: "Search", exact: true }).click();

    // Wait for results (search can take 10-30s with API calls)
    await page.waitForSelector("text=/result/i", { timeout: 60000 });

    // Should have at least one result
    const results = await page.locator("text=/match/i").count();
    expect(results).toBeGreaterThan(0);
  });

  test("search shows credit usage", async ({ page }) => {
    await page.goto("/search");
    await page.getByPlaceholder(/john doe/i).fill("Test User");
    await page.getByRole("button", { name: "Search", exact: true }).click();

    // Wait for results section
    await page.waitForSelector("text=/credits used/i", { timeout: 60000 });
    await expect(page.getByText(/credits used/i)).toBeVisible();
  });

  test("clicking a search result navigates to profile", async ({ page }) => {
    await page.goto("/search");
    await page.getByPlaceholder(/john doe/i).fill("Linus Torvalds");
    await page.getByRole("button", { name: "Search", exact: true }).click();

    // Wait for results
    await page.waitForSelector("a:has-text('View Profile')", { timeout: 60000 });

    // Click first profile link
    await page.locator("a:has-text('View Profile')").first().click();

    // Should be on profile page
    await page.waitForURL(/\/profile\//);
    await expect(page.locator("text=/contact information/i")).toBeVisible({ timeout: 10000 });
  });

  test("empty search query is rejected", async ({ page }) => {
    await page.goto("/search");
    const searchBtn = page.getByRole("button", { name: "Search", exact: true });
    await expect(searchBtn).toBeDisabled();
  });
});
