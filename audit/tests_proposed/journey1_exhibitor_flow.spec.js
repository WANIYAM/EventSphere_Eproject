import { test, expect } from "@playwright/test";

/**
 * Critical Journey 1:
 * Exhibitor registers -> applies to an expo -> admin approves application -> exhibitor reserves a booth.
 */
test.describe("Journey 1: Exhibitor Onboarding, Application & Booth Reservation", () => {
  const timestamp = Date.now();
  const exhibitorEmail = `exhibitor_${timestamp}@testcorp.com`;
  const companyName = `Quantum Dynamics ${timestamp}`;
  const password = "Password123!";

  test("Complete end-to-end journey from registration to booth reservation", async ({ page, browser }) => {
    // -------------------------------------------------------------
    // Step 1: Exhibitor Registration
    // -------------------------------------------------------------
    await page.goto("http://localhost:5173/register");
    await expect(page).toHaveTitle(/client|EventSphere/i);

    // Fill registration form
    await page.fill('input[name="name"]', "Dr. Alex Vance");
    await page.fill('input[name="email"]', exhibitorEmail);
    await page.fill('input[name="phone"]', "+1-555-0199");
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);

    // Select Exhibitor Role
    const exhibitorRoleBtn = page.locator("button", { hasText: /Exhibitor Pass/i });
    await exhibitorRoleBtn.click();

    // Fill Company Name (required for exhibitor)
    await page.fill('input[name="company"]', companyName);

    // Submit registration
    await page.click('button[type="submit"]');

    // Should redirect to Exhibitor Dashboard or Expos page
    await page.waitForURL(/.*(\/exhibitor|\/exhibitor\/expos)/, { timeout: 10000 });
    await expect(page.locator("body")).toContainText(new RegExp(companyName, "i"));

    // -------------------------------------------------------------
    // Step 2: Apply to an Active Expo
    // -------------------------------------------------------------
    await page.goto("http://localhost:5173/exhibitor/expos");
    await page.waitForSelector(".expo-card, [data-testid='expo-card'], div:has-text('EXPO')");

    // Click 'Apply to Exhibit' on the first available expo
    const applyButton = page.locator("button:has-text('Apply to Exhibit'), a:has-text('Apply to Exhibit')").first();
    await applyButton.click();

    // Fill Application Modal Form
    await page.fill('input[name="companyName"], input[placeholder*="Company"]', companyName);
    await page.fill('textarea[name="products"], textarea[placeholder*="Products"]', "Next-Gen AI Hardware & Quantum Sensors");

    // Submit Application
    await page.click("button:has-text('Submit Application')");
    await expect(page.locator("body")).toContainText(/Application submitted|Pending/i);

    // -------------------------------------------------------------
    // Step 3: Admin logs in and approves application in a second session
    // -------------------------------------------------------------
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();

    await adminPage.goto("http://localhost:5173/login");
    await adminPage.fill('input[name="email"]', "admin@eventsphere.com");
    await adminPage.fill('input[name="password"]', "Admin@123");
    await adminPage.click('button[type="submit"]');
    await adminPage.waitForURL(/.*\/admin/, { timeout: 10000 });

    // Navigate to Applications Management
    await adminPage.goto("http://localhost:5173/admin/applications");
    await adminPage.waitForSelector("table, div:has-text('APPLICATIONS')");

    // Locate the newly submitted application row
    const appRow = adminPage.locator(`tr:has-text('${companyName}'), div:has-text('${companyName}')`).first();
    await expect(appRow).toBeVisible();

    // Click Approve
    const approveBtn = appRow.locator("button:has-text('Approve')");
    adminPage.on("dialog", (dialog) => dialog.accept());
    await approveBtn.click();

    await expect(appRow).toContainText(/approved/i);
    await adminContext.close();

    // -------------------------------------------------------------
    // Step 4: Exhibitor views floor plan and reserves an available booth
    // -------------------------------------------------------------
    await page.goto("http://localhost:5173/exhibitor/booths");
    await page.waitForSelector("div:has-text('Floor Plan'), .booth-grid");

    // Find the first available booth card
    const availableBooth = page.locator("button:has-text('available'), div:has-text('available')").first();
    await expect(availableBooth).toBeVisible();

    // Reserve booth
    page.on("dialog", (dialog) => dialog.accept());
    await availableBooth.click();

    // Confirm reservation feedback
    await expect(page.locator("body")).toContainText(/reserved successfully|waiting for admin confirmation/i);
  });
});
