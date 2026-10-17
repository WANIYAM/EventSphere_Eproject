# Phase 1 – Requirements Traceability Matrix

**Auditor**: Antigravity Agent  
**Date**: 2026-10-17  
**Scope**: Complete Functional & Cross-Cutting Requirements Traceability (Brief vs Codebase)  
**Status**: Comprehensive Forensic Audit Complete  

---

## 1. Executive Summary & Verdict Breakdown

Every functional requirement and cross-cutting check from the EventSphere eProject brief was traced end-to-end through all architectural layers: React pages/components, client API service, Express routes and middleware, controller business logic, Socket.IO event buses, and Mongoose database schemas.

| Category | Total Checks | PASS | PARTIAL | FAIL | UNVERIFIED |
| --- | :---: | :---: | :---: | :---: | :---: |
| **User Authentication (F1.1–F1.4)** | 4 | 2 | 2 | 0 | 0 |
| **Admin / Organizer Dashboard (F2.1–F2.11)** | 11 | 9 | 2 | 0 | 0 |
| **Exhibitor Portal (F3.1–F3.7)** | 7 | 7 | 0 | 0 | 0 |
| **Attendee Interface (F4.1–F4.8)** | 8 | 5 | 3 | 0 | 0 |
| **General System Features (F5.1–F5.2)** | 2 | 1 | 1 | 0 | 0 |
| **Cross-Cutting Functional Checks (X1–X6)** | 6 | 4 | 2 | 0 | 0 |
| **TOTAL** | **38** | **28 (73.7%)** | **10 (26.3%)** | **0 (0.0%)** | **0 (0.0%)** |

### Key Strengths Discovered
1. **Core Workflows Functional End-to-End**: Full CRUD for Expos, Sessions, Booth allocations, Exhibitor applications, Attendee registrations, and In-app user messaging are fully wired and functional across both UI and API.
2. **Server-Side Authorization**: Roles are enforced rigorously on the Express layer via `protect` and `authorize(...)` middleware, not solely on the client side.
3. **Real-Time Synchronisation**: Socket.IO events (`booth:updated`, `schedule:updated`, `message:new`, `notification:new`) automatically trigger reactive UI refreshes across multi-user sessions without manual page reloads.

### Primary Gaps & Vulnerabilities
1. **F1.2 (Role Registration)**: Admin role is blocked at registration for security reasons and must be seeded; user can only register as `attendee` or `exhibitor`.
2. **F1.3 (Password Reset)**: Reset link is returned in JSON response and rendered in UI ("Demo Mode"); no actual SMTP/email provider is integrated.
3. **F2.10 / F2.11 (Analytics & Reports)**: Attendance breakdown uses hardcoded percentage multipliers (`* 0.45`, `* 0.35`, `* 0.20`) with mock fallbacks; booth traffic is not recorded in DB; charts load once on mount without live socket subscription.
4. **F4.2 (Capacity Checks)**: Neither `Expo` nor `Session` models have a `capacity` / `maxAttendees` field; registration endpoints do not check capacity limits.
5. **F4.8 (Bookmark Reminders)**: `server/utils/reminders.js` queries `{ session: session._id, registered: true }`, completely excluding attendees who only bookmarked the session.
6. **F5.1 (Real-Time Expo Changes)**: `expoController.js` creates, updates, and deletes expos without emitting any Socket.IO events (`expo:updated`).
7. **X5 (Cascade Delete Inconsistency)**: `deleteExpo` cascades to `Booth`, `Application`, and `Session`, but **omits** `Registration`, creating orphaned attendee registration records in MongoDB.
8. **X6 (Concurrent Booth Double-Booking)**: `reserveBooth` and `assignBooth` read then save without atomic operations (`findOneAndUpdate` with status filter) or MongoDB transactions, leaving a race condition window for double-booking.

---

## 2. Forensic Traceability by Functional Area

### 2.1 User Authentication

#### F1.1 – Users can register and log in
- **Verdict**: **PASS**
- **Traceability**:
  - *UI / Client*: [client/src/pages/Register.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/Register.jsx#L21-L95), [client/src/pages/Login.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/Login.jsx#L18-L70), [client/src/context/AuthContext.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/context/AuthContext.jsx#L60-L100).
  - *API Client*: `api.post("/auth/register", data)` and `api.post("/auth/login", data)` in `AuthContext.jsx`.
  - *Route & Middleware*: [server/routes/authRoutes.js](file:///d:/EprojectMern/EventSphere_Eproject/server/routes/authRoutes.js#L12-L13) (`POST /register`, `POST /login`). No auth required.
  - *Controller*: [server/controllers/authController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/authController.js#L12-L96) (`register`, `login`). Issues signed 7-day JWT token via `generateToken(user._id)`.
  - *Model*: [server/models/User.js](file:///d:/EprojectMern/EventSphere_Eproject/server/models/User.js#L4-L38).
- **Role Access**: Public / unauthenticated.
- **Evidence**: `register()` validates name, email format, minimum 6-character password, checks for duplicate email in MongoDB, hashes password via Mongoose pre-save hook, creates user, and returns JWT with user object `{ id, name, email, role }`. `login()` finds user by email, executes `user.matchPassword()`, and returns token.

---

#### F1.2 – Three roles: admin/organizer, exhibitor, attendee, chosen at registration
- **Verdict**: **PARTIAL**
- **Traceability**:
  - *UI / Client*: [client/src/pages/Register.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/Register.jsx#L211-L260). Only provides two selectable role buttons: "Attendee Pass" and "Exhibitor Pass".
  - *Controller*: [server/controllers/authController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/authController.js#L30-L34):
    ```javascript
    const userRole = role || "attendee";
    if (userRole === "admin" || !["exhibitor", "attendee"].includes(userRole)) {
      return res.status(400).json({ message: "Invalid role. Only exhibitor or attendee allowed" });
    }
    ```
  - *Model*: [server/models/User.js](file:///d:/EprojectMern/EventSphere_Eproject/server/models/User.js#L9-L13) defines `enum: ["admin", "exhibitor", "attendee"]`.
  - *Seeding*: Admin is created strictly out-of-band via CLI scripts [server/seed/createAdmin.js](file:///d:/EprojectMern/EventSphere_Eproject/server/seed/createAdmin.js) and [server/seed/seedDemoData.js](file:///d:/EprojectMern/EventSphere_Eproject/server/seed/seedDemoData.js).
- **Role Access**: Anyone registering can only choose `attendee` or `exhibitor`.
- **Gap / Justification**: The brief states: *"Three roles: admin/organizer, exhibitor, attendee, chosen at registration"*. The codebase deliberately blocks `admin` registration at the API level to prevent mass assignment / privilege escalation, which is a security best practice, but strictly deviates from the brief's literal requirement.
- **Fix Suggestion**: If the evaluator requires 3 roles at registration, add a guarded organizer signup with an "Organizer Invitation Code" or toggle for academic evaluation.

---

#### F1.3 – Forgot / reset password
- **Verdict**: **PARTIAL**
- **Traceability**:
  - *UI / Client*: [client/src/pages/ForgotPassword.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/ForgotPassword.jsx#L14-L28), [client/src/pages/ResetPassword.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/ResetPassword.jsx#L16-L30).
  - *API Client*: `api.post("/auth/forgot-password", { email })` and `api.put("/auth/reset-password/:token", { password })`.
  - *Route & Middleware*: [server/routes/authRoutes.js](file:///d:/EprojectMern/EventSphere_Eproject/server/routes/authRoutes.js#L16-L17).
  - *Controller*: [server/controllers/authController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/authController.js#L120-L190) (`forgotPassword`, `resetPassword`).
  - *Model*: [server/models/User.js](file:///d:/EprojectMern/EventSphere_Eproject/server/models/User.js#L20-L21) (`resetToken`, `resetTokenExpire`).
- **Role Access**: Public / unauthenticated.
- **Gap**: The brief requires: *"Reset request, emailed token with expiry, reset form"*. In `authController.js` lines 146-153, the raw token and complete reset link are returned directly in the HTTP JSON response and printed to stdout. `ForgotPassword.jsx` displays a yellow neo-brutal "Demo Mode Reset Link" box directly on the screen. No email transport (Nodemailer, SendGrid, AWS SES) is configured.
- **Fix Suggestion**: Integrate `nodemailer` using an Ethereal/Mailtrap test SMTP service or actual SMTP credentials in `.env`, and only return generic success messages in the API response.

---

#### F1.4 – Password encryption
- **Verdict**: **PASS**
- **Traceability**:
  - *Model*: [server/models/User.js](file:///d:/EprojectMern/EventSphere_Eproject/server/models/User.js#L26-L36):
    ```javascript
    userSchema.pre("save", async function () {
      if (!this.isModified("password")) return;
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    });
    userSchema.methods.matchPassword = async function (enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.password);
    };
    ```
  - *Controller*: [server/controllers/authController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/authController.js#L79-L81,L103) (`select("-password")`), [server/controllers/profileController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/profileController.js#L7), [server/controllers/userController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/userController.js#L11-L13).
  - *Middleware*: [server/middleware/authMiddleware.js](file:///d:/EprojectMern/EventSphere_Eproject/server/middleware/authMiddleware.js#L21) (`select("-password")`).
- **Evidence**: `bcryptjs` with salt round 10 is used automatically on save. Passwords are never stored in plain text. All user queries explicitly omit `-password`.

---

### 2.2 Admin / Organizer Dashboard

#### F2.1 – Create, edit, delete expos
- **Verdict**: **PASS**
- **Traceability**:
  - *UI / Client*: [client/src/pages/admin/AdminExpos.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/admin/AdminExpos.jsx#L20-L150). Form for creation and modal/inline edit, plus `window.confirm` for delete.
  - *API Client*: `api.get("/expos")`, `api.post("/expos", formData)`, `api.put("/expos/:id", formData)`, `api.delete("/expos/:id")`.
  - *Route & Middleware*: [server/routes/expoRoutes.js](file:///d:/EprojectMern/EventSphere_Eproject/server/routes/expoRoutes.js#L13-L20) (`POST /`, `PUT /:id`, `DELETE /:id` guarded by `protect, authorize("admin")`).
  - *Controller*: [server/controllers/expoController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/expoController.js#L8-L85,L193-L266) (`createExpo`, `updateExpo`, `deleteExpo`).
  - *Model*: [server/models/Expo.js](file:///d:/EprojectMern/EventSphere_Eproject/server/models/Expo.js).
- **Role Access**: Admin only (server returns 401 if unauthenticated, 403 if attendee/exhibitor).
- **Evidence**: Verified end-to-end. File uploads handled with Multer. Date overlap validation present. Auto-generates initial booths upon creation.

---

#### F2.2 – Expo details: title, date, location, description, theme
- **Verdict**: **PASS**
- **Traceability**:
  - *UI / Client*: [client/src/pages/admin/AdminExpos.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/admin/AdminExpos.jsx#L220-L340).
  - *Controller*: [server/controllers/expoController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/expoController.js#L10-L61,L227-L238).
  - *Model*: [server/models/Expo.js](file:///d:/EprojectMern/EventSphere_Eproject/server/models/Expo.js#L4-L13) has `title`, `description`, `theme`, `location`, `startDate`, `endDate`, `image`, `createdBy`.
- **Role Access**: Admin (edit/create), Public (read).
- **Evidence**: All 5 requested fields (`title`, `date`, `location`, `description`, `theme`) plus banner image are fully implemented in model, controller validations, edit forms, and public exhibition pages.

---

#### F2.3 – Allocate booth spaces on a floor plan
- **Verdict**: **PASS**
- **Traceability**:
  - *UI / Client*: [client/src/pages/admin/AdminBooths.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/admin/AdminBooths.jsx#L35-L140). Visual grid representing floor plan with status colors (green for available, yellow for reserved, red for booked).
  - *API Client*: `api.get("/expos/:id/booths")`, `api.put("/booths/:id/assign", { exhibitorId })`, `api.put("/booths/:id/release")`, `api.put("/booths/:id/confirm")`.
  - *Route & Middleware*: [server/routes/boothRoutes.js](file:///d:/EprojectMern/EventSphere_Eproject/server/routes/boothRoutes.js#L14-L18). Guarded by `protect, authorize("admin")`.
  - *Controller*: [server/controllers/boothController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/boothController.js#L44-L127,L213-L241) (`assignBooth`, `releaseBooth`, `confirmBooth`).
  - *Model*: [server/models/Booth.js](file:///d:/EprojectMern/EventSphere_Eproject/server/models/Booth.js#L4-L24).
- **Role Access**: Admin only.
- **Evidence**: Floor plan visualizer maps booth numbers, allows clicking an available booth, selecting an approved exhibitor from a dropdown, and persisting assignment with real-time socket emit (`booth:updated`).

---

#### F2.4 – View exhibitor registrations and applications
- **Verdict**: **PASS**
- **Traceability**:
  - *UI / Client*: [client/src/pages/admin/AdminApplications.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/admin/AdminApplications.jsx#L25-L95). Table with status filter tabs (All, Pending, Approved, Rejected) and Expo filter dropdown.
  - *API Client*: `api.get("/applications?status=...&expo=...")`.
  - *Route & Middleware*: [server/routes/applicationRoutes.js](file:///d:/EprojectMern/EventSphere_Eproject/server/routes/applicationRoutes.js#L14) (`GET /`, `protect, authorize("admin")`).
  - *Controller*: [server/controllers/applicationController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/applicationController.js#L72-L90) (`getAllApplications`).
  - *Model*: [server/models/Application.js](file:///d:/EprojectMern/EventSphere_Eproject/server/models/Application.js).
- **Role Access**: Admin only.
- **Evidence**: Populates `exhibitor` (name, email, company, phone), `expo` (title, dates, location), and `booth` (boothNumber, size, price). Documents uploaded by exhibitors are viewable via download links.

---

#### F2.5 – Approve or reject exhibitor applications
- **Verdict**: **PASS**
- **Traceability**:
  - *UI / Client*: [client/src/pages/admin/AdminApplications.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/admin/AdminApplications.jsx#L60-L85). Action buttons "Approve" (green) and "Reject" (red) with confirmation prompt.
  - *API Client*: `api.put("/applications/:id/status", { status })`.
  - *Route & Middleware*: [server/routes/applicationRoutes.js](file:///d:/EprojectMern/EventSphere_Eproject/server/routes/applicationRoutes.js#L15) (`PUT /:id/status`, `protect, authorize("admin")`).
  - *Controller*: [server/controllers/applicationController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/applicationController.js#L94-L133) (`updateApplicationStatus`).
- **Role Access**: Admin only.
- **Evidence**: Validates status against `["approved", "rejected"]`. If rejected, any associated booth is automatically released (`booth.status = "available"`). Dispatches in-app notification to the exhibitor via `createNotification`.

---

#### F2.6 – Assign booths and manage booth details
- **Verdict**: **PASS**
- **Traceability**:
  - *UI / Client*: [client/src/pages/admin/AdminBooths.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/admin/AdminBooths.jsx#L90-L150).
  - *API Client*: `api.put("/booths/:id", { size, price, details, status })`, `api.put("/booths/:id/assign", { exhibitorId })`.
  - *Route & Middleware*: [server/routes/boothRoutes.js](file:///d:/EprojectMern/EventSphere_Eproject/server/routes/boothRoutes.js#L13-L15). Guarded by `protect, authorize("admin")`.
  - *Controller*: [server/controllers/boothController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/boothController.js#L21-L91) (`updateBooth`, `assignBooth`).
  - *Model*: [server/models/Booth.js](file:///d:/EprojectMern/EventSphere_Eproject/server/models/Booth.js).
- **Role Access**: Admin only.
- **Evidence**: Admin can edit booth dimensions (`size`), rental cost (`price`), description (`details`), and assign directly to approved exhibitors. Prevents assigning booths that are not in `available` state.

---

#### F2.7 – Create and manage schedule with time slots and sessions
- **Verdict**: **PASS**
- **Traceability**:
  - *UI / Client*: [client/src/pages/admin/AdminSessions.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/admin/AdminSessions.jsx#L20-L115). Session builder with time pickers and timetable view.
  - *API Client*: `api.get("/expos/:id/sessions")`, `api.post("/sessions", payload)`, `api.delete("/sessions/:id")`.
  - *Route & Middleware*: [server/routes/sessionRoutes.js](file:///d:/EprojectMern/EventSphere_Eproject/server/routes/sessionRoutes.js#L9-L13). Guarded by `protect, authorize("admin")`.
  - *Controller*: [server/controllers/sessionController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/sessionController.js#L8-L55,L131-L179) (`createSession`, `deleteSession`).
  - *Model*: [server/models/Session.js](file:///d:/EprojectMern/EventSphere_Eproject/server/models/Session.js).
- **Role Access**: Admin only.
- **Evidence**: Enforces `endTime > startTime`. Server-side validation detects room/location scheduling conflicts. Deleting a session cascade-deletes attendee session registrations and dispatches notifications via `notifyMany`.

---

#### F2.8 – Assign speakers, topics, locations to sessions
- **Verdict**: **PASS**
- **Traceability**:
  - *UI / Client*: [client/src/pages/admin/AdminSessions.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/admin/AdminSessions.jsx#L140-L210).
  - *Controller*: [server/controllers/sessionController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/sessionController.js#L10-L47,L97-L103).
  - *Model*: [server/models/Session.js](file:///d:/EprojectMern/EventSphere_Eproject/server/models/Session.js#L8-L10) has `speaker: String`, `topic: String`, `location: String`.
- **Role Access**: Admin only.
- **Evidence**: Dedicated input fields and validation for speaker, presentation topic, and physical location/stage. Displayed in session list and attendee timetables.

---

#### F2.9 – Edit and update the schedule
- **Verdict**: **PASS**
- **Traceability**:
  - *UI / Client*: [client/src/pages/admin/AdminSessions.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/admin/AdminSessions.jsx#L70-L105).
  - *API Client*: `api.put("/sessions/:id", payload)`.
  - *Route & Middleware*: [server/routes/sessionRoutes.js](file:///d:/EprojectMern/EventSphere_Eproject/server/routes/sessionRoutes.js#L12) (`PUT /:id`, `protect, authorize("admin")`).
  - *Controller*: [server/controllers/sessionController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/sessionController.js#L59-L127) (`updateSession`).
- **Role Access**: Admin only.
- **Evidence**: Emits `emitToAll("schedule:updated", { expoId })` over Socket.IO so all clients viewing the schedule update live without refresh. Dispatches notifications to registered attendees informing them of changes.

---

#### F2.10 – Reports: attendee engagement, booth traffic, session popularity
- **Verdict**: **PARTIAL**
- **Traceability**:
  - *UI / Client*: [client/src/pages/admin/AdminAnalytics.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/admin/AdminAnalytics.jsx#L78-L220).
  - *API Client*: `api.get("/analytics/admin")`.
  - *Route & Middleware*: [server/routes/analyticsRoutes.js](file:///d:/EprojectMern/EventSphere_Eproject/server/routes/analyticsRoutes.js#L7-L8) (`protect, authorize("admin")`).
  - *Controller*: [server/controllers/analyticsController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/analyticsController.js#L9-L65) (`getAdminAnalytics`).
- **Role Access**: Admin only.
- **Gap**:
  1. In [server/controllers/analyticsController.js:L33-L37](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/analyticsController.js#L33-L37), attendee breakdown is simulated with arbitrary static formulas:
     ```javascript
     const attendanceBreakdown = [
       { name: "Verified B2B Buyers", count: Math.round(totalAttendees * 0.45) || 120 },
       { name: "General Attendees", count: Math.round(totalAttendees * 0.35) || 95 },
       { name: "VIP Delegates", count: Math.round(totalAttendees * 0.20) || 50 }
     ];
     ```
     There is no "Verified B2B Buyers" or "VIP Delegates" role or field in the database.
  2. Booth traffic is not measured (no scan/visit tracking model exists).
  3. Session popularity is not aggregated per session (only `totalSessions` count is returned).
  4. No report export (CSV/PDF) is implemented.
- **Fix Suggestion**: Implement a real MongoDB aggregation pipeline grouping `Registration` records by `session` to produce actual session popularity rankings, and group registrations by `expo` for real expo attendance metrics.

---

#### F2.11 – Real-time analytics on expo performance
- **Verdict**: **PARTIAL**
- **Traceability**:
  - *UI / Client*: [client/src/pages/admin/AdminAnalytics.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/admin/AdminAnalytics.jsx#L36-L58).
  - *Controller*: [server/controllers/analyticsController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/analyticsController.js).
- **Role Access**: Admin only.
- **Gap**: The page displays tickers and labels stating "REAL-TIME ANALYTICS", but `AdminAnalytics.jsx` only executes a single `useEffect` fetch on mount. It has **no** Socket.IO listener and **no** polling `setInterval`. Numbers only update if the admin manually refreshes the page.
- **Fix Suggestion**: Add `socket.on("booth:updated")` and `socket.on("registration:new")` listeners to `AdminAnalytics.jsx`, or set up a 10-second polling interval `setInterval(fetchAnalytics, 10000)`.

---

### 2.3 Exhibitor Portal

#### F3.1 – Register for expos with company details, products/services, required documents
- **Verdict**: **PASS**
- **Traceability**:
  - *UI / Client*: [client/src/pages/exhibitor/ExhibitorExpos.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/exhibitor/ExhibitorExpos.jsx#L30-L160). Multi-part form modal with file input.
  - *API Client*: `api.post("/applications", formData, { headers: { "Content-Type": "multipart/form-data" } })`.
  - *Route & Middleware*: [server/routes/applicationRoutes.js](file:///d:/EprojectMern/EventSphere_Eproject/server/routes/applicationRoutes.js#L11-L12). Uses `upload.array("documents", 3)` and `protect, authorize("exhibitor")`.
  - *Controller*: [server/controllers/applicationController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/applicationController.js#L8-L53) (`createApplication`).
  - *Model*: [server/models/Application.js](file:///d:/EprojectMern/EventSphere_Eproject/server/models/Application.js#L4-L24).
- **Role Access**: Exhibitor only.
- **Evidence**: Validates required fields, checks for duplicate application per expo, stores uploaded documents in `/uploads`, and alerts all administrators via `notifyMany`.

---

#### F3.2 – Update profile: logo, description, contact info
- **Verdict**: **PASS**
- **Traceability**:
  - *UI / Client*: [client/src/pages/exhibitor/ExhibitorProfile.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/exhibitor/ExhibitorProfile.jsx#L20-L120).
  - *API Client*: `api.get("/profile")`, `api.put("/profile", data)`, `api.post("/profile/logo", formData)`.
  - *Route & Middleware*: [server/routes/profileRoutes.js](file:///d:/EprojectMern/EventSphere_Eproject/server/routes/profileRoutes.js#L8-L10). Logo upload uses `upload.single("logo")` guarded by `protect, authorize("exhibitor")`.
  - *Controller*: [server/controllers/profileController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/profileController.js#L18-L68) (`updateProfile`, `uploadLogo`).
  - *Model*: [server/models/User.js](file:///d:/EprojectMern/EventSphere_Eproject/server/models/User.js#L14-L19).
- **Role Access**: Exhibitor (logo restricted to exhibitor, general profile available to any logged in user).
- **Evidence**: Allows editing `company`, `description`, `phone`, `website`, `category`, and uploading an image logo that immediately updates the user record.

---

#### F3.3 – View available booths on floor plan
- **Verdict**: **PASS**
- **Traceability**:
  - *UI / Client*: [client/src/pages/exhibitor/ExhibitorBooths.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/exhibitor/ExhibitorBooths.jsx#L47-L85,L140-L240). Floor plan interactive grid rendering booths colored by availability status.
  - *API Client*: `api.get("/expos/:expoId/booths")`.
  - *Route & Middleware*: [server/routes/expoRoutes.js](file:///d:/EprojectMern/EventSphere_Eproject/server/routes/expoRoutes.js#L23).
  - *Controller*: [server/controllers/boothController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/boothController.js#L8-L17) (`getBoothsByExpo`).
- **Role Access**: Exhibitor / Public.
- **Evidence**: Visual grid differentiates "available" (green), "reserved" (yellow), and "booked" (red). Exhibitors see which booths are occupied and which are open for selection.

---

#### F3.4 – Select and reserve a booth
- **Verdict**: **PASS**
- **Traceability**:
  - *UI / Client*: [client/src/pages/exhibitor/ExhibitorBooths.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/exhibitor/ExhibitorBooths.jsx#L84-L125). Click booth card → "Reserve Booth" action with confirmation.
  - *API Client*: `api.put("/booths/:id/reserve")`, `api.put("/booths/:id/cancel")`.
  - *Route & Middleware*: [server/routes/boothRoutes.js](file:///d:/EprojectMern/EventSphere_Eproject/server/routes/boothRoutes.js#L19-L20). Guarded by `protect, authorize("exhibitor")`.
  - *Controller*: [server/controllers/boothController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/boothController.js#L131-L209) (`reserveBooth`, `cancelReservation`).
  - *Model*: [server/models/Booth.js](file:///d:/EprojectMern/EventSphere_Eproject/server/models/Booth.js), [server/models/Application.js](file:///d:/EprojectMern/EventSphere_Eproject/server/models/Application.js).
- **Role Access**: Exhibitor only.
- **Evidence**: Verifies that the exhibitor holds an approved application for that expo, checks that the booth is available, verifies the exhibitor doesn't already hold a booth, sets booth status to `reserved`, links booth to application, and emits `booth:updated`. Allows cancellation of reservations.

---

#### F3.5 – Manage booth details: products/services, staff info
- **Verdict**: **PASS**
- **Traceability**:
  - *UI / Client*: [client/src/pages/exhibitor/ExhibitorBooths.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/exhibitor/ExhibitorBooths.jsx#L250-L360). "My Assigned Booth" drawer allows managing booth description and adding/removing booth staff members.
  - *API Client*: `api.put("/booths/:id/my-details", { details, staff })`.
  - *Route & Middleware*: [server/routes/boothRoutes.js](file:///d:/EprojectMern/EventSphere_Eproject/server/routes/boothRoutes.js#L21) (`protect, authorize("exhibitor")`).
  - *Controller*: [server/controllers/boothController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/boothController.js#L245-L269) (`updateMyBooth`).
  - *Model*: [server/models/Booth.js](file:///d:/EprojectMern/EventSphere_Eproject/server/models/Booth.js#L13-L17) (`details: String`, `staff: [{ name, role }]`).
- **Role Access**: Exhibitor (verifies `booth.exhibitor.toString() === req.user._id.toString()`).
- **Evidence**: Exhibitors can specify showcase descriptions and list staff members (name and role) present at the booth.

---

#### F3.6 – Contact organizers/admins
- **Verdict**: **PASS**
- **Traceability**:
  - *UI / Client*: [client/src/pages/Messages.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/Messages.jsx#L35-L120). Compose modal includes a quick-select "Contact Organizer" button.
  - *API Client*: `api.get("/messages/admin-contact")`, `api.post("/messages", { receiver, subject, body })`.
  - *Route & Middleware*: [server/routes/messageRoutes.js](file:///d:/EprojectMern/EventSphere_Eproject/server/routes/messageRoutes.js#L11,L17) (`protect`).
  - *Controller*: [server/controllers/messageController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/messageController.js#L8-L85,L153-L163) (`sendMessage`, `getAdminContact`).
  - *Model*: [server/models/Message.js](file:///d:/EprojectMern/EventSphere_Eproject/server/models/Message.js).
- **Role Access**: Any authenticated user (`exhibitor`, `attendee`).
- **Evidence**: `getAdminContact` finds the primary admin user. `sendMessage` validates role permissions, saves message, delivers via live WebSocket `message:new`, and dispatches in-app notification.

---

#### F3.7 – Interact with neighboring exhibitors
- **Verdict**: **PASS**
- **Traceability**:
  - *UI / Client*: [client/src/pages/Messages.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/Messages.jsx#L140-L220), [client/src/pages/ExhibitorProfile.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/ExhibitorProfile.jsx#L51-L59) ("Contact Partner" button opens Messages prefilled with exhibitor recipient).
  - *API Client*: `api.post("/messages", { receiver: exhibitorId, subject, body })`.
  - *Route & Middleware*: [server/routes/messageRoutes.js](file:///d:/EprojectMern/EventSphere_Eproject/server/routes/messageRoutes.js#L11).
  - *Controller*: [server/controllers/messageController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/messageController.js#L48-L55):
    ```javascript
    if (senderRole === "exhibitor" && !["admin", "exhibitor", "attendee"].includes(receiverRole)) {
      return res.status(403).json({ message: "Exhibitors may only message organizers, exhibitors, and attendees" });
    }
    ```
- **Role Access**: Exhibitor to Exhibitor explicitly allowed and enforced server-side.
- **Evidence**: Exhibitors can directly message other exhibitors. Full inbox/sent views, unread counters, and mark-as-read endpoints are implemented.

---

### 2.4 Attendee Interface

#### F4.1 – View event details, schedule, exhibitor list, floor plans
- **Verdict**: **PASS**
- **Traceability**:
  - *UI / Client*: [client/src/pages/Expos.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/Expos.jsx), [client/src/pages/ExpoDetails.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/ExpoDetails.jsx#L35-L350) (tabs for Overview, Exhibitors, Floor Plan, Schedule).
  - *API Client*: `api.get("/public/expos")`, `api.get("/expos/:id/public")`.
  - *Route & Middleware*: [server/routes/expoRoutes.js](file:///d:/EprojectMern/EventSphere_Eproject/server/routes/expoRoutes.js#L10,L15). Public endpoints.
  - *Controller*: [server/controllers/expoController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/expoController.js#L99-L186) (`getPublicExpoDetails`).
- **Role Access**: Public / All roles.
- **Evidence**: `getPublicExpoDetails` aggregates the expo record, all booths with assigned exhibitor details, all sessions, and all approved exhibitors in a single response.

---

#### F4.2 – Register for events, sessions, workshops
- **Verdict**: **PARTIAL**
- **Traceability**:
  - *UI / Client*: [client/src/pages/ExpoDetails.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/ExpoDetails.jsx#L140-L210). "Register for Expo" and "Register Session" buttons.
  - *API Client*: `api.post("/registrations", { expo })`, `api.post("/registrations/session", { session })`.
  - *Route & Middleware*: [server/routes/registrationRoutes.js](file:///d:/EprojectMern/EventSphere_Eproject/server/routes/registrationRoutes.js#L11-L12). Guarded by `protect, authorize("attendee")`.
  - *Controller*: [server/controllers/registrationController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/registrationController.js#L7-L143) (`registerForExpo`, `registerForSession`).
  - *Model*: [server/models/Registration.js](file:///d:/EprojectMern/EventSphere_Eproject/server/models/Registration.js).
- **Role Access**: Attendee only.
- **Gap**:
  1. The brief states: *"Register for events, sessions, workshops (Registration endpoint, capacity checks, duplicate prevention)"*. Duplicate prevention is implemented with partial unique compound indexes and runtime checks. Auto-registration for parent expo is also handled.
  2. **Capacity checks are completely missing**: Neither `Expo` nor `Session` schemas have a `capacity` or `maxAttendees` field, and neither endpoint checks whether attendance has reached a limit.
- **Fix Suggestion**: Add `capacity: { type: Number, default: 100 }` to `Session` and `Expo` models, and query `Registration.countDocuments({ session, registered: true }) < session.capacity` before creating registration.

---

#### F4.3 – Search and filter exhibitors by category, product, keyword
- **Verdict**: **PASS**
- **Traceability**:
  - *UI / Client*: [client/src/pages/Exhibitors.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/Exhibitors.jsx#L40-L130). Search input field with real-time debounced filtering and category filter pills.
  - *API Client*: `api.get("/public/exhibitors?search=...&category=...&expo=...")` and `api.get("/exhibitors/categories")`.
  - *Route & Middleware*: [server/routes/publicRoutes.js](file:///d:/EprojectMern/EventSphere_Eproject/server/routes/publicRoutes.js#L14), [server/routes/exhibitorRoutes.js](file:///d:/EprojectMern/EventSphere_Eproject/server/routes/exhibitorRoutes.js#L9-L10).
  - *Controller*: [server/controllers/exhibitorController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/exhibitorController.js#L7-L71,L75-L87) (`getExhibitors`, `getCategories`), [server/controllers/publicController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/publicController.js#L150-L215).
- **Role Access**: Public / All roles.
- **Evidence**: Server-side filtering searches across `company`, `name`, `description`, and `products` using case-insensitive regex, and filters by dynamic distinct categories.

---

#### F4.4 – View exhibitor profile and booth location on floor plan
- **Verdict**: **PASS**
- **Traceability**:
  - *UI / Client*: [client/src/pages/ExhibitorProfile.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/ExhibitorProfile.jsx#L650-L825).
  - *API Client*: `api.get("/public/exhibitors/:id")` or `api.get("/exhibitors/:id")`.
  - *Route & Middleware*: [server/routes/publicRoutes.js](file:///d:/EprojectMern/EventSphere_Eproject/server/routes/publicRoutes.js#L15), [server/routes/exhibitorRoutes.js](file:///d:/EprojectMern/EventSphere_Eproject/server/routes/exhibitorRoutes.js#L11).
  - *Controller*: [server/controllers/exhibitorController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/exhibitorController.js#L91-L125) (`getExhibitor`).
- **Role Access**: Public / All roles.
- **Evidence**: Exhibitor profile displays company overview, logo, products, and a "Trade Show Booths & Schedules" section rendering each expo with its assigned booth number badge (e.g. `BOOTH A3`) and direct navigation link to the expo's interactive floor plan.

---

#### F4.5 – Chat or email exhibitors for inquiries/appointments
- **Verdict**: **PARTIAL**
- **Traceability**:
  - *UI / Client*: [client/src/pages/ExhibitorProfile.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/ExhibitorProfile.jsx#L51-L59) ("Contact Partner" opens Messages), [client/src/pages/Messages.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/Messages.jsx#L20-L250).
  - *API Client*: `api.post("/messages", { receiver, subject, body })`.
  - *Route & Middleware*: [server/routes/messageRoutes.js](file:///d:/EprojectMern/EventSphere_Eproject/server/routes/messageRoutes.js#L11). Guarded by `protect`.
  - *Controller*: [server/controllers/messageController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/messageController.js#L8-L85).
  - *Model*: [server/models/Message.js](file:///d:/EprojectMern/EventSphere_Eproject/server/models/Message.js).
- **Role Access**: Attendee to Exhibitor explicitly permitted in `messageController.js` line 41.
- **Gap**: In-app socket chat works end-to-end with real-time delivery and inbox notifications. However, **email sending** is completely absent from the codebase (no `nodemailer`, no mail server).
- **Fix Suggestion**: Add an external email trigger or mailto link fallback if physical email transmission is required alongside in-app messaging.

---

#### F4.6 – Browse schedules, sessions, workshops
- **Verdict**: **PASS**
- **Traceability**:
  - *UI / Client*: [client/src/pages/ExpoDetails.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/ExpoDetails.jsx#L220-L310) (Schedule Tab), [client/src/pages/attendee/MySchedule.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/attendee/MySchedule.jsx#L53-L160).
  - *API Client*: `api.get("/expos/:id/sessions")`, `api.get("/registrations/my")`.
  - *Route & Middleware*: [server/routes/expoRoutes.js](file:///d:/EprojectMern/EventSphere_Eproject/server/routes/expoRoutes.js#L24), [server/routes/registrationRoutes.js](file:///d:/EprojectMern/EventSphere_Eproject/server/routes/registrationRoutes.js#L14).
  - *Controller*: [server/controllers/sessionController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/sessionController.js#L183-L190) (`getSessionsByExpo`), [server/controllers/registrationController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/registrationController.js#L229-L238).
- **Role Access**: Public (browse expo sessions), Attendee (personal schedule).
- **Evidence**: Chronologically ordered session cards with speaker, topic, location, start/end timestamps, and registration/bookmark toggles.

---

#### F4.7 – Bookmark or register for sessions
- **Verdict**: **PASS**
- **Traceability**:
  - *UI / Client*: [client/src/pages/ExpoDetails.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/ExpoDetails.jsx#L250-L290), [client/src/pages/attendee/MySchedule.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/attendee/MySchedule.jsx#L73-L85).
  - *API Client*: `api.put("/registrations/bookmark", { session: sessionId })`.
  - *Route & Middleware*: [server/routes/registrationRoutes.js](file:///d:/EprojectMern/EventSphere_Eproject/server/routes/registrationRoutes.js#L13). Guarded by `protect, authorize("attendee")`.
  - *Controller*: [server/controllers/registrationController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/registrationController.js#L147-L192) (`toggleBookmark`).
  - *Model*: [server/models/Registration.js](file:///d:/EprojectMern/EventSphere_Eproject/server/models/Registration.js#L10-L11) (`registered: Boolean`, `bookmarked: Boolean`).
- **Role Access**: Attendee only.
- **Evidence**: Attendee can toggle bookmarks independently of session registration. If an attendee registers and bookmarks, both flags persist. Cancelling registration preserves bookmark state.

---

#### F4.8 – Notifications or reminders for bookmarked sessions
- **Verdict**: **PARTIAL**
- **Traceability**:
  - *Backend Background Job*: [server/utils/reminders.js](file:///d:/EprojectMern/EventSphere_Eproject/server/utils/reminders.js#L5-L42) (`startReminders`), registered in [server/server.js:L93](file:///d:/EprojectMern/EventSphere_Eproject/server/server.js#L93). Runs every 60 seconds (`setInterval`).
  - *UI / Client*: [client/src/components/NotificationBell.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/components/NotificationBell.jsx), [client/src/pages/Notifications.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/Notifications.jsx).
  - *Route & Middleware*: [server/routes/notificationRoutes.js](file:///d:/EprojectMern/EventSphere_Eproject/server/routes/notificationRoutes.js).
- **Role Access**: Any logged-in attendee.
- **Gap**:
  1. In [server/utils/reminders.js:L19-L22](file:///d:/EprojectMern/EventSphere_Eproject/server/utils/reminders.js#L19-L22):
     ```javascript
     const registrations = await Registration.find({
       session: session._id,
       registered: true
     }).select("user");
     ```
     The query **strictly searches `registered: true`** and completely ignores attendees who only bookmarked the session (`bookmarked: true, registered: false`)! Users with bookmarked sessions receive **no** reminders.
  2. Reminders are in-app only via Socket.IO and Notification model; no email reminders are sent.
- **Fix Suggestion**: Update query in `reminders.js` to:
  ```javascript
  const registrations = await Registration.find({
    session: session._id,
    $or: [{ registered: true }, { bookmarked: true }]
  }).select("user");
  ```

---

### 2.5 General System Features

#### F5.1 – Real-time updates for schedules, booth allocations, event changes
- **Verdict**: **PARTIAL**
- **Traceability**:
  - *WebSocket Server*: [server/utils/socket.js](file:///d:/EprojectMern/EventSphere_Eproject/server/utils/socket.js#L1-L68) (Socket.IO authenticated via JWT handshake).
  - *Client Context*: [client/src/context/SocketContext.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/context/SocketContext.jsx#L1-L50).
  - *Emitted Events*:
    - `booth:updated`: Emitted in `updateBooth`, `assignBooth`, `releaseBooth`, `reserveBooth`, `cancelReservation`, `confirmBooth`, `updateMyBooth`.
    - `schedule:updated`: Emitted in `createSession`, `updateSession`, `deleteSession`.
    - `message:new`: Emitted in `sendMessage`.
    - `notification:new`: Emitted in `createNotification` and `notifyMany`.
  - *Listening Components*:
    - `ExpoDetails.jsx`: Listens to `booth:updated` and `schedule:updated`.
    - `ExhibitorBooths.jsx`: Listens to `booth:updated`.
    - `AdminBooths.jsx`: Listens to `booth:updated`.
    - `AdminSessions.jsx`: Listens to `schedule:updated`.
    - `MySchedule.jsx`: Listens to `schedule:updated`.
- **Gap**:
  In [server/controllers/expoController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/expoController.js#L8-L85,L193-L266), `createExpo`, `updateExpo`, and `deleteExpo` **never emit any socket events**! When an admin updates an expo title, dates, or deletes an expo, attendees and exhibitors browsing the expo list or details view get no real-time update.
- **Fix Suggestion**: Add `emitToAll("expo:updated", { expoId: expo._id })` in `createExpo`, `updateExpo`, and `deleteExpo`, and subscribe to it in `Expos.jsx` and `ExpoDetails.jsx`.

---

#### F5.2 – Feedback and support mechanism
- **Verdict**: **PASS**
- **Traceability**:
  - *UI / Client*: [client/src/pages/Feedback.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/Feedback.jsx#L15-L80) (Submit form with category selector), [client/src/pages/admin/AdminFeedback.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/admin/AdminFeedback.jsx#L20-L95) (Admin review inbox).
  - *API Client*: `api.post("/feedback", { type, message })`, `api.get("/feedback")`.
  - *Route & Middleware*: [server/routes/feedbackRoutes.js](file:///d:/EprojectMern/EventSphere_Eproject/server/routes/feedbackRoutes.js#L8-L9) (`POST /` guarded by `protect`; `GET /` guarded by `protect, authorize("admin")`).
  - *Controller*: [server/controllers/feedbackController.js](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/feedbackController.js#L5-L39) (`createFeedback`, `getAllFeedback`).
  - *Model*: [server/models/Feedback.js](file:///d:/EprojectMern/EventSphere_Eproject/server/models/Feedback.js#L4-L13).
- **Role Access**: Submit: any logged-in role (`attendee`, `exhibitor`, `admin`). Review: `admin` only.
- **Evidence**: Validates `type` (`suggestion` or `issue`) and minimum message length (5 chars). Admin dashboard provides full feedback list with user metadata and submission dates.

---

## 3. Cross-Cutting Functional Checks (X1–X6)

### X1 – Role-based routing: an attendee cannot open admin pages by typing the URL
- **Verdict**: **PASS**
- **Evidence**:
  - [client/src/components/ProtectedRoute.jsx:L204-L206](file:///d:/EprojectMern/EventSphere_Eproject/client/src/components/ProtectedRoute.jsx#L204-L206):
    ```javascript
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/unauthorized" replace />;
    }
    ```
  - [client/src/App.jsx:L68-L82](file:///d:/EprojectMern/EventSphere_Eproject/client/src/App.jsx#L68-L82) wraps `/admin`, `/admin/expos`, `/admin/expos/:id/booths`, `/admin/expos/:id/sessions`, `/admin/applications`, `/admin/feedback`, and `/admin/analytics` in `<ProtectedRoute allowedRoles={["admin"]}>`.
  - Typing an admin URL as an attendee instantly redirects to `/unauthorized`. Unauthenticated requests redirect to `/login` with target path preserved.

---

### X2 – Every API route that changes data is authenticated and role-checked server-side
- **Verdict**: **PASS**
- **Evidence**:
  - Full audit of all mutating routes (`POST`, `PUT`, `DELETE`):
    - `POST /api/expos`: `protect, authorize("admin")`
    - `PUT /api/expos/:id`: `protect, authorize("admin")`
    - `DELETE /api/expos/:id`: `protect, authorize("admin")`
    - `PUT /api/booths/:id`: `protect, authorize("admin")`
    - `PUT /api/booths/:id/assign`: `protect, authorize("admin")`
    - `PUT /api/booths/:id/release`: `protect, authorize("admin")`
    - `PUT /api/booths/:id/confirm`: `protect, authorize("admin")`
    - `PUT /api/booths/:id/reserve`: `protect, authorize("exhibitor")`
    - `PUT /api/booths/:id/cancel`: `protect, authorize("exhibitor")`
    - `PUT /api/booths/:id/my-details`: `protect, authorize("exhibitor")` + owner check
    - `POST /api/applications`: `protect, authorize("exhibitor")`
    - `PUT /api/applications/:id/status`: `protect, authorize("admin")`
    - `POST /api/sessions`: `protect, authorize("admin")`
    - `PUT /api/sessions/:id`: `protect, authorize("admin")`
    - `DELETE /api/sessions/:id`: `protect, authorize("admin")`
    - `POST /api/registrations`: `protect, authorize("attendee")`
    - `POST /api/registrations/session`: `protect, authorize("attendee")`
    - `PUT /api/registrations/bookmark`: `protect, authorize("attendee")`
    - `DELETE /api/registrations/:id`: `protect, authorize("attendee")` + owner check
    - `POST /api/profile/logo`: `protect, authorize("exhibitor")`
    - `POST /api/messages`: `protect` + server-side role validation matrix
  - No unprotected mutating routes exist.

---

### X3 – Input validation on server (not only client) for every form
- **Verdict**: **PASS**
- **Evidence**:
  - Every controller enforces required field checks and data sanity:
    - `authController.js`: email regex, password length >= 6, role restriction.
    - `expoController.js`: `endDate >= startDate`, regex location overlap check.
    - `sessionController.js`: `endTime > startTime`, location-time overlap check.
    - `applicationController.js`: duplicate application detection, status enum validation.
    - `feedbackController.js`: type enum check, minimum length >= 5.
    - `messageController.js`: self-messaging block, role permission matrix.

---

### X4 – Error and empty states in the UI (no data, failed request, 401/403/404)
- **Verdict**: **PASS**
- **Evidence**:
  - Loading skeletons/spinners implemented across all pages (`Loading.jsx`, neo-brutal loaders).
  - Empty states implemented in all list views ("No expos found", "No applications yet", "No messages in inbox").
  - Dedicated `/unauthorized` page for 403.
  - Dedicated `NotFound.jsx` bound to wildcard `*` route for 404.
  - Error banners rendered on API errors using `err.userMessage || err.response?.data?.message`.

---

### X5 – Data relationships are consistent: deleting an expo handles its booths, sessions, registrations
- **Verdict**: **PARTIAL**
- **Evidence**:
  - In [server/controllers/expoController.js:L249-L266](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/expoController.js#L249-L266):
    ```javascript
    await Booth.deleteMany({ expo: expoId });
    await Application.deleteMany({ expo: expoId });
    await Session.deleteMany({ expo: expoId });
    await expo.deleteOne();
    ```
  - **Identified Gap**: `Registration.deleteMany({ expo: expoId })` is **completely missing**!
  - When an expo is deleted, all `Registration` documents for that expo remain in MongoDB as orphaned records. When attendees query `/api/registrations/my`, their populated `expo` field returns `null`.
- **Fix Suggestion**: Add `await Registration.deleteMany({ expo: expoId });` inside `deleteExpo()`.

---

### X6 – No double-booking of a booth under concurrent requests
- **Verdict**: **PARTIAL**
- **Evidence**:
  - In [server/controllers/boothController.js:L133-L168](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/boothController.js#L133-L168) (`reserveBooth`):
    ```javascript
    const booth = await Booth.findById(req.params.id);
    if (booth.status !== "available") {
      return res.status(400).json({ message: "Booth is no longer available" });
    }
    // ... validation ...
    booth.status = "reserved";
    booth.exhibitor = req.user._id;
    await booth.save();
    ```
  - **Identified Gap**: The code performs a non-atomic `findById`, checks status in memory, and then calls `booth.save()`. Under concurrent requests, two exhibitors can simultaneously read `booth.status === "available"` before either save executes, causing a race condition where one overwrites the other.
- **Fix Suggestion**: Use an atomic MongoDB operation:
  ```javascript
  const booth = await Booth.findOneAndUpdate(
    { _id: req.params.id, status: "available" },
    { status: "reserved", exhibitor: req.user._id },
    { new: true }
  );
  if (!booth) {
    return res.status(409).json({ message: "Booth is no longer available" });
  }
  ```

---

## 4. Master Requirements Traceability Matrix Table

| ID | Requirement | Verdict | Evidence | Gap / Fix Suggestion |
| --- | --- | :---: | --- | --- |
| **F1.1** | Users can register and log in | **PASS** | [Register.jsx:21](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/Register.jsx#L21), [Login.jsx:18](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/Login.jsx#L18), [authController.js:12](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/authController.js#L12) | None. Full end-to-end flow with JWT. |
| **F1.2** | Three roles chosen at registration | **PARTIAL** | [Register.jsx:215](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/Register.jsx#L215), [authController.js:32](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/authController.js#L32) | Admin registration deliberately blocked for security; only attendee/exhibitor selectable. Admin must be seeded. |
| **F1.3** | Forgot / reset password | **PARTIAL** | [ForgotPassword.jsx:14](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/ForgotPassword.jsx#L14), [authController.js:146](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/authController.js#L146) | Reset link returned in API response and displayed in UI ("Demo Mode"); no actual SMTP email service. |
| **F1.4** | Password encryption | **PASS** | [User.js:27](file:///d:/EprojectMern/EventSphere_Eproject/server/models/User.js#L27), [authController.js:79](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/authController.js#L79) | bcrypt salt 10 in pre-save hook; passwords never returned in queries (`-password`). |
| **F2.1** | Create, edit, delete expos | **PASS** | [AdminExpos.jsx:20](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/admin/AdminExpos.jsx#L20), [expoController.js:8](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/expoController.js#L8) | Full CRUD API + UI forms, Multer image upload, date overlap checks. |
| **F2.2** | Expo details: title, date, location, desc, theme | **PASS** | [Expo.js:4](file:///d:/EprojectMern/EventSphere_Eproject/server/models/Expo.js#L4), [AdminExpos.jsx:220](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/admin/AdminExpos.jsx#L220) | All 5 fields present in schema, validated in controller, and editable in UI. |
| **F2.3** | Allocate booth spaces on a floor plan | **PASS** | [AdminBooths.jsx:35](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/admin/AdminBooths.jsx#L35), [boothController.js:44](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/boothController.js#L44) | Visual floor plan grid with status indicators and allocation modal. |
| **F2.4** | View exhibitor registrations & applications | **PASS** | [AdminApplications.jsx:25](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/admin/AdminApplications.jsx#L25), [applicationController.js:72](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/applicationController.js#L72) | Filterable list by status and expo, displays company, representative, and documents. |
| **F2.5** | Approve or reject exhibitor applications | **PASS** | [AdminApplications.jsx:60](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/admin/AdminApplications.jsx#L60), [applicationController.js:94](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/applicationController.js#L94) | Status toggle API, releases booth if rejected, sends in-app notification. |
| **F2.6** | Assign booths and manage booth details | **PASS** | [AdminBooths.jsx:90](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/admin/AdminBooths.jsx#L90), [boothController.js:21](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/boothController.js#L21) | Assigns approved exhibitors, edits size, price, details. Prevents double-assignment. |
| **F2.7** | Create & manage schedule with time slots | **PASS** | [AdminSessions.jsx:20](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/admin/AdminSessions.jsx#L20), [sessionController.js:8](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/sessionController.js#L8) | Time slot validation, overlap collision check, cascaded registration cleanup. |
| **F2.8** | Assign speakers, topics, locations to sessions | **PASS** | [Session.js:8](file:///d:/EprojectMern/EventSphere_Eproject/server/models/Session.js#L8), [AdminSessions.jsx:140](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/admin/AdminSessions.jsx#L140) | Speaker, topic, and location fields supported in DB, controller, and UI forms. |
| **F2.9** | Edit and update the schedule | **PASS** | [AdminSessions.jsx:70](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/admin/AdminSessions.jsx#L70), [sessionController.js:59](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/sessionController.js#L59) | Update API emits `schedule:updated` via Socket.IO and notifies registrants. |
| **F2.10** | Reports: attendee engagement, booth traffic, popularity | **PARTIAL** | [AdminAnalytics.jsx:78](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/admin/AdminAnalytics.jsx#L78), [analyticsController.js:33](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/analyticsController.js#L33) | Attendance breakdown uses hardcoded simulated multipliers; no booth traffic tracking; no CSV/PDF export. |
| **F2.11** | Real-time analytics on expo performance | **PARTIAL** | [AdminAnalytics.jsx:36](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/admin/AdminAnalytics.jsx#L36) | UI claims real-time, but fetches once on mount without socket listeners or polling interval. |
| **F3.1** | Register for expos with company details & docs | **PASS** | [ExhibitorExpos.jsx:30](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/exhibitor/ExhibitorExpos.jsx#L30), [applicationController.js:8](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/applicationController.js#L8) | Multi-part form, Multer document uploads, duplicate application prevention. |
| **F3.2** | Update profile: logo, description, contact info | **PASS** | [ExhibitorProfile.jsx:20](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/exhibitor/ExhibitorProfile.jsx#L20), [profileController.js:18](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/profileController.js#L18) | Dedicated profile editing with image upload via `POST /api/profile/logo`. |
| **F3.3** | View available booths on floor plan | **PASS** | [ExhibitorBooths.jsx:47](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/exhibitor/ExhibitorBooths.jsx#L47), [boothController.js:8](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/boothController.js#L8) | Color-coded interactive floor plan reflects available vs occupied spaces. |
| **F3.4** | Select and reserve a booth | **PASS** | [ExhibitorBooths.jsx:84](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/exhibitor/ExhibitorBooths.jsx#L84), [boothController.js:131](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/boothController.js#L131) | Self-service reservation, approved application verification, cancellation flow. |
| **F3.5** | Manage booth details: products, staff info | **PASS** | [ExhibitorBooths.jsx:250](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/exhibitor/ExhibitorBooths.jsx#L250), [boothController.js:245](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/boothController.js#L245) | Editable description and staff roster (`[{ name, role }]`) on assigned booth. |
| **F3.6** | Contact organizers/admins | **PASS** | [Messages.jsx:35](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/Messages.jsx#L35), [messageController.js:153](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/messageController.js#L153) | Dedicated "Contact Organizer" action, real-time message delivery and inbox. |
| **F3.7** | Interact with neighboring exhibitors | **PASS** | [ExhibitorProfile.jsx:51](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/ExhibitorProfile.jsx#L51), [messageController.js:48](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/messageController.js#L48) | Direct peer-to-peer messaging between exhibitors permitted and functional. |
| **F4.1** | View event details, schedule, exhibitors, floor plans | **PASS** | [ExpoDetails.jsx:35](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/ExpoDetails.jsx#L35), [expoController.js:99](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/expoController.js#L99) | Public unified expo page with tabbed views for all 4 sub-resources. |
| **F4.2** | Register for events, sessions, workshops | **PARTIAL** | [ExpoDetails.jsx:140](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/ExpoDetails.jsx#L140), [registrationController.js:7](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/registrationController.js#L7) | Registration works with duplicate prevention, but **no capacity checks** exist in models or endpoints. |
| **F4.3** | Search & filter exhibitors by category, product, keyword | **PASS** | [Exhibitors.jsx:40](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/Exhibitors.jsx#L40), [exhibitorController.js:7](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/exhibitorController.js#L7) | Server-side text search across 4 fields + dynamic category filters. |
| **F4.4** | View exhibitor profile and booth location on floor plan | **PASS** | [ExhibitorProfile.jsx:650](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/ExhibitorProfile.jsx#L650), [exhibitorController.js:91](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/exhibitorController.js#L91) | Displays booth badge and clickable link to expo floor plan. |
| **F4.5** | Chat or email exhibitors for inquiries | **PARTIAL** | [ExhibitorProfile.jsx:51](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/ExhibitorProfile.jsx#L51), [Messages.jsx:20](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/Messages.jsx#L20) | In-app WebSocket chat is complete; email sending is entirely missing. |
| **F4.6** | Browse schedules, sessions, workshops | **PASS** | [ExpoDetails.jsx:220](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/ExpoDetails.jsx#L220), [MySchedule.jsx:53](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/attendee/MySchedule.jsx#L53) | Chronological timetable view on public expo and attendee personal schedule. |
| **F4.7** | Bookmark or register for sessions | **PASS** | [ExpoDetails.jsx:250](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/ExpoDetails.jsx#L250), [registrationController.js:147](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/registrationController.js#L147) | Independent bookmark flag in schema, toggle endpoint, timetable filter. |
| **F4.8** | Notifications / reminders for bookmarked sessions | **PARTIAL** | [reminders.js:19](file:///d:/EprojectMern/EventSphere_Eproject/server/utils/reminders.js#L19), [NotificationBell.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/components/NotificationBell.jsx) | In-app reminders work for registered sessions, but scheduler query **omits bookmarked-only sessions**. No email. |
| **F5.1** | Real-time updates for schedules, booths, event changes | **PARTIAL** | [socket.js:56](file:///d:/EprojectMern/EventSphere_Eproject/server/utils/socket.js#L56), [ExpoDetails.jsx:105](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/ExpoDetails.jsx#L105) | Schedules and booths update live via sockets; **expo create/update/delete emits no events**. |
| **F5.2** | Feedback and support mechanism | **PASS** | [Feedback.jsx:15](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/Feedback.jsx#L15), [AdminFeedback.jsx:20](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/admin/AdminFeedback.jsx#L20), [feedbackController.js:5](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/feedbackController.js#L5) | Form submission for suggestions/issues + admin feedback inbox. |
| **X1** | Role-based routing: attendee cannot open admin pages | **PASS** | [ProtectedRoute.jsx:204](file:///d:/EprojectMern/EventSphere_Eproject/client/src/components/ProtectedRoute.jsx#L204), [App.jsx:68](file:///d:/EprojectMern/EventSphere_Eproject/client/src/App.jsx#L68) | Client-side route guard redirects unauthorized roles to `/unauthorized`. |
| **X2** | Every mutating API route is authenticated & role-checked | **PASS** | [authMiddleware.js:5,40](file:///d:/EprojectMern/EventSphere_Eproject/server/middleware/authMiddleware.js#L5) and all route files | Express routes strictly enforce `protect` and `authorize(...)` server-side. |
| **X3** | Input validation on server for every form | **PASS** | All server controllers | Ad-hoc server validation for required fields, regex emails, dates, and enums. |
| **X4** | Error and empty states in UI (no data, 401/403/404) | **PASS** | [ProtectedRoute.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/components/ProtectedRoute.jsx), [NotFound.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/NotFound.jsx), all pages | Skeletons, empty notices, error banners, and 401/403/404 handling. |
| **X5** | Data relationships: delete expo handles booths, sessions, regs | **PARTIAL** | [expoController.js:258](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/expoController.js#L258) | Deletes Booths, Applications, and Sessions, but **omits Registrations**, creating orphaned records. |
| **X6** | No double-booking under concurrent requests | **PARTIAL** | [boothController.js:133](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/boothController.js#L133) | Non-atomic `findById` then `save()` creates a race condition window for double-booking. |

---

*End of Phase 1 — Requirements Traceability Matrix complete.*
