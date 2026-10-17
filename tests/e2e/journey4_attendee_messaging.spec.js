import { test, expect } from "@playwright/test";

/**
 * Critical Journey 4:
 * Attendee searches exhibitors by keyword/category -> opens exhibitor profile -> sends message -> exhibitor receives live socket notification.
 */
test.describe("Journey 4: Exhibitor Discovery & Real-Time Peer Messaging", () => {
  test("Attendee searches directory and initiates direct chat with live exhibitor socket receipt", async ({ browser }) => {
    // -------------------------------------------------------------
    // Context A: Exhibitor Session (Recipient)
    // -------------------------------------------------------------
    const exhibitorContext = await browser.newContext();
    const exhibitorPage = await exhibitorContext.newPage();

    // Log in as pre-seeded demo exhibitor
    await exhibitorPage.goto("http://localhost:5173/login");
    await exhibitorPage.fill('input[name="email"]', "exhibitor@eventsphere.com");
    await exhibitorPage.fill('input[name="password"]', "Demo@123");
    await exhibitorPage.click('button[type="submit"]');
    await exhibitorPage.waitForURL(/.*\/exhibitor/, { timeout: 10000 });

    // Open messages inbox
    await exhibitorPage.goto("http://localhost:5173/messages");
    await exhibitorPage.waitForSelector("div:has-text('INBOX'), div:has-text('Messages')");

    // -------------------------------------------------------------
    // Context B: Attendee Session (Sender)
    // -------------------------------------------------------------
    const attendeeContext = await browser.newContext();
    const attendeePage = await attendeeContext.newPage();

    // Log in as pre-seeded demo attendee
    await attendeePage.goto("http://localhost:5173/login");
    await attendeePage.fill('input[name="email"]', "attendee@eventsphere.com");
    await attendeePage.fill('input[name="password"]', "Demo@123");
    await attendeePage.click('button[type="submit"]');
    await attendeePage.waitForURL("http://localhost:5173/", { timeout: 10000 });

    // Attendee navigates to Exhibitors Directory
    await attendeePage.goto("http://localhost:5173/exhibitors");
    await attendeePage.waitForSelector("input[placeholder*='Search'], input[placeholder*='filter']");

    // Search for an exhibitor
    const searchInput = attendeePage.locator("input[placeholder*='Search'], input[placeholder*='filter']").first();
    await searchInput.fill("Tech");

    // Click on the first matching exhibitor card
    const exhibitorCard = attendeePage.locator(".exhibitor-card, a:has-text('View Profile'), div:has-text('EXHIBITOR')").first();
    await exhibitorCard.click();
    await attendeePage.waitForURL(/.*\/exhibitors\/.+/, { timeout: 8000 });

    // Click 'Contact Partner' / 'Send Message'
    const contactBtn = attendeePage.locator("button:has-text('Contact'), button:has-text('Message')").first();
    await contactBtn.click();
    await attendeePage.waitForURL(/.*\/messages\?to=.+/, { timeout: 8000 });

    // Compose Message
    const uniqueSubject = `Product Inquiry ${Date.now()}`;
    const messageBody = "Hello, we would like to schedule a private demo at your booth during the morning session.";

    await attendeePage.fill('input[name="subject"], input[placeholder*="Subject"]', uniqueSubject);
    await attendeePage.fill('textarea[name="body"], textarea[placeholder*="Message"]', messageBody);

    // Send Message
    await attendeePage.click("button:has-text('Send Message'), button[type='submit']");
    await expect(attendeePage.locator("body")).toContainText(/Message sent|Success/i);

    // -------------------------------------------------------------
    // Verification: Exhibitor receives message via WebSocket without reload
    // -------------------------------------------------------------
    await expect(exhibitorPage.locator("body")).toContainText(uniqueSubject, { timeout: 8000 });

    // Cleanup
    await attendeeContext.close();
    await exhibitorContext.close();
  });
});
