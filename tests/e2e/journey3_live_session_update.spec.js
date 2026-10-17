import { test, expect } from "@playwright/test";

/**
 * Critical Journey 3:
 * Admin edits a session time -> Attendee viewing the expo schedule sees the change live without page reload (Socket.IO).
 */
test.describe("Journey 3: Real-Time Schedule Update Synchronization via WebSockets", () => {
  test("Live Socket.IO propagation of session time edit between Admin and Attendee browsers", async ({ browser }) => {
    // -------------------------------------------------------------
    // Context A: Attendee Browser Session
    // -------------------------------------------------------------
    const attendeeContext = await browser.newContext();
    const attendeePage = await attendeeContext.newPage();

    // Attendee navigates to public Expo details schedule tab
    await attendeePage.goto("http://localhost:5173/expos");
    const firstExpo = attendeePage.locator("a:has-text('Explore Expo'), a:has-text('View Expo')").first();
    await firstExpo.click();
    await attendeePage.waitForURL(/.*\/expos\/.+/, { timeout: 8000 });

    const scheduleTab = attendeePage.locator("button:has-text('Schedule'), [role='tab']:has-text('Schedule')");
    await scheduleTab.click();

    // Verify session list is loaded
    const initialSession = attendeePage.locator("div:has-text('Speaker'), .session-card").first();
    await expect(initialSession).toBeVisible();

    // -------------------------------------------------------------
    // Context B: Admin Browser Session
    // -------------------------------------------------------------
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();

    await adminPage.goto("http://localhost:5173/login");
    await adminPage.fill('input[name="email"]', "admin@eventsphere.com");
    await adminPage.fill('input[name="password"]', "Admin@123");
    await adminPage.click('button[type="submit"]');
    await adminPage.waitForURL(/.*\/admin/, { timeout: 10000 });

    // Admin navigates to Session Management for the same expo
    await adminPage.goto("http://localhost:5173/admin/expos");
    const manageSessionsLink = adminPage.locator("a:has-text('Sessions'), button:has-text('Sessions')").first();
    await manageSessionsLink.click();
    await adminPage.waitForURL(/.*\/admin\/expos\/.+\/sessions/, { timeout: 8000 });

    // Admin edits the first session title with a unique live marker
    const updatedTitleMarker = `LIVE UPDATE ${Date.now()}`;
    const editBtn = adminPage.locator("button:has-text('Edit')").first();
    await editBtn.click();

    const titleInput = adminPage.locator('input[name="title"], input[placeholder*="Title"]');
    await titleInput.fill(updatedTitleMarker);

    // Save changes (triggers server PUT /api/sessions/:id and emitToAll("schedule:updated"))
    const saveBtn = adminPage.locator("button:has-text('Save'), button:has-text('Update')");
    await saveBtn.click();
    await expect(adminPage.locator("body")).toContainText(updatedTitleMarker);

    // -------------------------------------------------------------
    // Verification: Attendee Page receives socket event WITHOUT refreshing
    // -------------------------------------------------------------
    // Verify attendeePage displays updatedTitleMarker without calling attendeePage.reload()!
    await expect(attendeePage.locator("body")).toContainText(updatedTitleMarker, { timeout: 8000 });

    // Clean up sessions
    await adminContext.close();
    await attendeeContext.close();
  });
});
