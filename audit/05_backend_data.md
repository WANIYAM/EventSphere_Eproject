# Phase 5 – Data and Backend Architecture Review

**Auditor**: Antigravity Agent  
**Date**: 2026-10-17  
**Scope**: Data Models, Schema Design, Indexes, Referential Cascades, Unique Constraints, API Formatting (D1–D7)  
**Status**: Comprehensive Data & Backend Architecture Audit Complete  

---

## 1. Executive Summary & Verdict Statistics

Phase 5 evaluates the database schema architecture, MongoDB indexing strategies, cascading referential integrity, unique constraints, list query pagination, error response standards, and demo data seeding mechanisms across the MERN backend.

| ID | Data Architecture Check | Verdict | Score | Core Finding |
| :--- | :--- | :---: | :---: | :--- |
| **D1** | Domain models match requirements | **PASS** | 1.0 | All 10 domain entities cleanly modeled in Mongoose schemas |
| **D2** | Database indexing on filters & joins | **PARTIAL** | 0.5 | Only `Registration` and `User.email` indexed; foreign keys unindexed |
| **D3** | Referential integrity & cascades | **PARTIAL** | 0.5 | `deleteExpo` cascades to Booth/Session/App, but **omits Registration** |
| **D4** | Unique constraints enforcement | **PASS** | 1.0 | Email uniqueness & partial compound unique registration indexes |
| **D5** | List endpoints paginated & sortable | **PARTIAL** | 0.5 | Consistent default sorting present; **pagination completely missing** |
| **D6** | Consistent API error format & codes | **PASS** | 1.0 | Uniform `{ message }` JSON envelope with semantic HTTP status codes |
| **D7** | Seed scripts & demo sample data | **PASS** | 1.0 | 873-line deterministic seed generator (`npm run seed:demo`) |
| **TOTAL** | **7 Checks** | **4 PASS, 3 PARTIAL, 0 FAIL** | **5.5 / 7.0 (78.6%)** | — |

---

## 2. In-Depth Technical Assessment by Check (D1–D7)

### D1 – Domain Models Match the Requirements
- **Verdict**: **PASS**
- **Analysis**:
  The application requires ten core domain entities: User, Expo, Booth, Exhibitor application, Session, Registration, Bookmark, Message, Feedback, and Notification. Every required entity is implemented with clear Mongoose schemas:

| Entity | Model File | Schema Fields & Constraints | Schema Verdict |
| :--- | :--- | :--- | :---: |
| **User** | [`server/models/User.js`](file:///d:/EprojectMern/EventSphere_Eproject/server/models/User.js) | `name`, `email` (unique), `password`, `role` (enum: admin, exhibitor, attendee), `company`, `phone`, `website`, `category`, `logo`, `resetToken`, `resetTokenExpire`, `timestamps`. | **PASS** |
| **Expo** | [`server/models/Expo.js`](file:///d:/EprojectMern/EventSphere_Eproject/server/models/Expo.js) | `title`, `description`, `theme`, `location`, `startDate`, `endDate`, `image`, `createdBy` ($\to$ User), `timestamps`. | **PASS** |
| **Booth** | [`server/models/Booth.js`](file:///d:/EprojectMern/EventSphere_Eproject/server/models/Booth.js) | `expo` ($\to$ Expo), `boothNumber`, `size`, `price`, `status` (available, reserved, booked), `exhibitor` ($\to$ User), `details`, `staff: [{ name, role }]`, `timestamps`. | **PASS** |
| **Application** | [`server/models/Application.js`](file:///d:/EprojectMern/EventSphere_Eproject/server/models/Application.js) | `expo` ($\to$ Expo), `exhibitor` ($\to$ User), `companyName`, `products`, `documents: [String]`, `status` (pending, approved, rejected), `booth` ($\to$ Booth), `timestamps`. | **PASS** |
| **Session** | [`server/models/Session.js`](file:///d:/EprojectMern/EventSphere_Eproject/server/models/Session.js) | `expo` ($\to$ Expo), `title`, `speaker`, `topic`, `location`, `startTime`, `endTime`, `reminderSent` (bool), `timestamps`. | **PASS** |
| **Registration & Bookmark** | [`server/models/Registration.js`](file:///d:/EprojectMern/EventSphere_Eproject/server/models/Registration.js) | `user` ($\to$ User), `expo` ($\to$ Expo), `session` ($\to$ Session), `type` (expo, session), `registered` (bool), `bookmarked` (bool), `timestamps`. Unified model for registrations and bookmarks. | **PASS** |
| **Message** | [`server/models/Message.js`](file:///d:/EprojectMern/EventSphere_Eproject/server/models/Message.js) | `sender` ($\to$ User), `receiver` ($\to$ User), `subject`, `body`, `read` (bool), `timestamps`. | **PASS** |
| **Feedback** | [`server/models/Feedback.js`](file:///d:/EprojectMern/EventSphere_Eproject/server/models/Feedback.js) | `user` ($\to$ User), `type` (suggestion, issue), `message`, `timestamps`. | **PASS** |
| **Notification** | [`server/models/Notification.js`](file:///d:/EprojectMern/EventSphere_Eproject/server/models/Notification.js) | `user` ($\to$ User), `message`, `link`, `type`, `read` (bool), `timestamps`. | **PASS** |

- **Architectural Note on Bookmark**: Rather than creating a redundant separate collection with identical foreign keys, the project implements a clean unified `Registration` schema where `bookmarked` and `registered` flags operate independently.

---

### D2 – Database Indexing on Search, Filters, and Joins
- **Verdict**: **PARTIAL**
- **Analysis**:
  - *Existing Indexes*:
    - `User.js`: `email` has a unique index (`{ email: 1 }, { unique: true }`).
    - `Registration.js`: Defines two partial compound unique indexes:
      ```javascript
      registrationSchema.index({ user: 1, expo: 1 }, { unique: true, partialFilterExpression: { type: "expo" } });
      registrationSchema.index({ user: 1, session: 1 }, { unique: true, partialFilterExpression: { type: "session" } });
      ```
  - *Missing Critical Indexes*:
    - **Foreign Keys**: High-frequency populate and join keys lack indexes, triggering full collection scans (`COLLSCAN`):
      - `Booth.expo`: Queried on every floor plan load (`Booth.find({ expo: id })`).
      - `Session.expo`: Queried on every timetable load (`Session.find({ expo: id })`).
      - `Application.expo` and `Application.exhibitor`: Queried on every application review.
      - `Message.receiver` and `Message.sender`: Queried on every inbox and sent message load.
      - `Notification.user`: Queried on every notification bell render.
    - **Filter & Sort Keys**:
      - `Session.startTime`: Queried every 60 seconds by background reminder cron (`Session.find({ startTime: ... })`).
      - `Booth.status`: Filtered repeatedly to find available booths.
      - `Expo.startDate`: Sorted on every public expo query.
      - `Message ({ receiver: 1, read: 1 })`: Queried on every route change for unread badge count.
- **Fix Suggestion**: Add the following compound index definitions to schemas:
  ```javascript
  // In Booth.js:
  boothSchema.index({ expo: 1, status: 1 });
  boothSchema.index({ expo: 1, boothNumber: 1 }, { unique: true });

  // In Session.js:
  sessionSchema.index({ expo: 1, startTime: 1 });

  // In Message.js:
  messageSchema.index({ receiver: 1, read: 1 });
  messageSchema.index({ sender: 1, createdAt: -1 });

  // In Notification.js:
  notificationSchema.index({ user: 1, read: 1 });
  ```

---

### D3 – Referential Integrity & Cascading Behaviour
- **Verdict**: **PARTIAL**
- **Analysis**:
  - *Session Cascade Deletion (PASS)*: In [`sessionController.js:L155-L158`](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/sessionController.js#L155-L158):
    ```javascript
    await Registration.deleteMany({ session: sessionId });
    await session.deleteOne();
    ```
    Properly removes all attendee registrations referencing the deleted session before removing the session document itself.
  - *Application Rejection Booth Release (PASS)*: In [`applicationController.js:L109-L118`](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/applicationController.js#L109-L118), rejecting an application releases any reserved booth back to `available` and clears `booth.exhibitor`.
  - *Expo Cascade Deletion (PARTIAL / DEFECT)*: In [`expoController.js:L258-L261`](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/expoController.js#L258-L261):
    ```javascript
    await Booth.deleteMany({ expo: expoId });
    await Application.deleteMany({ expo: expoId });
    await Session.deleteMany({ expo: expoId });
    await expo.deleteOne();
    ```
    **Critical Omission**: It deletes Booths, Applications, and Sessions, but **fails to delete `Registration` documents**!
    When an expo is deleted:
    - All attendee `Registration` records with `expo: expoId` remain in MongoDB as orphaned documents.
    - When an attendee calls `GET /api/registrations/my`, Mongoose populates `expo`, which resolves to `null`.
    - This forced the frontend in [`MySchedule.jsx:L52`](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/attendee/MySchedule.jsx#L52) to defensively add `Boolean(r.expo)` to prevent UI crashes.
- **Fix Suggestion**: Add `await Registration.deleteMany({ expo: expoId });` inside `deleteExpo()`.

---

### D4 – Unique Constraints Enforcement
- **Verdict**: **PASS**
- **Analysis**:
  - *User Email*: Enforced by MongoDB unique index `email: { type: String, required: true, unique: true }` plus pre-check in `authController.register` (`User.findOne({ email })`).
  - *One Expo Registration Per Attendee*: Enforced by partial compound unique index `{ user: 1, expo: 1 }` where `type: "expo"`, plus runtime check returning `409 Conflict` if existing.
  - *One Session Registration Per Attendee*: Enforced by partial compound unique index `{ user: 1, session: 1 }` where `type: "session"`, plus runtime check returning `409 Conflict`.
  - *Duplicate Application Prevention*: In [`applicationController.js:L17-L24`](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/applicationController.js#L17-L24), `Application.findOne({ expo, exhibitor: req.user._id })` blocks duplicate exhibitor submissions for the same expo.
  - *Booth Number per Expo*: Currently relies on auto-generation loop. It should have a unique compound index `{ expo: 1, boothNumber: 1 }` to prevent manual duplicate creation.

---

### D5 – List Endpoints Paginated and Sortable
- **Verdict**: **PARTIAL**
- **Analysis**:
  - *Sorting (PASS)*: All major list queries specify explicit sorting:
    - `GET /api/expos`: `.sort({ startDate: 1 })`
    - `GET /api/applications`: `.sort({ createdAt: -1 })`
    - `GET /api/applications/my`: `.sort({ createdAt: -1 })`
    - `GET /api/expos/:expoId/booths`: `.sort({ boothNumber: 1 })`
    - `GET /api/expos/:expoId/sessions`: `.sort({ startTime: 1 })`
    - `GET /api/messages/inbox`: `.sort({ createdAt: -1 })`
    - `GET /api/messages/sent`: `.sort({ createdAt: -1 })`
    - `GET /api/users`: `.sort({ name: 1 })`
    - `GET /api/feedback`: `.sort({ createdAt: -1 })`
    - `GET /api/registrations/my`: `.sort({ createdAt: -1 })`
  - *Pagination (FAIL)*:
    - **No endpoint accepts `page`, `limit`, or `skip` parameters.**
    - Every list route loads the full dataset into Node memory and serializes it to JSON.
    - Only `notificationController.js:L7` includes a hardcoded `.limit(50)` without pagination cursor controls.
- **Fix Suggestion**: Implement a standard pagination helper:
  ```javascript
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Model.find(query).sort(sort).skip(skip).limit(limit),
    Model.countDocuments(query)
  ]);
  return res.json({ data, total, page, totalPages: Math.ceil(total / limit) });
  ```

---

### D6 – Consistent API Error Format and HTTP Status Codes
- **Verdict**: **PASS**
- **Analysis**:
  - *Centralized Error Handling*: [`server/server.js:L68-L88`](file:///d:/EprojectMern/EventSphere_Eproject/server/server.js#L68-L88) catches all unhandled exceptions:
    - `err.name === "CastError"` $\to$ returns HTTP 400 with `{ message: "Invalid id" }`.
    - `err.name === "ValidationError"` $\to$ returns HTTP 400 with validation message.
    - Server exceptions $\to$ sanitized to HTTP 500 `{ message: "Something went wrong" }`.
  - *Payload Consistency*: Every error returned across all 14 controllers conforms to the standard JSON structure:
    ```json
    {
      "message": "Descriptive error explanation"
    }
    ```
  - *RESTful HTTP Status Codes*:
    - `200 OK`: Successful retrieval / mutation.
    - `201 Created`: Resource successfully created (`register`, `createExpo`, `createSession`, `createApplication`, `sendMessage`).
    - `400 Bad Request`: Validation errors, overlapping time slots, invalid role choice.
    - `401 Unauthorized`: Token missing, expired, or invalid.
    - `403 Forbidden`: Role permission denied or non-owner resource access.
    - `404 Not Found`: Entity not found.
    - `409 Conflict`: Duplicate expo/session registration (`error.code === 11000`).
    - `503 Service Unavailable`: MongoDB disconnected ([`server/middleware/dbCheck.js`](file:///d:/EprojectMern/EventSphere_Eproject/server/middleware/dbCheck.js)).

---

### D7 – Seed Script and Sample Data for Demos
- **Verdict**: **PASS**
- **Analysis**:
  - Two dedicated seeding scripts exist in `server/seed/`:
    1. [`createAdmin.js`](file:///d:/EprojectMern/EventSphere_Eproject/server/seed/createAdmin.js): Ensures existence of the Super Admin account (`admin@eventsphere.com`).
    2. [`seedDemoData.js`](file:///d:/EprojectMern/EventSphere_Eproject/server/seed/seedDemoData.js): An **873-line deterministic seed engine** that populates:
       - 1 Super Admin
       - 20 realistic Exhibitor companies with industry categories, descriptions, and mock logos
       - 50 Attendees
       - 4 Trade Shows / Expos with realistic dates (relative to current date using UTC offsets)
       - Over 80 Booths across the expos with accurate statuses (`available`, `reserved`, `booked`)
       - Complete Session Keynote Schedules with non-overlapping room locations
       - Exhibitor applications with realistic company profiles and document links
       - Realistic Attendee session registrations and bookmarks
       - Multi-user threaded chat messages between attendees, exhibitors, and organizers
       - In-app notification records and categorized user feedback
  - Uses deterministic seed generator `mulberry32(20261013)` so identical realistic data is produced consistently on every run.
  - Guarded against production accidents: `if (process.env.NODE_ENV === "production") process.exit(1)`.

---

## 3. Master Data & Backend Compliance Table (D1–D7)

| ID | Check | Verdict | Evidence / Code Citation | Defect / Recommended Action |
| --- | --- | :---: | --- | --- |
| **D1** | Models match requirements | **PASS** | 9 Mongoose model files in `server/models/` | Clean schema definitions with proper Mongoose types and relations. |
| **D2** | Indexes on search, filters, joins | **PARTIAL** | Only `User.email` & `Registration` indexes exist | Add compound indexes on `Booth (expo, status)`, `Session (expo, startTime)`, and `Message (receiver, read)`. |
| **D3** | Referential integrity & cascading | **PARTIAL** | [`expoController.js:258`](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/expoController.js#L258) omits `Registration` | Add `await Registration.deleteMany({ expo: expoId })` inside `deleteExpo()`. |
| **D4** | Unique constraints | **PASS** | [`Registration.js:18`](file:///d:/EprojectMern/EventSphere_Eproject/server/models/Registration.js#L18), [`User.js:7`](file:///d:/EprojectMern/EventSphere_Eproject/server/models/User.js#L7) | Compound unique partial indexes prevent duplicate registrations. |
| **D5** | Pagination & sorting | **PARTIAL** | Default `.sort()` present; 0 endpoints paginated | Add `page` and `limit` query parameters with skip-limit logic to all list endpoints. |
| **D6** | Consistent API error format & codes | **PASS** | [`server.js:68-88`](file:///d:/EprojectMern/EventSphere_Eproject/server/server.js#L68-L88) centralized handler | Uniform `{ message }` envelope with accurate HTTP status codes (200, 201, 400, 401, 403, 404, 409, 503). |
| **D7** | Seed script & demo data | **PASS** | [`seedDemoData.js`](file:///d:/EprojectMern/EventSphere_Eproject/server/seed/seedDemoData.js) (873 lines) | Comprehensive, deterministic demo data generator covering all roles and models. |

---

*End of Phase 5 — Data and Backend Architecture Review complete.*
