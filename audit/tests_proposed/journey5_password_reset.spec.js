import { test, expect } from "@playwright/test";

/**
 * Critical Journey 5:
 * Forgot password request -> token generation -> password reset execution -> login with new password.
 */
test.describe("Journey 5: Self-Service Password Recovery & Re-Authentication", () => {
  const timestamp = Date.now();
  const resetEmail = `recover_${timestamp}@eventsphere.com`;
  const initialPassword = "OldPassword123!";
  const updatedPassword = "NewPassword456!@#";

  test("End-to-end user registration, password reset trigger, token consumption, and login verification", async ({ page, request }) => {
    // -------------------------------------------------------------
    // Step 1: Pre-create User for Password Recovery
    // -------------------------------------------------------------
    const regRes = await request.post("http://localhost:5000/api/auth/register", {
      data: {
        name: "Recovery Test User",
        email: resetEmail,
        password: initialPassword,
        role: "attendee"
      }
    });
    expect(regRes.status()).toBe(201);

    // -------------------------------------------------------------
    // Step 2: Trigger Forgot Password Flow
    // -------------------------------------------------------------
    await page.goto("http://localhost:5173/forgot-password");
    await page.fill('input[type="email"]', resetEmail);
    await page.click("button:has-text('Generate Reset Link'), button[type='submit']");

    // In current implementation, demo mode renders link directly on page
    const resetLinkAnchor = page.locator("a[href*='/reset-password/']");
    await expect(resetLinkAnchor).toBeVisible({ timeout: 8000 });

    const resetHref = await resetLinkAnchor.getAttribute("href");
    expect(resetHref).toContain("/reset-password/");

    // -------------------------------------------------------------
    // Step 3: Navigate to Password Reset Page & Set New Password
    // -------------------------------------------------------------
    await page.goto(resetHref);
    await page.waitForSelector("div:has-text('RESET YOUR PASSWORD'), div:has-text('NEW PASS')");

    await page.fill('input[placeholder*="new password" i], input[type="password"]', updatedPassword);
    const confirmInput = page.locator('input[placeholder*="confirm" i]').first();
    if (await confirmInput.isVisible()) {
      await confirmInput.fill(updatedPassword);
    }

    await page.click("button:has-text('Reset Password'), button[type='submit']");
    await expect(page.locator("body")).toContainText(/Password reset successful|Redirecting/i);

    // -------------------------------------------------------------
    // Step 4: Login with Old Password Must Fail
    // -------------------------------------------------------------
    await page.goto("http://localhost:5173/login");
    await page.fill('input[name="email"]', resetEmail);
    await page.fill('input[name="password"]', initialPassword);
    await page.click('button[type="submit"]');

    await expect(page.locator("body")).toContainText(/Invalid email or password/i);

    // -------------------------------------------------------------
    // Step 5: Login with New Password Must Succeed
    // -------------------------------------------------------------
    await page.fill('input[name="password"]', updatedPassword);
    await page.click('button[type="submit"]');

    await page.waitForURL("http://localhost:5173/", { timeout: 10000 });
    await expect(page.locator("body")).toContainText(/Recovery Test User|Attendee/i);
  });
});
