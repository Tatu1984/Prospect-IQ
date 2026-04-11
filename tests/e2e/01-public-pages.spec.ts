import { test, expect } from "@playwright/test";

test.describe("Public Pages", () => {
  test("landing page loads with all key elements", async ({ page }) => {
    await page.goto("/");

    // Hero
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Nav buttons
    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
    await expect(page.getByRole("link", { name: /get started free/i }).first()).toBeVisible();

    // Sections
    await expect(page.locator("#features")).toBeVisible();
    await expect(page.locator("#pricing")).toBeVisible();
    await expect(page.locator("#api")).toBeVisible();

    // Pricing plans
    await expect(page.getByText("Free", { exact: true })).toBeVisible();
    await expect(page.getByText("Professional", { exact: true })).toBeVisible();
    await expect(page.getByText("Enterprise", { exact: true })).toBeVisible();
  });

  test("login page renders all auth options", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /continue with google/i })).toBeVisible();
    await expect(page.getByLabel("Email address")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });

  test("register page renders form with purpose selector", async ({ page }) => {
    await page.goto("/register");

    await expect(page.getByRole("heading", { name: /create your account/i })).toBeVisible();
    await expect(page.getByLabel("Full name")).toBeVisible();
    await expect(page.getByLabel("Email address")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByLabel(/how will you use/i)).toBeVisible();
  });

  test("opt-out page renders form", async ({ page }) => {
    await page.goto("/opt-out");

    await expect(page.getByRole("heading", { name: /data removal request/i })).toBeVisible();
    await expect(page.getByLabel("Full Name")).toBeVisible();
    await expect(page.getByLabel("Email Address")).toBeVisible();
    await expect(page.getByRole("button", { name: /submit removal request/i })).toBeVisible();
  });
});
