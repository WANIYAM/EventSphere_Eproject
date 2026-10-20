# EventSphere Management - Manual Test Cases Matrix

This document provides 83 manual test cases covering functional, non-functional, security, and edge-case behaviors across EventSphere Management. The original 73 cases remain, with 10 additional planned gap-verification cases. No execution results are recorded here. The SRS PDF was not available when this traceability column was prepared; rows marked as unverified require mapping against the source PDF.

## Test Environment & Demo Data
- Frontend URL: http://localhost:5173
- Backend API URL: http://localhost:5000/api
- Database: Dedicated demo MongoDB initialized from the `server` folder with `npm run seed:demo` (the script clears and recreates demo data)
- Default Passwords: `Admin@123` for admin, `Demo@123` for all exhibitors and attendees

---

## Test Cases Register

### Module 1: User Authentication & Account Recovery

| ID | Req. | Module | Test Case | Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-AUTH-01 | SRS ID unverified (source PDF unavailable) | Auth | Attendee Registration | 1. Open /register.<br>2. Choose Attendee Pass.<br>3. Enter valid name, email, phone, password.<br>4. Submit. | Account created (201), JWT saved in localStorage, redirected to Home. | To be filled | To be filled |
| TC-AUTH-02 | SRS ID unverified (source PDF unavailable) | Auth | Exhibitor Registration | 1. Open /register.<br>2. Choose Exhibitor Booth.<br>3. Enter valid details including company name.<br>4. Submit. | Account created with role exhibitor, redirected to /exhibitor. | To be filled | To be filled |
| TC-AUTH-03 | SRS ID unverified (source PDF unavailable) | Auth | Registration Password Mismatch | 1. Open /register.<br>2. Enter mismatched password and confirm password.<br>3. Submit. | Client validation blocks submission; displays "Passwords do not match." | To be filled | To be filled |
| TC-AUTH-04 | SRS ID unverified (source PDF unavailable) | Auth | Duplicate Email Registration | 1. Register with an email already in database (e.g. admin@eventsphere.com). | Server returns 400 "User already exists with this email." | To be filled | To be filled |
| TC-AUTH-05 | SRS ID unverified (source PDF unavailable) | Auth | Short Password Rejection | 1. Submit registration with password "123". | Blocked on client and server with "Password must be at least 6 characters long." | To be filled | To be filled |
| TC-AUTH-06 | SRS ID unverified (source PDF unavailable) | Auth | Valid Login | 1. Open /login.<br>2. Enter admin@eventsphere.com and Admin@123.<br>3. Click Access Portal. | Authenticated successfully (200), redirected to /admin dashboard. | To be filled | To be filled |
| TC-AUTH-07 | SRS ID unverified (source PDF unavailable) | Auth | Invalid Credentials | 1. Submit login with correct email and wrong password. | Server returns 401 "Invalid email or password"; red error alert renders. | To be filled | To be filled |
| TC-AUTH-08 | SRS ID unverified (source PDF unavailable) | Auth | Password Reset Link Display | 1. Open /forgot-password.<br>2. Enter a registered email.<br>3. Submit. | Returns 200; the current response includes a reset link and the page displays it irrespective of `DEMO_MODE`. No email is delivered. | To be filled | To be filled |
| TC-AUTH-09 | SRS ID unverified (source PDF unavailable) | Auth | Password Reset Token Expiry | 1. Attempt password reset using an expired token (>15 mins). | Server returns 400 "Invalid or expired reset token." | To be filled | To be filled |
| TC-AUTH-10 | SRS ID unverified (source PDF unavailable) | Auth | Session Logout | 1. Log in.<br>2. Click Logout in navigation. | Token cleared from localStorage; socket disconnected; redirected to /login. | To be filled | To be filled |

### Module 2: Expo Management (Admin)

| ID | Req. | Module | Test Case | Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-EXPO-01 | SRS ID unverified (source PDF unavailable) | Expos | Create Valid Expo | 1. Log in as Admin.<br>2. Open /admin/expos.<br>3. Fill title, dates, venue, 20 booths.<br>4. Submit. | Expo created (201); 20 booths (A1-A20) generated with status available. | To be filled | To be filled |
| TC-EXPO-02 | SRS ID unverified (source PDF unavailable) | Expos | Reverse Date Validation | 1. Attempt to create expo with endDate prior to startDate. | Server returns 400 "End date cannot be before start date." | To be filled | To be filled |
| TC-EXPO-03 | SRS ID unverified (source PDF unavailable) | Expos | Venue & Date Collision | 1. Create expo matching venue and overlapping dates of an existing expo. | Server returns 400 "Another expo is already scheduled at this location during these dates." | To be filled | To be filled |
| TC-EXPO-04 | SRS ID unverified (source PDF unavailable) | Expos | Edit Expo Details | 1. Edit expo title and location.<br>2. Save changes. | Expo updates in DB; socket emits expo:updated; changes reflect on public page. | To be filled | To be filled |
| TC-EXPO-05 | SRS ID unverified (source PDF unavailable) | Expos | Delete Expo Cascade | 1. Delete an active expo.<br>2. Inspect database collections. | Expo deleted; associated Booths, Applications, Sessions, and Registrations are deleted. | To be filled | To be filled |
| TC-EXPO-06 | SRS ID unverified (source PDF unavailable) | Expos | Upload Banner Image | 1. Upload a 2 MB JPG image while creating an expo. | Image saves to server/uploads/; public expo page renders custom banner photo. | To be filled | To be filled |

### Module 3: Booth Management & Floor Plans

| ID | Req. | Module | Test Case | Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-BOOTH-01 | SRS ID unverified (source PDF unavailable) | Booths | Public Floor Plan View | 1. Open /expos/:id as visitor.<br>2. Open Floor Plan tab. | Interactive booth grid displays; available is green, reserved is yellow, booked is red. | To be filled | To be filled |
| TC-BOOTH-02 | SRS ID unverified (source PDF unavailable) | Booths | Exhibitor Self-Reservation | 1. Log in as approved exhibitor.<br>2. Open /exhibitor/booths.<br>3. Reserve available booth A3. | Booth status transitions to reserved atomically; socket broadcasts booth:updated. | To be filled | To be filled |
| TC-BOOTH-03 | SRS ID unverified (source PDF unavailable) | Booths | Block Unapproved Exhibitor | 1. Log in as exhibitor without approved application.<br>2. Attempt booth reservation. | Server returns 400 "You do not have an approved application for this expo." | To be filled | To be filled |
| TC-BOOTH-04 | SRS ID unverified (source PDF unavailable) | Booths | One Booth Per Expo Rule | 1. Exhibitor with an existing reserved booth attempts to reserve a second booth. | Server returns 400 "You already hold or reserved a booth for this expo." | To be filled | To be filled |
| TC-BOOTH-05 | SRS ID unverified (source PDF unavailable) | Booths | Admin Confirm Reservation | 1. Admin opens /admin/expos/:id/booths.<br>2. Selects reserved booth.<br>3. Clicks Confirm. | Booth status transitions to booked; notification sent to exhibitor. | To be filled | To be filled |
| TC-BOOTH-06 | SRS ID unverified (source PDF unavailable) | Booths | Exhibitor Cancel Reservation | 1. Exhibitor cancels own reserved booth. | Booth status returns to available; application booth link cleared. | To be filled | To be filled |
| TC-BOOTH-07 | SRS ID unverified (source PDF unavailable) | Booths | Update Booth Staff | 1. Exhibitor opens My Assigned Booth.<br>2. Adds staff members.<br>3. Saves. | Staff array saves in Booth document; renders in public booth inspector. | To be filled | To be filled |

### Module 4: Exhibitor Applications

| ID | Req. | Module | Test Case | Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-APP-01 | SRS ID unverified (source PDF unavailable) | Apps | Submit Application | 1. Log in as exhibitor.<br>2. Apply for upcoming expo with products and 2 PDF files. | Application created (201) in pending status; admins notified via socket. | To be filled | To be filled |
| TC-APP-02 | SRS ID unverified (source PDF unavailable) | Apps | Duplicate Application Block | 1. Submit second application for same expo. | Server returns 400 "You have already applied for this expo." | To be filled | To be filled |
| TC-APP-03 | SRS ID unverified (source PDF unavailable) | Apps | Admin Approve Application | 1. Admin views pending application.<br>2. Clicks Approve. | Status updates to approved; notification dispatched to exhibitor. | To be filled | To be filled |
| TC-APP-04 | SRS ID unverified (source PDF unavailable) | Apps | Admin Reject Application | 1. Admin rejects an application that held a booth. | Status updates to rejected; allocated booth is automatically released to available. | To be filled | To be filled |
| TC-APP-05 | SRS ID unverified (source PDF unavailable) | Apps | Oversized Document Upload | 1. Attempt to upload a document exceeding 5 MB. | Multer rejects upload with "File too large"; returns error status. | To be filled | To be filled |
| TC-APP-06 | SRS ID unverified (source PDF unavailable) | Apps | Disallowed File Extension | 1. Attempt to upload an executable (.exe or .sh) file. | Rejected with "Only images and documents are allowed!" | To be filled | To be filled |

### Module 5: Session & Schedule Management

| ID | Req. | Module | Test Case | Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-SESS-01 | SRS ID unverified (source PDF unavailable) | Sessions | Create Valid Session | 1. Admin creates keynote session with start/end time. | Session created (201); schedule:updated emitted; displays on timetable. | To be filled | To be filled |
| TC-SESS-02 | SRS ID unverified (source PDF unavailable) | Sessions | Room Overlap Detection | 1. Schedule second session in same room overlapping in time with existing session. | Server returns 400 "Session overlaps with an existing session at this location." | To be filled | To be filled |
| TC-SESS-03 | SRS ID unverified (source PDF unavailable) | Sessions | End Time Before Start Time | 1. Create session with endTime <= startTime. | Server returns 400 "End time must be after start time." | To be filled | To be filled |
| TC-SESS-04 | SRS ID unverified (source PDF unavailable) | Sessions | Update Session Time | 1. Admin alters session start time. | Schedule updates; reminderSent flag resets to false; registrants notified. | To be filled | To be filled |
| TC-SESS-05 | SRS ID unverified (source PDF unavailable) | Sessions | Delete Session Cascade | 1. Admin deletes a session. | Session deleted; referencing registrations deleted; union of attendees notified. | To be filled | To be filled |

### Module 6: Attendee Registrations & Bookmarks

| ID | Req. | Module | Test Case | Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-REG-01 | SRS ID unverified (source PDF unavailable) | Registrations | Register for Expo Pass | 1. Log in as attendee.<br>2. Open active expo.<br>3. Click Register for Expo. | Registration record created; button updates to "Registration Confirmed". | To be filled | To be filled |
| TC-REG-02 | SRS ID unverified (source PDF unavailable) | Registrations | Duplicate Expo Pass Block | 1. Re-send registration for already confirmed expo. | Handled safely; returns 409 "Already registered"; UI button remains confirmed. | To be filled | To be filled |
| TC-REG-03 | SRS ID unverified (source PDF unavailable) | Registrations | Ended Expo Registration Block | 1. Attempt registration on an expo where endDate is in the past. | Server returns 400 "This expo has already ended"; UI button displays "Ended". | To be filled | To be filled |
| TC-REG-04 | SRS ID unverified (source PDF unavailable) | Registrations | Register for Session | 1. Attendee registers for keynote session. | Session registration created; parent expo pass auto-created if missing. | To be filled | To be filled |
| TC-REG-05 | SRS ID unverified (source PDF unavailable) | Registrations | Session Time Overlap Warning | 1. Register for a session that overlaps in time with another registered session. | Registration succeeds (201); warning toast displays: "This session overlaps with...". | To be filled | To be filled |
| TC-REG-06 | SRS ID unverified (source PDF unavailable) | Registrations | Ended Session Registration Block | 1. Attempt registration on a session where endTime is in the past. | Server returns 400 "This session has already ended"; button displays "Ended". | To be filled | To be filled |
| TC-REG-07 | SRS ID unverified (source PDF unavailable) | Registrations | Toggle Session Bookmark | 1. Click Bookmark on a session. | Bookmark status toggles to Bookmarked; persists in database and My Schedule. | To be filled | To be filled |
| TC-REG-08 | SRS ID unverified (source PDF unavailable) | Registrations | Cancel Session Registration | 1. Click Cancel Registration on a registered session. | Registration record removed; session timetable slot freed up. | To be filled | To be filled |
| TC-REG-09 | SRS ID unverified (source PDF unavailable) | Registrations | Double-Click Pending Guard | 1. Rapidly double-click Register button. | Button disables instantly during in-flight request; only one HTTP request sent. | To be filled | To be filled |

### Module 7: Exhibitor Directory & Profiles

| ID | Req. | Module | Test Case | Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-EXH-01 | SRS ID unverified (source PDF unavailable) | Exhibitors | Browse Public Directory | 1. Open /exhibitors as guest visitor. | Directory loads approved exhibitors with logos, categories, and booth badges. | To be filled | To be filled |
| TC-EXH-02 | SRS ID unverified (source PDF unavailable) | Exhibitors | Keyword Search | 1. Type a term present in an exhibitor profile into the search field. | Directory filters to matching exhibitor records; results depend on seeded data. | To be filled | To be filled |
| TC-EXH-03 | SRS ID unverified (source PDF unavailable) | Exhibitors | Dynamic Category Filter | 1. Click a category button (e.g. "Food & Beverage"). | Directory filters to matching vendors; categories derive from live database records. | To be filled | To be filled |
| TC-EXH-04 | SRS ID unverified (source PDF unavailable) | Exhibitors | View Profile Dossier | 1. Click View Profile on an exhibitor. | Dossier opens displaying company biography, products, website, and booth allocations. | To be filled | To be filled |
| TC-EXH-05 | SRS ID unverified (source PDF unavailable) | Exhibitors | Contact Button Logged Out | 1. Unauthenticated visitor clicks Contact Exhibitor. | Navigates to /login with redirect parameter preserving prefilled message path. | To be filled | To be filled |

### Module 8: Messaging & Real-Time Communications

| ID | Req. | Module | Test Case | Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-MSG-01 | SRS ID unverified (source PDF unavailable) | Messages | Attendee Messages Exhibitor | 1. Attendee sends message to exhibitor. | Message saved (201); message:new emitted; exhibitor unread badge increments. | To be filled | To be filled |
| TC-MSG-02 | SRS ID unverified (source PDF unavailable) | Messages | Block Attendee-to-Attendee Message | 1. Attendee attempts to send message to another attendee via API. | Server returns 403 "Attendees may only message event organizers and exhibitors." | To be filled | To be filled |
| TC-MSG-03 | SRS ID unverified (source PDF unavailable) | Messages | Block Self-Messaging | 1. User attempts to send message to own user ID. | Server returns 400 "You cannot message yourself." | To be filled | To be filled |
| TC-MSG-04 | SRS ID unverified (source PDF unavailable) | Messages | Empty Message Body Validation | 1. Send message with empty body string. | Server returns 400 "Message body is required." | To be filled | To be filled |
| TC-MSG-05 | SRS ID unverified (source PDF unavailable) | Messages | Mark Message Read | 1. Recipient opens message in inbox. | Message read flag updates to true; unread badge counter decrements. | To be filled | To be filled |
| TC-MSG-06 | SRS ID unverified (source PDF unavailable) | Messages | Non-Recipient Mark Read (Anti-IDOR) | 1. User attempts to mark another user's message as read. | Server returns 403 "Not authorized to mark this message as read." | To be filled | To be filled |

### Module 9: Notifications & Reminders

| ID | Req. | Module | Test Case | Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-NOTIF-01 | SRS ID unverified (source PDF unavailable) | Notifications | In-App Alert Reception | 1. Perform action that triggers notification (e.g. admin approves app). | Notification bell badge updates; toast notification renders. | To be filled | To be filled |
| TC-NOTIF-02 | SRS ID unverified (source PDF unavailable) | Notifications | Mark All Read | 1. Click Mark all as read in notifications dropdown. | All notifications marked read (200); unread badge resets to 0. | To be filled | To be filled |
| TC-NOTIF-03 | SRS ID unverified (source PDF unavailable) | Notifications | Automated 30-Min Session Reminder | 1. Register for session starting in 25 minutes.<br>2. Wait for scheduler execution. | Reminder notification dispatched: "Reminder: <Title> starts at <Time>". | To be filled | To be filled |
| TC-NOTIF-04 | SRS ID unverified (source PDF unavailable) | Notifications | Reminder Flag Reset on Time Edit | 1. Session with reminderSent=true has its time updated by admin. | reminderSent resets to false so future reminder can fire. | To be filled | To be filled |

### Module 10: Feedback & Analytics

| ID | Req. | Module | Test Case | Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-FEED-01 | SRS ID unverified (source PDF unavailable) | Feedback | Submit Feature Suggestion | 1. User submits feedback of type suggestion. | Feedback record created (201); confirmation alert renders. | To be filled | To be filled |
| TC-FEED-02 | SRS ID unverified (source PDF unavailable) | Feedback | Short Message Rejection | 1. Submit feedback with text "abc" (<5 chars). | Server returns 400 validation error. | To be filled | To be filled |
| TC-FEED-03 | SRS ID unverified (source PDF unavailable) | Feedback | Non-Admin View Feedback | 1. Attendee attempts GET /api/feedback. | Server returns 403 Forbidden. | To be filled | To be filled |
| TC-ANAL-01 | SRS ID unverified (source PDF unavailable) | Analytics | Admin Analytics Dashboard | 1. Admin opens /admin/analytics. | Database count metrics and Recharts render; attendance categories and some zero-count booth values use simulated/fallback data, not traffic or session popularity. | To be filled | To be filled |
| TC-ANAL-02 | SRS ID unverified (source PDF unavailable) | Analytics | Non-Admin Access Block | 1. Attendee attempts GET /api/analytics/admin. | Server returns 403 Forbidden. | To be filled | To be filled |

### Module 11: Security, Role Guards & Resilience

| ID | Req. | Module | Test Case | Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-SEC-01 | SRS ID unverified (source PDF unavailable) | Security | Attendee Accessing /admin | 1. Attendee types /admin in URL. | ProtectedRoute redirects to /unauthorized (403 page). | To be filled | To be filled |
| TC-SEC-02 | SRS ID unverified (source PDF unavailable) | Security | Exhibitor Accessing /admin | 1. Exhibitor types /admin in URL. | ProtectedRoute redirects to /unauthorized. | To be filled | To be filled |
| TC-SEC-03 | SRS ID unverified (source PDF unavailable) | Security | Unauthenticated Protected Route | 1. Guest visitor navigates to /schedule. | ProtectedRoute redirects to /login with state.from preserved. | To be filled | To be filled |
| TC-SEC-04 | SRS ID unverified (source PDF unavailable) | Security | Malformed ObjectId Rejection | 1. Issue GET /api/expos/invalid-hex-id. | validateObjectId middleware catches and returns 400 "Invalid id". | To be filled | To be filled |
| TC-SEC-05 | SRS ID unverified (source PDF unavailable) | Security | Database Outage 503 Shield | 1. Stop MongoDB service.<br>2. Make API call. | dbCheck middleware returns 503; client displays status banner. | To be filled | To be filled |
| TC-SEC-06 | SRS ID unverified (source PDF unavailable) | Security | Session Token Retention on 503 | 1. Refresh page during database 503 outage. | AuthContext retains token in storage and renders Retry button; does not log out. | To be filled | To be filled |
| TC-SEC-07 | SRS ID unverified (source PDF unavailable) | Security | Sanitized Public Projections | 1. Call GET /api/public/expos/:id unauthenticated. | Response omits email and phone fields of exhibitors and organizers. | To be filled | To be filled |

### Module 12: Responsive Layout & Mobile Usability

| ID | Req. | Module | Test Case | Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-RESP-01 | SRS ID unverified (source PDF unavailable) | UI | Mobile Navigation Toggle | 1. View site at 375 px width.<br>2. Click Menu button. | Mobile drawer slides down; button toggles to Close; clicking link closes drawer. | To be filled | To be filled |
| TC-RESP-02 | SRS ID unverified (source PDF unavailable) | UI | 320 px Grid Scaling | 1. View /expos and /exhibitors at 320 px width. | Cards scale via minmax(min(320px, 100%), 1fr); no horizontal overflow scrollbar. | To be filled | To be filled |
| TC-RESP-03 | SRS ID unverified (source PDF unavailable) | UI | Touch Target Dimensions | 1. Inspect mobile navigation and buttons. | Touch targets have minimum height/width of 44 px. | To be filled | To be filled |

### Module 13: Planned Requirement-Gap Verification

These cases are planned and have not been run. For requirements absent from the current implementation (such as backup/restore and consent capture), the test must remain blocked until the feature exists.

| ID | Req. | Module | Test Case | Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-COMPAT-01 | SRS ID unverified (source PDF unavailable) | Compatibility | Cross-Browser Review | Open the core visitor, attendee, exhibitor, and admin flows in Chrome, Firefox, Edge, and Safari. | Record layout and interaction results per browser; no browser pass is claimed in advance. | To be filled | Planned |
| TC-PERF-01 | SRS ID unverified (source PDF unavailable) | Performance | API Response-Time Target | Measure representative API responses under a documented environment and dataset. | Record whether response times meet the 1 to 2 second target; do not infer performance from local browsing. | To be filled | Planned |
| TC-LOAD-01 | SRS ID unverified (source PDF unavailable) | Load | Concurrent Users | Run a controlled load test with the SRS-defined concurrent-user profile and record errors/latency. | Results meet the source SRS load target. Load testing has not been executed. | To be filled | Planned |
| TC-BACKUP-01 | SRS ID unverified (source PDF unavailable) | Availability | Backup and Restore | Verify a documented database backup can be produced and restored into a clean test database. | A verified backup and restore procedure is available. Current repository evidence of an automated backup is absent; test is blocked until an approach exists. | To be filled | Planned |
| TC-MSG-07 | SRS ID unverified (source PDF unavailable) | Messages | Exhibitor-to-Exhibitor Messaging | Log in as one exhibitor, open another exhibitor's profile, send a message, then inspect the recipient inbox. | Message is persisted, delivered to the selected exhibitor, and visible in Inbox. | To be filled | Planned |
| TC-EXPO-07 | SRS ID unverified (source PDF unavailable) | Expo Management | Admin Expo Edit in UI | As Admin, open Manage Expos, edit an existing expo, save, and check the public expo details. | Edited fields persist and are reflected by the public expo view. | To be filled | Planned |
| TC-HOME-01 | SRS ID unverified (source PDF unavailable) | Public UI | Landing Page | Open `/` without signing in and inspect initial load and navigation to public sections. | Landing page renders and visitors can navigate to public expo and exhibitor information. | To be filled | Planned |
| TC-SEC-08 | SRS ID unverified (source PDF unavailable) | Security | Missing, Invalid, and Expired JWT | Call a protected API with no token, an invalid token, and an expired token. | Each request is rejected with HTTP 401; no protected data is returned. | To be filled | Planned |
| TC-NOTIF-05 | SRS ID unverified (source PDF unavailable) | Notifications | Reminder Timing and Duplicate Guard | Use registered and bookmarked sessions in the reminder window, observe scheduler polling, and confirm only one reminder per session is produced. | Reminder processing is checked against the 60-second poll and 30-minute lead window, includes registered or bookmarked users, and does not duplicate reminders. | To be filled | Planned |
| TC-PRIV-01 | NFR-PRV-01/02 (user-provided IDs; exact wording unverified) | Privacy | Consent and Privacy Controls | Attempt the SRS-required consent flow and verify consent record, privacy notice, and any required data rights controls. | Expected behavior must be taken from the SRS. Current implementation evidence shows no consent capture, privacy route, data export, or account deletion; case is blocked pending implementation and SRS review. | To be filled | Planned |
