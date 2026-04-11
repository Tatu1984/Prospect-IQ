import { test, expect } from "@playwright/test";

const TEST_USER = {
  name: "Sudipto",
  email: "sudipto@infinititech.com",
  password: "Test@1234",
};

test.describe("Authentication Flow", () => {
  test("dashboard redirects to login when not authenticated", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL(/\/login/);
    expect(page.url()).toContain("/login");
  });

  test("can login with email and password", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email address").fill(TEST_USER.email);
    await page.getByLabel("Password").fill(TEST_USER.password);
    await page.getByRole("button", { name: "Sign in" }).click();

    // Should redirect to dashboard
    await page.waitForURL("**/dashboard", { timeout: 10000 });
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  });

  test("login fails with wrong password", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email address").fill(TEST_USER.email);
    await page.getByLabel("Password").fill("WrongPassword123");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText(/invalid email or password/i)).toBeVisible({ timeout: 10000 });
  });

  test("can register new account and auto-login", async ({ page }) => {
    const uniqueEmail = `test${Date.now()}@example.com`;

    await page.goto("/register");
    await page.getByLabel("Full name").fill("Test User");
    await page.getByLabel("Email address").fill(uniqueEmail);
    await page.getByLabel("Password").fill("Password123!");
    await page.locator("#purpose").selectOption("sales");
    await page.locator("#terms").check();
    await page.getByRole("button", { name: "Create account" }).click();

    // Should land on dashboard
    await page.waitForURL("**/dashboard", { timeout: 10000 });
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  });

  test("register fails with duplicate email", async ({ page }) => {
    await page.goto("/register");
    await page.getByLabel("Full name").fill("Duplicate Test");
    await page.getByLabel("Email address").fill(TEST_USER.email);
    await page.getByLabel("Password").fill("Password123!");
    await page.locator("#purpose").selectOption("sales");
    await page.locator("#terms").check();
    await page.getByRole("button", { name: "Create account" }).click();

    await expect(page.getByText(/account with this email already exists/i)).toBeVisible({ timeout: 10000 });
  });

  test("register fails with short password", async ({ page }) => {
    await page.goto("/register");
    await page.getByLabel("Full name").fill("Short Pass");
    await page.getByLabel("Email address").fill(`shortpass${Date.now()}@example.com`);
    await page.getByLabel("Password").fill("123");
    // HTML5 minLength=8 should block this
    const submitBtn = page.getByRole("button", { name: "Create account" });
    // Check that the password field is invalid
    const passwordValid = await page.getByLabel("Password").evaluate((el: HTMLInputElement) => el.checkValidity());
    expect(passwordValid).toBe(false);
  });

  test("can logout from dashboard", async ({ page }) => {
    // Login first
    await page.goto("/login");
    await page.getByLabel("Email address").fill(TEST_USER.email);
    await page.getByLabel("Password").fill(TEST_USER.password);
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("**/dashboard", { timeout: 10000 });

    // Open user menu and click sign out
    await page.locator("header").getByRole("button").last().click();
    await page.getByRole("button", { name: /sign out/i }).click();

    // Should redirect to login
    await page.waitForURL(/\/login/, { timeout: 10000 });
  });
});
