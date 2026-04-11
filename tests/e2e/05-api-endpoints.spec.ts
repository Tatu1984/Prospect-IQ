import { test, expect, request } from "@playwright/test";

const TEST_USER = {
  email: "sudipto@infinititech.com",
  password: "Test@1234",
};

test.describe("API Endpoints", () => {
  test("POST /api/search rejects unauthenticated requests", async ({ request }) => {
    const res = await request.post("/api/search", {
      data: { query: "test", type: "name" },
    });
    expect(res.status()).toBe(401);
  });

  test("GET /api/profiles/:id rejects unauthenticated requests", async ({ request }) => {
    const res = await request.get("/api/profiles/test-id");
    expect(res.status()).toBe(401);
  });

  test("POST /api/register validates input", async ({ request }) => {
    // Missing fields
    const res1 = await request.post("/api/register", {
      data: { email: "test@test.com" },
    });
    expect(res1.status()).toBe(400);

    // Short password
    const res2 = await request.post("/api/register", {
      data: { name: "Test", email: `t${Date.now()}@test.com`, password: "123" },
    });
    expect(res2.status()).toBe(400);
    const body2 = await res2.json();
    expect(body2.error).toMatch(/8 characters/i);
  });

  test("POST /api/register prevents duplicate email", async ({ request }) => {
    const res = await request.post("/api/register", {
      data: {
        name: "Duplicate",
        email: TEST_USER.email,
        password: "Password123!",
      },
    });
    expect(res.status()).toBe(409);
  });

  test("auth endpoints respond correctly", async ({ request }) => {
    const csrfRes = await request.get("/api/auth/csrf");
    expect(csrfRes.ok()).toBe(true);
    const csrf = await csrfRes.json();
    expect(csrf.csrfToken).toBeDefined();

    const sessionRes = await request.get("/api/auth/session");
    expect(sessionRes.ok()).toBe(true);

    const providersRes = await request.get("/api/auth/providers");
    expect(providersRes.ok()).toBe(true);
    const providers = await providersRes.json();
    expect(providers.google).toBeDefined();
    expect(providers.credentials).toBeDefined();
  });

  test("authenticated search returns results", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Login via browser to get session cookie
    await page.goto("/login");
    await page.getByLabel("Email address").fill(TEST_USER.email);
    await page.getByLabel("Password").fill(TEST_USER.password);
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("**/dashboard", { timeout: 10000 });

    // Make API call with same context
    const apiContext = await request.newContext({
      storageState: await context.storageState(),
      baseURL: "http://localhost:3000",
    });

    const res = await apiContext.post("/api/search", {
      data: { query: "Linus Torvalds", type: "name" },
      timeout: 60000,
    });
    expect(res.ok()).toBe(true);

    const data = await res.json();
    expect(Array.isArray(data.results)).toBe(true);
    expect(data.creditsUsed).toBeGreaterThan(0);
    expect(data.searchId).toBeDefined();

    await context.close();
  });
});
