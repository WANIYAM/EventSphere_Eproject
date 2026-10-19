# EventSphere Management - User Guide

## 1. Introduction

EventSphere Management is a full-stack MERN (MongoDB, Express, React, Node.js) web application designed for organizing, managing, and attending trade shows, expositions, and conferences. The system supports four user profiles:

1. Visitor: An unauthenticated public guest browsing upcoming expos, schedules, exhibitors, and floor plans.
2. Attendee: A registered visitor who claims event passes, registers for keynotes and workshops, bookmarks sessions into a personal timetable, receives in-app notifications and reminders, and messages exhibitors.
3. Exhibitor: A corporate partner who submits booth participation applications with compliance documents, selects and reserves floor plan booths, configures booth staff and showcase details, and communicates with event organizers.
4. Admin / Organizer: An operations lead who creates and maintains expos, generates booth grids, reviews and approves exhibitor applications, schedules speaker sessions with room conflict detection, monitors attendance analytics, and reviews user feedback.

### Opening the Application

To access EventSphere Management locally:
- Frontend Web Interface: http://localhost:5173
- Backend REST API and WebSocket Gateway: http://localhost:5000

### Demo Accounts

The database seed engine (server/seed/seedDemoData.js) initializes realistic accounts for immediate testing. All accounts use the credentials listed below:

| Role | Email Address | Password | Account Description |
| :--- | :--- | :--- | :--- |
| Admin | admin@eventsphere.com | Admin@123 | System administrator and lead event organizer |
| Exhibitor | bushbabe@demo.com | Demo@123 | Bush Babe Displays (Modular booths and RFID badges) |
| Exhibitor | wilderness@demo.com | Demo@123 | Wilder Ness Digital (Smart signage and wayfinding) |
| Exhibitor | epyc@demo.com | Demo@123 | EPYC Systems (Cloud infrastructure and servers) |
| Exhibitor | speckles@demo.com | Demo@123 | SpeckLes IoT (Smart touch surfaces and lead scanners) |
| Exhibitor | orchid@demo.com | Demo@123 | Orchid Foods Sdn Bhd (Food and beverage manufacturer) |
| Attendee | attendee1@demo.com | Demo@123 | Aisha Khan (Verified attendee pass) |
| Attendee | attendee2@demo.com | Demo@123 | Daniel Tan (Verified attendee pass) |
| Attendee | attendee3@demo.com | Demo@123 | Nur Aisyah (Verified attendee pass) |

---

## 2. Getting Started

### 2.1 User Registration

1. Navigate to the top navigation and click Register Pass.
2. Select your account type:
   - Attendee Pass: For individual attendees, delegates, and buyers.
   - Exhibitor Booth: For corporate representatives showcasing products.
3. Complete the form fields:
   - Full Name: At least 2 characters.
   - Phone Number: Contact number for registration records.
   - Email Address: A valid, unique email address used for login.
   - Exhibiting Company Name: Required only if Exhibitor Booth is selected.
   - Password: Minimum 6 characters.
   - Confirm Password: Must match password.
4. Click Create Expo Account. Upon submission, you are logged in automatically and redirected to your destination.

[Screenshot: 01-user-registration.png - Registration form with role switcher between Attendee Pass and Exhibitor Booth]

### 2.2 Logging In

1. Click Login from the navigation bar.
2. Enter your registered email address and password.
3. Optional convenience: Click one of the quick demo buttons (Admin, Exhibitor, or Attendee) to populate credentials automatically.
4. Click Access Portal.
   - Administrators are redirected to /admin.
   - Exhibitors are redirected to /exhibitor.
   - Attendees are redirected to / (or the page requested prior to login).

[Screenshot: 02-user-login.png - Login gateway with one-click demo credentials]

### 2.3 Password Recovery

1. On the login screen, click Forgot Password?.
2. Enter your registered email address and click Generate Reset Link.
3. Behavior details:
   - When the backend environment variable DEMO_MODE is set to true, the password reset link is displayed directly on the screen in a notification container to facilitate testing without an SMTP email service.
   - When DEMO_MODE is false or unset, the system returns a standard confirmation message: "If an account exists, a reset link has been generated."
   - In non-production environments, the reset link is also printed to the server terminal.
4. Click the reset link or open http://localhost:5173/reset-password/<token>.
5. Enter a new password (minimum 6 characters), confirm it, and submit. The reset token is single-use and expires after 15 minutes.

[Screenshot: 03-password-recovery.png - Password recovery interface displaying demo mode reset link]

### 2.4 Logging Out

Click the Logout button located in the top navigation bar. Your authentication token is removed from storage, real-time socket connections are disconnected, and you are redirected to the login gateway.

---

## 3. Role Tutorials

### 3.1 Visitor (Unauthenticated Guest)

Visitors can explore public trade show directories without creating an account.

#### Tutorial 1: Browsing Upcoming Expos
1. Click Expos in the navigation menu.
2. Filter expos by venue city (All Expos, Penang, Kuala Lumpur, San Francisco).
3. View the expo card displaying the theme, dates, venue, and description preview.
4. Click View Details on any card to enter the full expo dossier.

[Screenshot: 04-visitor-expos-directory.png - Public expo directory with city filter buttons]

#### Tutorial 2: Reviewing Schedules and Keynotes
1. From an expo details page (/expos/:id), select the Schedule tab.
2. Sessions are organized chronologically by day.
3. View the start time, end time, session title, track topic, speaker, and stage location.
4. Clicking Login to register directs you to the login screen and preserves your return path.

[Screenshot: 05-visitor-schedule-tab.png - Public session timetable with login prompts]

#### Tutorial 3: Exploring Exhibitors and Floor Plans
1. Click Exhibitors in the navigation menu to view all approved commercial partners across all expos.
2. Use the search input to filter by company name, products, or keywords.
3. Select an industry category pill (such as Technology, Food and Beverage, or Renewable Energy) to narrow results.
4. Click View Profile on an exhibitor card to read their company overview, website, and assigned booth numbers.
5. In the expo details view, open the Floor Plan tab to see the architectural booth grid. Colors indicate status: Kiwi Green is Available, Selective Yellow is Reserved, and Coral Red is Booked.

[Screenshot: 06-visitor-floorplan-tab.png - Interactive booth status grid with color legend]

#### Tutorial 4: Submitting Inquiries via Contact Desk
1. Click Contact in the navigation menu.
2. Unauthenticated visitors see headquarters information and an action button reading "Log in to message the organizers".
3. Click the button to log in. Once authenticated, the contact desk allows you to submit direct inquiries to event administrators.

[Screenshot: 07-visitor-contact-page.png - Contact desk prompting visitor login]

---

### 3.2 Attendee Workflows

#### Tutorial 1: Claiming an Expo Pass
1. Log in with an attendee account (e.g., attendee1@demo.com / Demo@123).
2. Open any upcoming expo from the directory.
3. In the hero banner, click Register For Expo.
4. A confirmation toast displays "Successfully registered for this Expo!", and the button changes to "Registration Confirmed" alongside a "Cancel Registration" option.
5. If the expo end date has passed, the button displays "Ended" and registration is disabled.

[Screenshot: 08-attendee-expo-registered.png - Expo details page showing confirmed registration pass]

#### Tutorial 2: Registering for and Bookmarking Keynote Sessions
1. Navigate to the Schedule tab of an expo where you hold a pass.
2. To claim a seat in a session, click + Register.
   - The button updates immediately to Cancel Registration.
   - If the new session overlaps in time with an existing registered session in your timetable, registration succeeds and a warning toast displays: "This session overlaps with <Title>".
3. To bookmark a session without registering, click Bookmark. The button toggles to Bookmarked.
4. Sessions whose end time has elapsed display an "Ended" badge and cannot be registered or bookmarked.

[Screenshot: 09-attendee-session-actions.png - Session item displaying registered status and bookmark toggle]

#### Tutorial 3: Managing Your Personal Timetable (My Schedule)
1. Click My Schedule in the top navigation bar (URL: /schedule).
2. Review your personal itinerary split into three distinct modules:
   - Registered Expos: Active expo passes with links to floor plans and a Cancel button.
   - Registered Sessions: Keynotes and workshops sorted by start time.
   - Bookmarked Sessions: Tracked presentations with a Bookmarked toggle.
3. Click Cancel on any item to release your registration immediately.
4. If an admin deletes a session that you previously registered for, the page safely filters it out and offers a "Removed or Inactive Items" panel allowing you to clear orphaned records.

[Screenshot: 10-attendee-my-schedule.png - Personal timetable page displaying registered expos and sessions]

#### Tutorial 4: Inquiring with Exhibitors and Real-Time Chat
1. Open the Exhibitors tab or visit /exhibitors.
2. Select an exhibitor and click View Profile.
3. Click Contact Exhibitor.
4. The system navigates to /messages with the recipient preselected.
5. Enter a subject and inquiry body, then click Dispatch Message.
6. When the exhibitor replies, your unread message badge in the navigation updates in real time over WebSockets.

[Screenshot: 11-attendee-messaging.png - Real-time message composition view with prefilled recipient]

#### Tutorial 5: Reviewing In-App Alerts and Reminders
1. Click the Alerts bell in the navigation bar to open the notification dropdown.
2. Automated reminders appear 30 minutes before your registered or bookmarked sessions start.
3. Click any notification to navigate directly to the relevant schedule or message thread.
4. Click Mark all as read to clear the unread counter badge.

[Screenshot: 12-attendee-notification-bell.png - Notification dropdown showing session reminders and unread badge]

#### Tutorial 6: Providing Feedback to Organizers
1. Click Feedback in the navigation menu.
2. Select your category: Feature Suggestion or Issue / Bug Report.
3. Enter your message (minimum 5 characters) and click Submit Feedback Log.
4. A confirmation alert displays: "Thank you! Your feedback has been logged to the operations crew."

[Screenshot: 13-attendee-feedback-form.png - User feedback submission form]

---

### 3.3 Exhibitor Workflows

#### Tutorial 1: Applying for an Expo
1. Log in with an exhibitor account (e.g., bushbabe@demo.com / Demo@123).
2. From the Exhibitor Dashboard, click Browse Expos or navigate to /exhibitor/expos.
3. Click Apply for Expo on an upcoming event.
4. Fill in the commercial details:
   - Company Name: Prefilled from your profile.
   - Showcased Products / Services: Overview of items displayed at your booth.
   - Upload Compliance Documents: Attach up to 3 files (PDF, DOC, DOCX, PNG, JPG; max 5 MB each).
5. Click Submit Application. The application enters "Pending" status and alerts event administrators.

[Screenshot: 14-exhibitor-apply-modal.png - Exhibitor application modal with document upload inputs]

#### Tutorial 2: Tracking Application Status
1. Navigate to My Applications (/exhibitor/applications).
2. Review submitted participation requests. Status badges indicate:
   - Pending: Under organizer review.
   - Approved: Application accepted; you may now reserve a booth.
   - Rejected: Application declined; any linked booth space is released back to available.

[Screenshot: 15-exhibitor-applications-list.png - Application tracker displaying pending and approved states]

#### Tutorial 3: Self-Service Booth Reservation on the Floor Plan
1. Once your application is Approved, navigate to My Booth & Map (/exhibitor/booths).
2. Select your expo from the dropdown. The floor plan displays Zone A (6x6 m, $1,200), Zone B (3x6 m, $800), and Zone C (3x3 m, $500).
3. Click any green Available booth to open the Booth Inspector.
4. Click Reserve Booth Space. The booth status transitions atomically to Reserved (Yellow), preventing concurrent double-booking.
5. If you change your mind prior to administrative confirmation, click Cancel Reservation to release the space back to Available.

[Screenshot: 16-exhibitor-booth-reservation.png - Interactive floor plan with booth inspector open for reservation]

#### Tutorial 4: Managing Booth Showcase and Staff Roster
1. In /exhibitor/booths, open the My Assigned Booth tab.
2. In the Booth Showcase Description field, enter details regarding live product demonstrations.
3. In the Staff Roster section, click + Add Staff Member. Enter the representative name and role (e.g., "Sales Director", "Technical Specialist").
4. Click Save Booth Telemetry. The public floor plan reflects your staff and showcase notes.

[Screenshot: 17-exhibitor-staff-management.png - Booth management form with staff roster rows]

#### Tutorial 5: Updating Company Profile and Uploading Brand Logo
1. Navigate to /exhibitor/profile.
2. Update corporate metadata: Company Name, Category, Website URL, Description, and Phone.
3. Under Brand Logo, click Choose File, select an image (JPG, PNG, WEBP; max 5 MB), and click Upload Logo.
4. The logo updates across all public directories and interactive floor plan cards.

[Screenshot: 18-exhibitor-profile-edit.png - Exhibitor profile editor with logo preview and upload controls]

---

### 3.4 Admin / Organizer Workflows

#### Tutorial 1: Creating an Expo and Generating Booth Spaces
1. Log in with the admin account (admin@eventsphere.com / Admin@123).
2. From the Admin Dashboard, click Manage Expos or navigate to /admin/expos.
3. Click + Create New Expo.
4. Enter event specifications:
   - Expo Title: Official name.
   - Theme / Category: Main industry focus.
   - Location / Venue: Street and hall address.
   - Start Date and End Date: End date must be equal to or after start date. The server checks for venue and date conflicts against existing expos.
   - Number of Booths: Number of initial spaces to generate (default: 20).
   - Default Booth Price: Base price per space (default: $500).
   - Default Booth Size: Base dimensions (default: 3x3 m).
   - Banner Image: Upload an image file or paste an image URL.
5. Click Create Expo. The expo is created and booths A1 through A[count] are generated with Available status.

[Screenshot: 19-admin-create-expo.png - Admin expo creation modal with automated booth generation inputs]

#### Tutorial 2: Reviewing and Approving Exhibitor Applications
1. Navigate to Approvals (/admin/applications).
2. Filter applications by status (Pending, Approved, Rejected) or specific expo.
3. Click View Documents to review uploaded compliance paperwork.
4. Click Approve Application to authorize the exhibitor to reserve floor space, or Reject Application to decline. The decision is dispatched to the exhibitor in real time.

[Screenshot: 20-admin-application-review.png - Admin application management table with document inspection links]

#### Tutorial 3: Managing Booth Allocations
1. Open /admin/expos/:id/booths.
2. Click any booth space on the visual floor plan.
3. Administrative operations available:
   - Assign Exhibitor: Select an approved applicant from the dropdown to assign and set status to Booked.
   - Confirm Reservation: Confirm an exhibitor's self-selected Reserved space into Booked.
   - Release Booth: Unassign the exhibitor and reset status to Available.
   - Modify Specs: Update booth pricing, dimensions, and descriptions.

[Screenshot: 21-admin-booth-assignment.png - Admin floor plan inspector showing booth assignment and confirmation buttons]

#### Tutorial 4: Building Keynote and Workshop Schedules
1. Open /admin/expos/:id/sessions.
2. In the Add New Session form, provide:
   - Session Title: Topic headline.
   - Track / Topic: Categorical focus.
   - Speaker Name: Keynote speaker or panel moderator.
   - Room / Stage Location: Location identifier.
   - Start Time and End Time: The server detects room conflicts if another session occupies the same room during that window.
3. Click Schedule Session. The timetable updates and broadcasts schedule:updated across all connected client browsers.

[Screenshot: 22-admin-session-scheduler.png - Admin schedule manager with room conflict validation]

#### Tutorial 5: Executive Analytics and Telemetry
1. Click Analytics in the admin navigation (/admin/analytics).
2. Review four primary metric cards: Total Expos, Floor Occupancy Rate, Attendee Reach, and Exhibitor Partners.
3. Inspect the Attendee Registrations per Expo bar chart.
4. Inspect the Overall Booth Status Breakdown donut chart showing booked versus available ratios.

[Screenshot: 23-admin-analytics-dashboard.png - Executive analytics view displaying metric cards and Recharts visualizations]

#### Tutorial 6: Reviewing User Feedback
1. Click Reviews (/admin/feedback).
2. Filter entries by category (All, Feature Suggestions, Issue Reports).
3. Read user remarks, reporter names, email contacts, and timestamps.

[Screenshot: 24-admin-feedback-inbox.png - Admin user feedback log sorted chronologically]

---

## 4. Real-Time Capabilities

EventSphere incorporates a Socket.IO WebSocket bus that synchronizes state across client browser windows without requiring manual page reloads (F5):

1. Floor Plan Booth Allocations: When an exhibitor reserves a booth or an admin assigns/releases one, the server broadcasts booth:updated. All clients viewing that expo's floor plan update booth colors and labels immediately.
2. Conference Schedules: When an admin creates, edits, or deletes a session, the server broadcasts schedule:updated. Attendee timetables and expo schedule tabs re-fetch and render updates in real time.
3. Peer Messaging: When a message is sent, the server pushes message:new to the recipient's personal socket room, incrementing the unread badge counter in their navigation bar.
4. Notification Alerts: System notifications (booth confirmations, application decisions, session reminders) emit notification:new, popping in-app alert toasts and updating the notification bell counter.

---

## 5. Frequently Asked Questions (FAQ)

### General & Accounts
1. Q: Who can register for an account on EventSphere?  
   A: Any visitor can register for an Attendee Pass or an Exhibitor Booth. Administrator accounts cannot be registered from the public form and must be seeded by server administrators.
2. Q: What happens if I forget my password?  
   A: Use the Forgot Password link on the login page. In demo mode (DEMO_MODE=true), the system displays the reset link on your screen. The reset token is single-use and valid for 15 minutes.
3. Q: Can I change my role after registration?  
   A: Roles (admin, exhibitor, attendee) are immutable through the profile UI to preserve data integrity and permissions.
4. Q: How long does my login session remain active?  
   A: Authentication tokens are valid for 7 days from the time of login.

### Expos & Floor Plans
5. Q: Can an attendee register for an expo that has already ended?  
   A: No. The server verifies that the expo end date is in the future. Ended expos display an Ended indicator and block registration.
6. Q: Can two exhibitors reserve the same booth at the same time?  
   A: No. Booth reservation uses atomic database operations. If two exhibitors click simultaneously, the first request secures the booth and the second receives a notice that the booth is no longer available.
7. Q: How many booths can a single exhibitor reserve per expo?  
   A: An exhibitor can reserve or hold only one booth per expo.
8. Q: What do the colors on the floor plan mean?  
   A: Kiwi Green indicates an Available space, Selective Yellow indicates a Reserved space pending confirmation, and Coral Red indicates a confirmed Booked space.
9. Q: What happens to booths when an expo is deleted by an admin?  
   A: Deleting an expo cascades deletion to all associated booths, exhibitor applications, scheduled sessions, and attendee registrations.

### Exhibitor Applications
10. Q: What documents are required when an exhibitor applies for an expo?  
    A: Exhibitors can upload up to 3 compliance documents in PDF, DOC, DOCX, PNG, or JPG formats under 5 MB each.
11. Q: Can an exhibitor submit multiple applications for the same expo?  
    A: No. The server rejects duplicate applications from the same exhibitor for the same expo.
12. Q: Can an exhibitor select a booth before their application is approved?  
    A: No. The booth reservation controller verifies that the exhibitor holds an application with status approved for that specific expo.
13. Q: What happens if an admin rejects an approved application that already holds a booth?  
    A: Rejecting the application automatically releases the booth back to Available and unlinks the exhibitor.

### Sessions & Schedules
14. Q: Can two sessions be scheduled in the same room at the same time?  
    A: No. The session controller checks for room collisions and rejects overlapping schedules in the same location.
15. Q: What happens if an attendee registers for two overlapping sessions?  
    A: Registration succeeds so attendees are not locked out of multi-track events, but the server returns a non-blocking warning toast stating that the session overlaps with an existing booking.
16. Q: Can I bookmark a session without registering for it?  
    A: Yes. Bookmarking is tracked independently from registration. You can bookmark any presentation to save it to your personal schedule.
17. Q: When are automated session reminders sent?  
    A: A background scheduler polls every 60 seconds and dispatches an in-app reminder notification 30 minutes before any registered or bookmarked session starts.
18. Q: What happens if an admin cancels a session I registered for?  
    A: The session is removed, its registrations are deleted, and all registered and bookmarked attendees receive a cancellation notification.

### Messaging & Notifications
19. Q: Who can an attendee message?  
    A: Attendees can send messages to event organizers (admins) and verified exhibitors. Direct attendee-to-attendee messaging is rejected by server authorization rules.
20. Q: Who can an exhibitor message?  
    A: Exhibitors can message organizers, other exhibitors, and registered attendees.
21. Q: Can I message myself?  
    A: No. The server explicitly rejects self-messaging requests.
22. Q: Do unread message counters update automatically?  
    A: Yes. Incoming messages dispatch WebSocket events that increment the recipient's unread badge counter in real time.
23. Q: How do I clear unread alerts?  
    A: Open the Alerts notification dropdown and click Mark all as read, or click an individual notification to mark it read and open its linked page.

### Troubleshooting
24. Q: Why does the screen display "Service Temporarily Unavailable"?  
    A: The application includes a database connection monitor. If MongoDB Atlas drops connection, the client displays an outage notice with a Retry button rather than logging you out.
25. Q: Why did my upload fail?  
    A: Uploads must be image files (JPG, PNG, WEBP) or document files (PDF, DOC, DOCX) and must not exceed 5 MB in size.

---

## 6. Accessibility and Browser Compatibility

### Browser Support
EventSphere is built with standard web APIs and CSS Grid/Flexbox bundled through Vite. It functions across:
- Google Chrome (version 110+)
- Mozilla Firefox (version 110+)
- Microsoft Edge (version 110+)
- Apple Safari (version 16+)

### Accessibility Provisions
The codebase implements the following baseline accessibility features:
- Contrast: The high-contrast color palette (dark text on light cream, white text on dark surfaces) provides contrast ratios exceeding 7:1, satisfying WCAG AAA requirements.
- Focus Indicators: Interactive inputs and buttons provide distinct outline styling on focus (:focus-visible).
- Form Labels: Form fields provide textual labels and placeholder instructions.
- Screen Reader Notifications: Toast notification containers include ARIA live region declarations (role="region", aria-live="polite", role="status") to announce updates to assistive technologies.
