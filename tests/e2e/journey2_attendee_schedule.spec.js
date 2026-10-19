import { test, expect } from "@playwright/test";

/**
 * Critical Journey 2:
 * Attendee registers -> browses expo schedule -> bookmarks a session -> receives notification reminder.
 */
test.describe("Journey 2: Attendee Registration, Schedule Exploration & Session Bookmarking", () => {
  const timestamp = Date.now();
  const attendeeEmail = `attendee_${timestamp}@domain.com`;
  const attendeeName = `Marcus Brody ${timestamp}`;
  const password = "Password123!";

  test("Attendee account creation, schedule bookmarking and timetable verification", async ({ page }) => {
    // -------------------------------------------------------------
    // Step 1: Attendee Registration
    // -------------------------------------------------------------
    await page.goto("http://localhost:5173/register");

    await page.fill('input[name="name"]', attendeeName);
    await page.fill('input[name="email"]', attendeeEmail);
    await page.fill('input[name="phone"]', "+1-555-4422");
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);

    // Ensure Attendee Pass is selected
    const attendeeRoleBtn = page.locator("button:has-text('Attendee Pass')");
    await attendeeRoleBtn.click();

    await page.click('button[type="submit"]');
    await page.waitForURL("http://localhost:5173/", { timeout: 10000 });

    // -------------------------------------------------------------
    // Step 2: Browse Active Expos and View Schedule Tab
    // -------------------------------------------------------------
    await page.goto("http://localhost:5173/expos");
    await page.waitForSelector(".expo-card, div:has-text('EXPO')");

    // Open first expo details
    const viewExpoLink = page.locator("a:has-text('Explore Expo'), a:has-text('View Expo')").first();
    await viewExpoLink.click();
    await page.waitForURL(/.*\/expos\/.+/, { timeout: 8000 });

    // Register for the Expo
    const registerExpoBtn = page.locator("button:has-text('Register for Expo'), button:has-text('Join Expo')");
    if (await registerExpoBtn.isVisible()) {
      await registerExpoBtn.click();
      await expect(page.locator("body")).toContainText(/Registered|Confirmed/i);
    }

    // Switch to Schedule Tab
    const scheduleTab = page.locator("button:has-text('Schedule'), [role='tab']:has-text('Schedule')");
    await scheduleTab.click();

    // -------------------------------------------------------------
    // Step 3: Bookmark a Session
    // -------------------------------------------------------------
    const firstSessionCard = page.locator("div:has-text('Keynote'), div:has-text('Session'), .session-card").first();
    await expect(firstSessionCard).toBeVisible();

    // Capture session title
    const sessionTitle = await firstSessionCard.locator("h3, h4, strong").first().innerText();

    // Click Bookmark button
    const bookmarkBtn = firstSessionCard.locator("button:has-text('Bookmark'), button:has([aria-label*='bookmark'])").first();
    await bookmarkBtn.click();

    // Feedback confirms bookmarked
    await expect(firstSessionCard).toContainText(/Bookmarked|★|Saved/i);

    // -------------------------------------------------------------
    // Step 4: Verify Appearance in My Schedule / Timetable
    // -------------------------------------------------------------
    await page.goto("http://localhost:5173/schedule");
    await page.waitForSelector("div:has-text('TIMETABLE'), div:has-text('Bookmarked')");

    // Confirm bookmarked session appears in attendee's timetable
    await expect(page.locator("body")).toContainText(sessionTitle);

    // -------------------------------------------------------------
    // Step 5: Verify Notification Bell
    // -------------------------------------------------------------
    const bell = page.locator(".notification-bell, [data-testid='notification-bell']");
    await expect(bell).toBeVisible();
    await bell.click();

    // Notification dropdown displays
    await expect(page.locator(".notification-dropdown, div:has-text('Notifications')")).toBeVisible();
  });
});
