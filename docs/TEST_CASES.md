# EventSphere Management - Manual Test Cases Matrix

This document provides 64 comprehensive manual test cases covering functional, non-functional, security, and edge-case behaviors across EventSphere Management.

## Test Environment & Demo Data
- Frontend URL: http://localhost:5173
- Backend API URL: http://localhost:5000/api
- Database: MongoDB initialized via `npm run seed:demo`
- Default Passwords: `Admin@123` for admin, `Demo@123` for all exhibitors and attendees

---

## Test Cases Register

### Module 1: User Authentication & Account Recovery

| ID | Module | Test Case | Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-AUTH-01 | Auth | Attendee Registration | 1. Open /register.<br>2. Choose Attendee Pass.<br>3. Enter valid name, email, phone, password.<br>4. Submit. | Account created (201), JWT saved in localStorage, redirected to Home. | To be filled | To be filled |
| TC-AUTH-02 | Auth | Exhibitor Registration | 1. Open /register.<br>2. Choose Exhibitor Booth.<br>3. Enter valid details including company name.<br>4. Submit. | Account created with role exhibitor, redirected to /exhibitor. | To be filled | To be filled |
| TC-AUTH-03 | Auth | Registration Password Mismatch | 1. Open /register.<br>2. Enter mismatched password and confirm password.<br>3. Submit. | Client validation blocks submission; displays "Passwords do not match." | To be filled | To be filled |
| TC-AUTH-04 | Auth | Duplicate Email Registration | 1. Register with an email already in database (e.g. admin@eventsphere.com). | Server returns 400 "User already exists with this email." | To be filled | To be filled |
| TC-AUTH-05 | Auth | Short Password Rejection | 1. Submit registration with password "123". | Blocked on client and server with "Password must be at least 6 characters long." | To be filled | To be filled |
| TC-AUTH-06 | Auth | Valid Login | 1. Open /login.<br>2. Enter admin@eventsphere.com and Admin@123.<br>3. Click Access Portal. | Authenticated successfully (200), redirected to /admin dashboard. | To be filled | To be filled |
| TC-AUTH-07 | Auth | Invalid Credentials | 1. Submit login with correct email and wrong password. | Server returns 401 "Invalid email or password"; red error alert renders. | To be filled | To be filled |
| TC-AUTH-08 | Auth | Password Reset Demo Flow | 1. Open /forgot-password.<br>2. Enter registered email.<br>3. Submit with DEMO_MODE=true. | Returns 200; yellow box displays working reset link with token. | To be filled | To be filled |
| TC-AUTH-09 | Auth | Password Reset Token Expiry | 1. Attempt password reset using an expired token (>15 mins). | Server returns 400 "Invalid or expired reset token." | To be filled | To be filled |
| TC-AUTH-10 | Auth | Session Logout | 1. Log in.<br>2. Click Logout in navigation. | Token cleared from localStorage; socket disconnected; redirected to /login. | To be filled | To be filled |

### Module 2: Expo Management (Admin)

| ID | Module | Test Case | Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-EXPO-01 | Expos | Create Valid Expo | 1. Log in as Admin.<br>2. Open /admin/expos.<br>3. Fill title, dates, venue, 20 booths.<br>4. Submit. | Expo created (201); 20 booths (A1-A20) generated with status available. | To be filled | To be filled |
| TC-EXPO-02 | Expos | Reverse Date Validation | 1. Attempt to create expo with endDate prior to startDate. | Server returns 400 "End date cannot be before start date." | To be filled | To be filled |
| TC-EXPO-03 | Expos | Venue & Date Collision | 1. Create expo matching venue and overlapping dates of an existing expo. | Server returns 400 "Another expo is already scheduled at this location during these dates." | To be filled | To be filled |
| TC-EXPO-04 | Expos | Edit Expo Details | 1. Edit expo title and location.<br>2. Save changes. | Expo updates in DB; socket emits expo:updated; changes reflect on public page. | To be filled | To be filled |
| TC-EXPO-05 | Expos | Delete Expo Cascade | 1. Delete an active expo.<br>2. Inspect database collections. | Expo deleted; associated Booths, Applications, Sessions, and Registrations are deleted. | To be filled | To be filled |
| TC-EXPO-06 | Expos | Upload Banner Image | 1. Upload a 2 MB JPG image while creating an expo. | Image saves to server/uploads/; public expo page renders custom banner photo. | To be filled | To be filled |

### Module 3: Booth Management & Floor Plans

| ID | Module | Test Case | Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-BOOTH-01 | Booths | Public Floor Plan View | 1. Open /expos/:id as visitor.<br>2. Open Floor Plan tab. | Interactive booth grid displays; available is green, reserved is yellow, booked is red. | To be filled | To be filled |
| TC-BOOTH-02 | Booths | Exhibitor Self-Reservation | 1. Log in as approved exhibitor.<br>2. Open /exhibitor/booths.<br>3. Reserve available booth A3. | Booth status transitions to reserved atomically; socket broadcasts booth:updated. | To be filled | To be filled |
| TC-BOOTH-03 | Booths | Block Unapproved Exhibitor | 1. Log in as exhibitor without approved application.<br>2. Attempt booth reservation. | Server returns 400 "You do not have an approved application for this expo." | To be filled | To be filled |
| TC-BOOTH-04 | Booths | One Booth Per Expo Rule | 1. Exhibitor with an existing reserved booth attempts to reserve a second booth. | Server returns 400 "You already hold or reserved a booth for this expo." | To be filled | To be filled |
| TC-BOOTH-05 | Booths | Admin Confirm Reservation | 1. Admin opens /admin/expos/:id/booths.<br>2. Selects reserved booth.<br>3. Clicks Confirm. | Booth status transitions to booked; notification sent to exhibitor. | To be filled | To be filled |
| TC-BOOTH-06 | Booths | Exhibitor Cancel Reservation | 1. Exhibitor cancels own reserved booth. | Booth status returns to available; application booth link cleared. | To be filled | To be filled |
| TC-BOOTH-07 | Booths | Update Booth Staff | 1. Exhibitor opens My Assigned Booth.<br>2. Adds staff members.<br>3. Saves. | Staff array saves in Booth document; renders in public booth inspector. | To be filled | To be filled |

### Module 4: Exhibitor Applications

| ID | Module | Test Case | Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-APP-01 | Apps | Submit Application | 1. Log in as exhibitor.<br>2. Apply for upcoming expo with products and 2 PDF files. | Application created (201) in pending status; admins notified via socket. | To be filled | To be filled |
| TC-APP-02 | Apps | Duplicate Application Block | 1. Submit second application for same expo. | Server returns 400 "You have already applied for this expo." | To be filled | To be filled |
| TC-APP-03 | Apps | Admin Approve Application | 1. Admin views pending application.<br>2. Clicks Approve. | Status updates to approved; notification dispatched to exhibitor. | To be filled | To be filled |
| TC-APP-04 | Apps | Admin Reject Application | 1. Admin rejects an application that held a booth. | Status updates to rejected; allocated booth is automatically released to available. | To be filled | To be filled |
| TC-APP-05 | Apps | Oversized Document Upload | 1. Attempt to upload a document exceeding 5 MB. | Multer rejects upload with "File too large"; returns error status. | To be filled | To be filled |
| TC-APP-06 | Apps | Disallowed File Extension | 1. Attempt to upload an executable (.exe or .sh) file. | Rejected with "Only images and documents are allowed!" | To be filled | To be filled |

### Module 5: Session & Schedule Management

| ID | Module | Test Case | Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-SESS-01 | Sessions | Create Valid Session | 1. Admin creates keynote session with start/end time. | Session created (201); schedule:updated emitted; displays on timetable. | To be filled | To be filled |
| TC-SESS-02 | Sessions | Room Overlap Detection | 1. Schedule second session in same room overlapping in time with existing session. | Server returns 400 "Session overlaps with an existing session at this location." | To be filled | To be filled |
| TC-SESS-03 | Sessions | End Time Before Start Time | 1. Create session with endTime <= startTime. | Server returns 400 "End time must be after start time." | To be filled | To be filled |
| TC-SESS-04 | Sessions | Update Session Time | 1. Admin alters session start time. | Schedule updates; reminderSent flag resets to false; registrants notified. | To be filled | To be filled |
| TC-SESS-05 | Sessions | Delete Session Cascade | 1. Admin deletes a session. | Session deleted; referencing registrations deleted; union of attendees notified. | To be filled | To be filled |

### Module 6: Attendee Registrations & Bookmarks

| ID | Module | Test Case | Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-REG-01 | Registrations | Register for Expo Pass | 1. Log in as attendee.<br>2. Open active expo.<br>3. Click Register for Expo. | Registration record created; button updates to "Registration Confirmed". | To be filled | To be filled |
| TC-REG-02 | Registrations | Duplicate Expo Pass Block | 1. Re-send registration for already confirmed expo. | Handled safely; returns 409 "Already registered"; UI button remains confirmed. | To be filled | To be filled |
| TC-REG-03 | Registrations | Ended Expo Registration Block | 1. Attempt registration on an expo where endDate is in the past. | Server returns 400 "This expo has already ended"; UI button displays "Ended". | To be filled | To be filled |
| TC-REG-04 | Registrations | Register for Session | 1. Attendee registers for keynote session. | Session registration created; parent expo pass auto-created if missing. | To be filled | To be filled |
| TC-REG-05 | Registrations | Session Time Overlap Warning | 1. Register for a session that overlaps in time with another registered session. | Registration succeeds (201); warning toast displays: "This session overlaps with...". | To be filled | To be filled |
| TC-REG-06 | Registrations | Ended Session Registration Block | 1. Attempt registration on a session where endTime is in the past. | Server returns 400 "This session has already ended"; button displays "Ended". | To be filled | To be filled |
| TC-REG-07 | Registrations | Toggle Session Bookmark | 1. Click Bookmark on a session. | Bookmark status toggles to Bookmarked; persists in database and My Schedule. | To be filled | To be filled |
| TC-REG-08 | Registrations | Cancel Session Registration | 1. Click Cancel Registration on a registered session. | Registration record removed; session timetable slot freed up. | To be filled | To be filled |
| TC-REG-09 | Registrations | Double-Click Pending Guard | 1. Rapidly double-click Register button. | Button disables instantly during in-flight request; only one HTTP request sent. | To be filled | To be filled |

### Module 7: Exhibitor Directory & Profiles

| ID | Module | Test Case | Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-EXH-01 | Exhibitors | Browse Public Directory | 1. Open /exhibitors as guest visitor. | Directory loads approved exhibitors with logos, categories, and booth badges. | To be filled | To be filled |
| TC-EXH-02 | Exhibitors | Keyword Search | 1. Type "cloud" into exhibitor search field. | List filters in real time to matching companies (e.g., EPYC Systems, CloudBridge). | To be filled | To be filled |
| TC-EXH-03 | Exhibitors | Dynamic Category Filter | 1. Click a category button (e.g. "Food & Beverage"). | Directory filters to matching vendors; categories derive from live database records. | To be filled | To be filled |
| TC-EXH-04 | Exhibitors | View Profile Dossier | 1. Click View Profile on an exhibitor. | Dossier opens displaying company biography, products, website, and booth allocations. | To be filled | To be filled |
| TC-EXH-05 | Exhibitors | Contact Button Logged Out | 1. Unauthenticated visitor clicks Contact Exhibitor. | Navigates to /login with redirect parameter preserving prefilled message path. | To be filled | To be filled |

### Module 8: Messaging & Real-Time Communications

| ID | Module | Test Case | Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-MSG-01 | Messages | Attendee Messages Exhibitor | 1. Attendee sends message to exhibitor. | Message saved (201); message:new emitted; exhibitor unread badge increments. | To be filled | To be filled |
| TC-MSG-02 | Messages | Block Attendee-to-Attendee Message | 1. Attendee attempts to send message to another attendee via API. | Server returns 403 "Attendees may only message event organizers and exhibitors." | To be filled | To be filled |
| TC-MSG-03 | Messages | Block Self-Messaging | 1. User attempts to send message to own user ID. | Server returns 400 "You cannot message yourself." | To be filled | To be filled |
| TC-MSG-04 | Messages | Empty Message Body Validation | 1. Send message with empty body string. | Server returns 400 "Message body is required." | To be filled | To be filled |
| TC-MSG-05 | Messages | Mark Message Read | 1. Recipient opens message in inbox. | Message read flag updates to true; unread badge counter decrements. | To be filled | To be filled |
| TC-MSG-06 | Messages | Non-Recipient Mark Read (Anti-IDOR) | 1. User attempts to mark another user's message as read. | Server returns 403 "Not authorized to mark this message as read." | To be filled | To be filled |

### Module 9: Notifications & Reminders

| ID | Module | Test Case | Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-NOTIF-01 | Notifications | In-App Alert Reception | 1. Perform action that triggers notification (e.g. admin approves app). | Notification bell badge updates; toast notification renders. | To be filled | To be filled |
| TC-NOTIF-02 | Notifications | Mark All Read | 1. Click Mark all as read in notifications dropdown. | All notifications marked read (200); unread badge resets to 0. | To be filled | To be filled |
| TC-NOTIF-03 | Notifications | Automated 30-Min Session Reminder | 1. Register for session starting in 25 minutes.<br>2. Wait for scheduler execution. | Reminder notification dispatched: "Reminder: <Title> starts at <Time>". | To be filled | To be filled |
| TC-NOTIF-04 | Notifications | Reminder Flag Reset on Time Edit | 1. Session with reminderSent=true has its time updated by admin. | reminderSent resets to false so future reminder can fire. | To be filled | To be filled |

### Module 10: Feedback & Analytics

| ID | Module | Test Case | Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-FEED-01 | Feedback | Submit Feature Suggestion | 1. User submits feedback of type suggestion. | Feedback record created (201); confirmation alert renders. | To be filled | To be filled |
| TC-FEED-02 | Feedback | Short Message Rejection | 1. Submit feedback with text "abc" (<5 chars). | Server returns 400 validation error. | To be filled | To be filled |
| TC-FEED-03 | Feedback | Non-Admin View Feedback | 1. Attendee attempts GET /api/feedback. | Server returns 403 Forbidden. | To be filled | To be filled |
| TC-ANAL-01 | Analytics | Admin Analytics Dashboard | 1. Admin opens /admin/analytics. | Metric cards (Expos, Occupancy, Attendees) and Recharts render. | To be filled | To be filled |
| TC-ANAL-02 | Analytics | Non-Admin Access Block | 1. Attendee attempts GET /api/analytics/admin. | Server returns 403 Forbidden. | To be filled | To be filled |

### Module 11: Security, Role Guards & Resilience

| ID | Module | Test Case | Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-SEC-01 | Security | Attendee Accessing /admin | 1. Attendee types /admin in URL. | ProtectedRoute redirects to /unauthorized (403 page). | To be filled | To be filled |
| TC-SEC-02 | Security | Exhibitor Accessing /admin | 1. Exhibitor types /admin in URL. | ProtectedRoute redirects to /unauthorized. | To be filled | To be filled |
| TC-SEC-03 | Security | Unauthenticated Protected Route | 1. Guest visitor navigates to /schedule. | ProtectedRoute redirects to /login with state.from preserved. | To be filled | To be filled |
| TC-SEC-04 | Security | Malformed ObjectId Rejection | 1. Issue GET /api/expos/invalid-hex-id. | validateObjectId middleware catches and returns 400 "Invalid id". | To be filled | To be filled |
| TC-SEC-05 | Security | Database Outage 503 Shield | 1. Stop MongoDB service.<br>2. Make API call. | dbCheck middleware returns 503; client displays status banner. | To be filled | To be filled |
| TC-SEC-06 | Security | Session Token Retention on 503 | 1. Refresh page during database 503 outage. | AuthContext retains token in storage and renders Retry button; does not log out. | To be filled | To be filled |
| TC-SEC-07 | Security | Sanitized Public Projections | 1. Call GET /api/public/expos/:id unauthenticated. | Response omits email and phone fields of exhibitors and organizers. | To be filled | To be filled |

### Module 12: Responsive Layout & Mobile Usability

| ID | Module | Test Case | Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-RESP-01 | UI | Mobile Navigation Toggle | 1. View site at 375 px width.<br>2. Click Menu button. | Mobile drawer slides down; button toggles to Close; clicking link closes drawer. | To be filled | To be filled |
| TC-RESP-02 | UI | 320 px Grid Scaling | 1. View /expos and /exhibitors at 320 px width. | Cards scale via minmax(min(320px, 100%), 1fr); no horizontal overflow scrollbar. | To be filled | To be filled |
| TC-RESP-03 | UI | Touch Target Dimensions | 1. Inspect mobile navigation and buttons. | Touch targets have minimum height/width of 44 px. | To be filled | To be filled |
