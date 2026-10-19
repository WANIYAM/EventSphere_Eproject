# EventSphere Management (MERN) – Project Audit Plan

Prepared for a self-audit of the eProject against its brief, using Antigravity agents.

## 1. Purpose and Scope

Goal: verify that every functional and non-functional requirement in the EventSphere eProject brief is implemented, working, secure and documented, and produce evidence for each finding.

In scope: the MERN codebase (MongoDB, Express, React, Node.js), configuration, tests, documentation and the demo video.

Out of scope: the hardware section of the brief (Pentium 166, 128 MB RAM, Windows 2000) is outdated and cannot be met by a modern MERN stack. Mark it N/A and just document your real environment (OS, Node, MongoDB versions).

## 2. How to Run This Audit in Antigravity

1. Open the project root as a workspace in Antigravity.
2. Save this plan into the repo (for example `docs/AUDIT_PLAN.md`) so agents can read it.
3. Create an empty `audit/` folder. Every agent writes its findings there, one file per phase.
4. Run one agent per phase (use the Agent Manager so phases run in parallel where they are independent: phases 2, 3, 4 and 5 can run at the same time after phase 1).
5. Give every agent the same ground rules (section 3).
6. Run the app and tests yourself at least once. Agents can misread code, so spot-check at least 20% of their PASS verdicts by hand.
7. Merge everything in phase 9 into one final report.

## 3. Ground Rules for Every Agent (paste at the start of each prompt)

- You are an auditor, not a developer. Do not modify source code. Write only to `audit/`.
- For every requirement give a verdict: **PASS** (works end to end), **PARTIAL** (exists but incomplete or buggy), **FAIL** (missing), or **UNVERIFIED** (could not confirm).
- Every verdict must cite evidence: file path and line range, route, component name, or the command output you ran.
- A UI element with no working backend, or a route with no UI, is PARTIAL at best.
- Do not assume. If you cannot find it, say so.
- Finish with a table: ID | Requirement | Verdict | Evidence | Gap / Fix suggestion.

## 4. Phase 0 – Reconnaissance and Setup

Objective: understand the project before judging it.

| ID | Check |
| --- | --- |
| P0.1 | Folder structure: client vs server separation, sensible layout |
| P0.2 | `package.json` (both sides): dependencies, scripts, unused or vulnerable packages |
| P0.3 | `.env.example` present, no real secrets committed (check git history too) |
| P0.4 | README: install steps work from a clean clone |
| P0.5 | App starts with one documented command per side, no console errors |
| P0.6 | List all Mongoose models, all Express routes, all React pages and components |

Antigravity prompt:

> Read the whole repository. Produce `audit/00_inventory.md` containing: tech stack and versions, folder tree, every Mongoose model with fields, every API route (method, path, auth middleware, controller), every React route/page, and every environment variable. Flag anything that looks unused or duplicated. Do not judge requirements yet.

## 5. Phase 1 – Requirements Traceability Matrix

Objective: map each requirement in the brief to code. This is the core of the "is it complete?" question.

### 5.1 Functional requirements checklist

**User Authentication**

| ID | Requirement | What to look for |
| --- | --- | --- |
| F1.1 | Users can register and log in | Register/login pages, `/auth` routes, JWT or session issued |
| F1.2 | Three roles: admin/organizer, exhibitor, attendee, chosen at registration | `role` field in User model, role stored and returned |
| F1.3 | Forgot / reset password | Reset request, emailed token with expiry, reset form |
| F1.4 | Password encryption | bcrypt (or argon2) hashing with salt; no plain text anywhere |

**Admin / Organizer Dashboard**

| ID | Requirement | What to look for |
| --- | --- | --- |
| F2.1 | Create, edit, delete expos | Full CRUD API plus UI forms and confirm-delete |
| F2.2 | Expo details: title, date, location, description, theme | All fields in model, validated, editable |
| F2.3 | Allocate booth spaces on a floor plan | Booth model, floor plan UI, allocation action |
| F2.4 | View exhibitor registrations and applications | List with filters and status |
| F2.5 | Approve or reject exhibitor applications | Status change endpoint, UI buttons, exhibitor notified |
| F2.6 | Assign booths and manage booth details | Assignment logic, prevents double booking |
| F2.7 | Create and manage schedule with time slots and sessions | Session model, timetable UI |
| F2.8 | Assign speakers, topics, locations to sessions | Fields and selectors present |
| F2.9 | Edit and update the schedule | Update endpoint and UI, changes propagate |
| F2.10 | Reports: attendee engagement, booth traffic, session popularity | Aggregation queries, report page, export optional |
| F2.11 | Real-time analytics on expo performance | Live-updating charts or counters (sockets or polling) |

**Exhibitor Portal**

| ID | Requirement | What to look for |
| --- | --- | --- |
| F3.1 | Register for expos with company details, products/services, required documents | Application form, file upload for documents |
| F3.2 | Update profile: logo, description, contact info | Profile edit with image upload |
| F3.3 | View available booths on floor plan | Floor plan shows free vs taken |
| F3.4 | Select and reserve a booth | Reservation flow with conflict handling |
| F3.5 | Manage booth details: products/services, staff info | Editable booth page |
| F3.6 | Contact organizers/admins | Messaging or inquiry form with admin inbox |
| F3.7 | Interact with neighboring exhibitors | Messaging or contact exchange between exhibitors |

**Attendee Interface**

| ID | Requirement | What to look for |
| --- | --- | --- |
| F4.1 | View event details, schedule, exhibitor list, floor plans | Public or logged-in pages |
| F4.2 | Register for events, sessions, workshops | Registration endpoint, capacity checks, duplicate prevention |
| F4.3 | Search and filter exhibitors by category, product, keyword | Query params handled server-side, UI filters |
| F4.4 | View exhibitor profile and booth location on floor plan | Profile page linked to floor plan position |
| F4.5 | Chat or email exhibitors for inquiries/appointments | Chat (sockets) or email sending |
| F4.6 | Browse schedules, sessions, workshops | Schedule view |
| F4.7 | Bookmark or register for sessions | Bookmark model/field, toggle UI |
| F4.8 | Notifications or reminders for bookmarked sessions | In-app notifications, email or scheduled job |

**General System Features**

| ID | Requirement | What to look for |
| --- | --- | --- |
| F5.1 | Real-time updates for schedules, booth allocations, event changes | Socket.IO, SSE or polling visibly updating other users' screens |
| F5.2 | Feedback and support mechanism | Feedback form, stored and viewable by admin |

Antigravity prompt (run once per group, for example "User Authentication"):

> For each requirement ID in the group below, trace it through all layers: React page/component, API call, Express route and middleware, controller logic, Mongoose model. Run the relevant code paths if you can. Write `audit/01_functional_<group>.md` using the ground-rules table. Also test role access: for each feature state which role can use it, and check the server (not just the UI) enforces that.

### 5.2 Cross-cutting functional checks

| ID | Check |
| --- | --- |
| X1 | Role-based routing: an attendee cannot open admin pages by typing the URL |
| X2 | Every API route that changes data is authenticated and role-checked server-side |
| X3 | Input validation on server (not only client) for every form |
| X4 | Error and empty states in the UI (no data, failed request, 401/403/404) |
| X5 | Data relationships are consistent: deleting an expo handles its booths, sessions, registrations |
| X6 | No double-booking of a booth under concurrent requests |

## 6. Phase 2 – Non-Functional Requirements

| ID | Requirement | How to verify |
| --- | --- | --- |
| N1 | Response time 1–2 s | Measure key endpoints (login, expo list, schedule, search) with curl timing or a tool such as autocannon; check DB indexes and pagination |
| N2 | Scalability | No server-side in-memory state that breaks with 2 instances; pagination on lists; stateless auth |
| N3 | Hundreds of concurrent users | Load test (for example 200–500 virtual users on main read endpoints); record p95 latency and error rate |
| N4 | Horizontal scaling | Stateless API, config via env, optional Dockerfile/compose; sockets use a shared adapter if scaled (Redis) |
| N5 | Encryption at rest/in transit | Password hashing; HTTPS in deployment config; sensitive fields not logged |
| N6 | Secure authentication | JWT secret from env, token expiry, httpOnly cookies or safe storage, rate limiting on login and reset |
| N7 | Authorization | Users only access their own data (IDOR test: change an ID in a request) |
| N8 | GDPR and consent | Privacy policy page, consent checkbox at registration, ability to view/export/delete own data |
| N9 | Uptime 99% and backups | Health-check endpoint, documented backup approach (for example mongodump script or Atlas backups) |
| N10 | Usability and responsive design | Test at 375, 768, 1280 px; consistent navigation |
| N11 | Accessibility (WCAG) | Run Lighthouse and axe; check alt text, labels, contrast, keyboard navigation, focus states |
| N12 | Cross-browser | Manually test Chrome, Firefox, Safari (or WebKit), Edge |
| N13 | Mobile compatibility | Real device or emulator pass on all main flows |
| N14 | Logging and monitoring | Request logger (morgan/winston/pino), error logging, no secrets in logs |
| N15 | Test coverage | Unit, integration and end-to-end tests exist and pass (see phase 4) |
| N16 | Security testing | OWASP-style pass (see phase 3) |
| N17 | User documentation | Guides, FAQs, tutorials |
| N18 | Developer documentation | Setup, architecture, API reference, data model |
| N19 | Demo video | Video showing complete working of the application |

Antigravity prompt:

> Audit non-functional requirements N1–N19 using the checklist. Where a requirement can be measured (latency, Lighthouse, load), run the tool and paste the real numbers. Where it is a design property (stateless, indexes, validation), cite code. Write `audit/02_nonfunctional.md`.

## 7. Phase 3 – Security Audit

| ID | Check |
| --- | --- |
| S1 | Passwords hashed with bcrypt/argon2, adequate cost factor |
| S2 | JWT: strong secret in env, expiry set, verified on every protected route |
| S3 | Password reset tokens are random, single-use, short-lived, stored hashed |
| S4 | NoSQL injection: query inputs sanitised (for example express-mongo-sanitize), no raw `req.body` passed to queries |
| S5 | XSS: no `dangerouslySetInnerHTML` on user input, output encoded |
| S6 | CSRF protection if cookies are used |
| S7 | Helmet, CORS restricted to known origins, rate limiting |
| S8 | File uploads: type and size limits, safe filenames, not executable, stored outside web root or in cloud storage |
| S9 | Mass assignment: a user cannot set `role: admin` by editing the register request |
| S10 | IDOR and privilege escalation tests on every `:id` route |
| S11 | Secrets: none committed; run `npm audit` on both sides |
| S12 | Sensitive data never returned by APIs (password hashes, tokens) |

Antigravity prompt:

> Perform a read-only security review of this MERN app against S1–S12. Run `npm audit` in client and server. For each finding give severity (Critical/High/Medium/Low), the exact location, a proof-of-concept request described in words (do not attack any external system), and a recommended fix. Write `audit/03_security.md`.

## 8. Phase 4 – Testing and Quality

| ID | Check |
| --- | --- |
| T1 | Existing tests run with one command and pass |
| T2 | Unit tests: utilities, validators, models |
| T3 | Integration tests: API routes with a test database (supertest or similar) |
| T4 | End-to-end tests: critical journeys in Playwright or Cypress |
| T5 | Coverage report (target 70%+ on server logic) |
| T6 | Linting and formatting configured and clean |
| T7 | Code quality: dead code, duplicated logic, giant components, missing error handling, inconsistent naming |

Critical journeys to confirm end to end (manually or via E2E):

1. Exhibitor registers, applies to an expo, admin approves, exhibitor reserves a booth.
2. Attendee registers, browses schedule, bookmarks a session, receives a reminder.
3. Admin edits a session time and attendees see the change without refreshing.
4. Attendee searches exhibitors and messages one.
5. Forgot password, reset, log in with the new password.

Antigravity prompt:

> Run the existing test suites and report results and coverage. Then list which of the five critical journeys have no automated test, and write (in `audit/tests_proposed/`, not in src) Playwright specs for them. Write `audit/04_testing.md`.

## 9. Phase 5 – Data and Backend Review

| ID | Check |
| --- | --- |
| D1 | Models match the requirements (User, Expo, Booth, Exhibitor application, Session, Registration, Bookmark, Message, Feedback, Notification) |
| D2 | Indexes on fields used in search, filters and joins |
| D3 | Referential integrity and cascading behaviour |
| D4 | Unique constraints (email, one registration per user per session) |
| D5 | List endpoints paginated and sortable |
| D6 | Consistent API error format and HTTP status codes |
| D7 | Seed script or sample data available for demos |

## 10. Phase 6 – Frontend and UX Review

| ID | Check |
| --- | --- |
| U1 | Every requirement is reachable from the UI with clear navigation per role |
| U2 | Loading, empty and error states on all data views |
| U3 | Forms: validation messages, disabled submit while sending |
| U4 | Floor plan is interactive and clearly shows booth status |
| U5 | Real-time updates visible without refresh |
| U6 | Responsive layout at phone, tablet, desktop |
| U7 | Accessibility basics: labels, alt text, contrast, keyboard use, ARIA where needed |

## 11. Phase 7 – Deliverables and Documentation

The brief says to send complete documentation with source code, and requires a video.

| ID | Deliverable | Done? |
| --- | --- | --- |
| R1 | Complete, runnable source code (client and server) |  |
| R2 | User guide, FAQ, tutorials |  |
| R3 | Developer documentation: architecture, ER/data model, API reference, setup |  |
| R4 | Diagrams: system architecture, ER diagram, use cases, flowcharts |  |
| R5 | Test documentation and results |  |
| R6 | Demo video covering every role and the main features |  |
| R7 | README with environment and install steps |  |
| R8 | Real environment documented (OS, Node, MongoDB versions) in place of the outdated hardware list |  |

Antigravity prompt:

> Compare the project's documentation against R1–R8. For the API reference and data model, check them against the real code and list every route or field that is undocumented or documented wrongly. Write `audit/07_docs.md`.

## 12. Phase 8 – Manual Verification Pass (you do this)

Agents are good at code reading, weaker at real behaviour. Do a hands-on pass with three browser profiles (admin, exhibitor, attendee) at the same time:

1. Change something as admin (move a session, allocate a booth) and watch the other two profiles for live updates.
2. Try forbidden actions: attendee opening `/admin`, exhibitor editing another exhibitor's booth, changing a user ID in a request.
3. Submit bad input: empty forms, very long text, wrong file types, duplicate emails.
4. Try the same booth from two exhibitors at nearly the same time.
5. Refresh and navigate directly to deep links while logged in and logged out.
6. Confirm emails or notifications actually arrive (use Mailtrap or a similar sandbox).

## 13. Phase 9 – Consolidated Report

Antigravity prompt:

> Read all files in `audit/`. Produce `audit/FINAL_REPORT.md` with: (1) an executive summary, (2) completion percentage per area (functional, non-functional, security, testing, documentation) calculated as PASS = 1, PARTIAL = 0.5, FAIL and UNVERIFIED = 0, (3) the full requirement matrix with verdicts, (4) a prioritised defect list (Critical, High, Medium, Low) with file references, (5) a "must fix before submission" list, and (6) a "nice to have" list. Do not hide UNVERIFIED items.

### Suggested acceptance criteria

| Area | Target to call it complete |
| --- | --- |
| Functional F1–F5 | 100% PASS or PARTIAL with only minor gaps; no FAIL on core features (auth, expos, booths, schedule, registration) |
| Security | Zero Critical and zero High findings open |
| Non-functional | Measured results meet N1 and N3, or limits are documented honestly |
| Testing | All tests pass; the five critical journeys covered |
| Documentation | R1–R7 all present |

## 14. Common Gaps to Check First

These are the requirements most often missed or only half-built in this kind of project, so look at them early:

- Forgot/reset password with a real email flow and expiring token.
- Real-time updates that actually push to other users (not just refresh on reload).
- Notifications or reminders for bookmarked sessions.
- Exhibitor-to-exhibitor messaging and attendee-to-exhibitor chat.
- Real-time analytics and the three reports (engagement, booth traffic, session popularity).
- Floor plan that is interactive, not just a static image.
- Server-side role enforcement (not just hidden buttons).
- GDPR consent and data export/delete.
- Accessibility and cross-browser testing evidence.
- Developer and user documentation plus the demo video.

## 15. Audit Log Template

| ID | Requirement | Verdict | Evidence (file:line / output) | Gap | Fix | Owner | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| F1.1 | Register and login |  |  |  |  |  |  |
| F1.2 | Roles |  |  |  |  |  |  |
| … | … |  |  |  |  |  |  |
