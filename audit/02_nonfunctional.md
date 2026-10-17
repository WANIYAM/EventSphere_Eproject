# Phase 2 – Non-Functional Requirements Audit

**Auditor**: Antigravity Agent  
**Date**: 2026-10-17  
**Scope**: Non-Functional Requirements (N1–N19) from EventSphere eProject Brief  
**Status**: Comprehensive Technical Audit Complete  

---

## 1. Executive Summary & Verdict Statistics

The EventSphere MERN stack was audited against all 19 non-functional requirements (N1–N19) specified in the eProject brief. Each requirement was assessed using code inspection, architectural analysis, configuration review, and vulnerability assessment.

| Verdict | Count | Percentage | Requirements |
| :--- | :---: | :---: | :--- |
| **PASS** | **4** | **21.1%** | N7, N10, N12, N13 |
| **PARTIAL** | **11** | **57.9%** | N1, N2, N3, N4, N5, N6, N9, N11, N16, N17, N18 |
| **FAIL** | **4** | **21.1%** | N8, N14, N15, N19 |
| **UNVERIFIED** | **0** | **0.0%** | — |
| **TOTAL** | **19** | **100.0%** | **N1–N19** |

---

## 2. In-Depth Technical Findings by Requirement

### N1 – Response Time (1–2 s)
- **Verdict**: **PARTIAL**
- **Assessment**:
  - *Database Indexing*: Only `User.email` has a unique index ([`User.js:L7`](file:///d:/EprojectMern/EventSphere_Eproject/server/models/User.js#L7)) and `Registration` has two partial compound unique indexes ([`Registration.js:L18-L28`](file:///d:/EprojectMern/EventSphere_Eproject/server/models/Registration.js#L18-L28)). All other high-frequency query fields lack indexes:
    - `Expo.startDate`, `Expo.location`
    - `Booth.expo`, `Booth.status`
    - `Session.expo`, `Session.startTime`
    - `Application.expo`, `Application.status`
    - `Message.receiver`, `Message.read`
    - `Notification.user`, `Notification.read`
  - *Pagination*: **No pagination exists** anywhere in the API. `GET /api/expos`, `GET /api/applications`, `GET /api/exhibitors`, `GET /api/messages/inbox`, `GET /api/notifications`, and `GET /api/feedback` all execute unbounded `.find()` queries and serialize the entire collection into memory.
  - *Performance Impact*: Latency is sub-second on small seed data (<50 records), but will rapidly exceed the 1–2 s threshold under production data volumes without indexes and pagination.
- **Evidence**: [server/models/Booth.js](file:///d:/EprojectMern/EventSphere_Eproject/server/models/Booth.js), [server/controllers/expoController.js:L89](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/expoController.js#L89), [server/controllers/messageController.js:L91](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/messageController.js#L91).
- **Fix Suggestion**: Add pagination parameters (`limit`, `skip`, or cursor-based) to all list endpoints and define compound indexes on `Booth ({ expo: 1, status: 1 })`, `Session ({ expo: 1, startTime: 1 })`, and `Message ({ receiver: 1, read: 1 })`.

---

### N2 – Scalability
- **Verdict**: **PARTIAL**
- **Assessment**:
  - *Stateless Auth*: PASS. Uses signed JSON Web Tokens passed via `Authorization: Bearer <token>` headers; no server-side HTTP session storage.
  - *WebSocket Single-Process Lock*: In [server/utils/socket.js:L4-L12](file:///d:/EprojectMern/EventSphere_Eproject/server/utils/socket.js#L4-L12), Socket.IO server is bound to a single local Node.js process with no Redis pub/sub adapter (`@socket.io/redis-adapter`). If scaled to two instances, a client on Instance A cannot broadcast events (`booth:updated`, `message:new`) to a client on Instance B.
  - *In-Process Background Timers*: In [server/server.js:L96-L101](file:///d:/EprojectMern/EventSphere_Eproject/server/server.js#L96-L101), `startReminders()` runs an in-memory `setInterval` job. Running multiple instances would duplicate reminder checks.
  - *Local File Storage*: Uploaded images and documents are stored on the local filesystem in [`server/uploads/`](file:///d:/EprojectMern/EventSphere_Eproject/server/uploads) rather than shared cloud object storage (e.g., S3, Cloudinary). Files uploaded to one container are inaccessible to other containers.
- **Evidence**: [server/utils/socket.js](file:///d:/EprojectMern/EventSphere_Eproject/server/utils/socket.js), [server/middleware/upload.js:L8](file:///d:/EprojectMern/EventSphere_Eproject/server/middleware/upload.js#L8).
- **Fix Suggestion**: Install `@socket.io/redis-adapter`, migrate file storage to S3 or Cloudinary, and decouple background scheduling into a standalone worker or BullMQ queue with Redis.

---

### N3 – Hundreds of Concurrent Users
- **Verdict**: **PARTIAL**
- **Assessment**:
  - *Database Connection Pooling*: In [server/config/db.js:L53-L55](file:///d:/EprojectMern/EventSphere_Eproject/server/config/db.js#L53-L55), Mongoose connects without specifying `maxPoolSize` (defaults to 10 connections in the MongoDB Node.js driver). Under 200–500 virtual users executing concurrent queries, the connection pool will be saturated, causing queued connection wait timeouts (`MongoWaitQueueTimeoutError`).
  - *Process Management*: No cluster module or PM2 configuration is provided; runs as a single-threaded Node.js event loop.
  - *Absence of Rate Limiting*: No request throttling exists to protect backend resources from concurrent bursts.
- **Evidence**: [server/config/db.js:L53](file:///d:/EprojectMern/EventSphere_Eproject/server/config/db.js#L53).
- **Fix Suggestion**: Configure `{ maxPoolSize: 100, minPoolSize: 10 }` in `connectDB()`, add PM2 cluster mode config, and implement `express-rate-limit`.

---

### N4 – Horizontal Scaling
- **Verdict**: **PARTIAL**
- **Assessment**:
  - *Configuration via Environment*: PASS. Configuration is externalized through `.env` (`PORT`, `MONGO_URI`, `JWT_SECRET`).
  - *Containerization*: **Missing**. There is no `Dockerfile` or `docker-compose.yml` in the repository for containerized deployment or Kubernetes orchestration.
  - *Shared Storage*: Missing. Local disk static serving at `/uploads` prevents container replication.
  - *Shared WebSocket Bus*: Missing. Socket.IO lacks Redis adapter.
- **Evidence**: Absence of `Dockerfile` and `docker-compose.yml` in root directory.
- **Fix Suggestion**: Create multi-stage `Dockerfile` and `docker-compose.yml` defining client, server, and Redis services; replace local disk upload with S3 storage.

---

### N5 – Encryption at Rest & In Transit
- **Verdict**: **PARTIAL**
- **Assessment**:
  - *Password Hashing*: PASS. Bcrypt with salt factor 10 is applied in pre-save hooks ([`User.js:L27-L31`](file:///d:/EprojectMern/EventSphere_Eproject/server/models/User.js#L27-L31)).
  - *Transit Encryption*: PASS for cloud DB. MongoDB Atlas connection string uses TLS (`mongodb+srv://`). However, the Express server runs pure HTTP without HTTPS enforcement middleware (`helmet` / `express-sslify`) or SSL termination reverse proxy config (Nginx/Caddy).
  - *Sensitive Data Logging*: In [server/controllers/authController.js:L147](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/authController.js#L147), the raw password reset token and full reset link are printed to stdout:
    ```javascript
    console.log(`[DEV Password Reset Link]: ${resetLink}`);
    ```
    In [server/seed/seedDemoData.js:L861-L862](file:///d:/EprojectMern/EventSphere_Eproject/server/seed/seedDemoData.js#L861-L862), demo passwords are logged in plain text.
- **Evidence**: [server/controllers/authController.js:L147](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/authController.js#L147).
- **Fix Suggestion**: Remove plaintext secret console logging; add an Nginx SSL reverse-proxy configuration template with automated Let's Encrypt certificates.

---

### N6 – Secure Authentication
- **Verdict**: **PARTIAL**
- **Assessment**:
  - *JWT Secret & Expiry*: PASS. Secret is loaded from `process.env.JWT_SECRET` and tokens expire in 7 days (`expiresIn: "7d"`).
  - *Token Storage*: In [client/src/context/AuthContext.jsx:L44](file:///d:/EprojectMern/EventSphere_Eproject/client/src/context/AuthContext.jsx#L44), JWT is stored in browser `localStorage`. `localStorage` is accessible to JavaScript and vulnerable to Cross-Site Scripting (XSS) token theft; it is not using `httpOnly` secure cookies.
  - *Rate Limiting*: **Missing**. `express-rate-limit` is not installed. An attacker can execute unlimited automated dictionary/brute-force attacks against `POST /api/auth/login` and `POST /api/auth/forgot-password`.
  - *Fallback Secrets*: In [server/utils/socket.js:L20](file:///d:/EprojectMern/EventSphere_Eproject/server/utils/socket.js#L20), JWT verification falls back to `"fallback_secret"` if `JWT_SECRET` is unset.
- **Evidence**: [client/src/context/AuthContext.jsx:L44](file:///d:/EprojectMern/EventSphere_Eproject/client/src/context/AuthContext.jsx#L44), [server/package.json](file:///d:/EprojectMern/EventSphere_Eproject/server/package.json).
- **Fix Suggestion**: Implement `httpOnly`, `secure`, `SameSite=Lax` cookies for JWT transmission and install `express-rate-limit` (limiting login attempts to 5 per 15 minutes).

---

### N7 – Authorization (IDOR & Access Control)
- **Verdict**: **PASS**
- **Assessment**:
  - *Role Enforcement*: Express middleware `authorize(...roles)` blocks unauthorized roles from all privileged routes server-side.
  - *Object-Level Ownership Checks (Anti-IDOR)*:
    - User Profile: `PUT /api/profile` uses `req.user._id` from validated token ([`profileController.js:L23`](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/profileController.js#L23)).
    - Booth Details: `PUT /api/booths/:id/my-details` checks `booth.exhibitor.toString() === req.user._id.toString()`, returning 403 on mismatch ([`boothController.js:L254-L256`](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/boothController.js#L254-L256)).
    - Booth Cancellation: `PUT /api/booths/:id/cancel` checks `booth.exhibitor.toString() === req.user._id.toString()` ([`boothController.js:L190`](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/boothController.js#L190)).
    - Registrations: `DELETE /api/registrations/:id` verifies `reg.user.toString() === req.user._id.toString()`, returning 403 on mismatch ([`registrationController.js:L200-L202`](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/registrationController.js#L200-L202)).
    - Messages: `PUT /api/messages/:id/read` verifies `message.receiver.toString() === req.user._id.toString()` ([`messageController.js:L124-L126`](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/messageController.js#L124-L126)).
- **Evidence**: [server/middleware/authMiddleware.js:L40-L49](file:///d:/EprojectMern/EventSphere_Eproject/server/middleware/authMiddleware.js#L40-L49), and respective controller verification blocks.

---

### N8 – GDPR & User Consent
- **Verdict**: **FAIL**
- **Assessment**:
  - *Privacy Policy Page*: **Missing**. There is no `/privacy` route in `client/src/App.jsx` and no privacy policy document in the application.
  - *Consent Checkbox*: **Missing**. [client/src/pages/Register.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/Register.jsx) does not have a terms of service or GDPR data consent checkbox.
  - *Data Export (Takeout)*: **Missing**. No endpoint exists for users to download their personal data (`Registration`, `Application`, `Message`, `User` profile).
  - *Right to Erasure ("Right to be Forgotten")*: **Missing**. There is no user account deletion endpoint (`DELETE /api/profile` or `DELETE /api/users/me`).
- **Evidence**: Absence of privacy policy route in [client/src/App.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/App.jsx) and registration form inspection.
- **Fix Suggestion**: Add a `/privacy` route, introduce a required consent checkbox at registration, and build an endpoint `GET /api/profile/export` and `DELETE /api/profile/account`.

---

### N9 – Uptime (99%) & Database Backups
- **Verdict**: **PARTIAL**
- **Assessment**:
  - *Health Check Endpoint*: PASS. `GET /api/health` returns `{ status: "ok", database: "connected" | "disconnected" }` ([`server/server.js:L39-L44`](file:///d:/EprojectMern/EventSphere_Eproject/server/server.js#L39-L44)).
  - *Database Reconnection Resilience*: PASS. [server/config/db.js:L45-L67](file:///d:/EprojectMern/EventSphere_Eproject/server/config/db.js#L45-L67) implements an automated while-loop that retries dropped connections every 10 seconds with diagnostic hints.
  - *Outage Protection Middleware*: PASS. [server/middleware/dbCheck.js](file:///d:/EprojectMern/EventSphere_Eproject/server/middleware/dbCheck.js) intercepts API requests during DB disconnections and returns HTTP 503 Service Unavailable, preventing hanging requests.
  - *Backup Procedures*: **Missing**. There are no backup scripts (`mongodump` cron scripts) or backup documentation in the codebase. Relies entirely on external unconfigured Atlas cloud defaults.
- **Evidence**: [server/server.js:L39](file:///d:/EprojectMern/EventSphere_Eproject/server/server.js#L39), [server/middleware/dbCheck.js](file:///d:/EprojectMern/EventSphere_Eproject/server/middleware/dbCheck.js).
- **Fix Suggestion**: Provide an automated `scripts/backup.sh` utilizing `mongodump` and document disaster recovery steps in `docs/BACKUP_RUNBOOK.md`.

---

### N10 – Usability & Responsive Design
- **Verdict**: **PASS**
- **Assessment**:
  - *Design System*: High-quality Neo-Brutalist design language with curated color tokens, hard drop shadows (`6px 6px 0px #231e25`), and fluid responsive typography (`clamp(...)`).
  - *Responsive Breakpoints*: Mobile-friendly layout scaling across 375 px (mobile), 768 px (tablet), and 1280 px (desktop).
  - *Navigation*: [client/src/components/Navbar.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/components/Navbar.jsx) includes a responsive slide-down mobile hamburger drawer (`mobileOpen` state), active link highlights, dynamic role badges, and live unread notification badges.
  - *Interactive Feedback*: Micro-animations powered by `framer-motion` (button hover tilts, spring physics, smooth status transitions).
- **Evidence**: [client/src/components/Navbar.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/components/Navbar.jsx), [client/src/components/common/NeoBrutalKit.jsx](file:///d:/EprojectMern/EventSphere_Eproject/client/src/components/common/NeoBrutalKit.jsx).

---

### N11 – Accessibility (WCAG Compliance)
- **Verdict**: **PARTIAL**
- **Assessment**:
  - *Color Contrast*: PASS. The Neo-Brutalist palette (#231e25 dark borders on #fff8eb cream backgrounds, black text on #abf139 kiwi and #feb804 yellow) delivers contrast ratios > 7:1, easily passing WCAG AAA standards.
  - *Image Alt Tags*: PASS. Key images provide `alt` attributes ([`ExhibitorProfile.jsx:L407`](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/ExhibitorProfile.jsx#L407)).
  - *Form Input Labels*: PARTIAL. Labels exist visually, but several form inputs lack explicit `id` and `htmlFor` association, hindering screen readers.
  - *Focus Rings*: In several components (e.g. `ForgotPassword.jsx:L113`), inputs use `outline: "none"` without replacing it with an accessible high-contrast focus ring.
  - *ARIA Attributes*: Missing ARIA roles (`role="alert"`, `aria-live="polite"`, `aria-expanded` on accordion toggles).
- **Evidence**: [client/src/pages/ForgotPassword.jsx:L113](file:///d:/EprojectMern/EventSphere_Eproject/client/src/pages/ForgotPassword.jsx#L113).
- **Fix Suggestion**: Add explicit `id`/`htmlFor` bindings to all form fields, add accessible focus outline styles (`:focus-visible`), and include ARIA live regions for toast notifications.

---

### N12 – Cross-Browser Compatibility
- **Verdict**: **PASS**
- **Assessment**:
  - *Standard Web APIs*: Standard HTML5, CSS Grid, Flexbox, and ES2022 JavaScript bundled via Vite.
  - *Vendor Lock-in*: No vendor-specific proprietary prefixes or browser-locked APIs used.
  - *Styling Compatibility*: CSS custom properties and standard SVG icons render uniformly across modern Chromium (Chrome, Edge, Brave), Gecko (Firefox), and WebKit (Safari).
- **Evidence**: [client/vite.config.js](file:///d:/EprojectMern/EventSphere_Eproject/client/vite.config.js), [client/src/index.css](file:///d:/EprojectMern/EventSphere_Eproject/client/src/index.css).

---

### N13 – Mobile Compatibility
- **Verdict**: **PASS**
- **Assessment**:
  - *Viewport Configuration*: [client/index.html:L6](file:///d:/EprojectMern/EventSphere_Eproject/client/index.html#L6) contains standard `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`.
  - *Touch Targets*: Buttons and interactive elements are padded with minimum height/width >= 44 px, satisfying Apple and Google mobile touch target guidelines.
  - *Mobile Navigation*: Mobile hamburger drawer collapses all navigation links into a full-width vertical stack on small screens.
  - *Adaptive Grids*: Floor plans and exhibitor directories collapse gracefully from 3–4 columns to single-column card stacks.
- **Evidence**: [client/index.html:L6](file:///d:/EprojectMern/EventSphere_Eproject/client/index.html#L6), [client/src/components/Navbar.jsx:L400-L540](file:///d:/EprojectMern/EventSphere_Eproject/client/src/components/Navbar.jsx#L400-L540).

---

### N14 – Logging and Monitoring
- **Verdict**: **FAIL**
- **Assessment**:
  - *Absence of Logging Library*: No structured HTTP logger (e.g., `morgan`, `winston`, `pino`) is installed in `server/package.json`.
  - *Raw Console Calls*: Server logging relies exclusively on raw `console.log` and `console.error` calls.
  - *Information Disclosure in Logs*: Raw password reset links containing security tokens are logged to stdout ([`authController.js:L147`](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/authController.js#L147)).
  - *No Log Persistence or Rotation*: Logs are printed to ephemeral console buffers with no disk persistence or log rotation.
- **Evidence**: [server/package.json:L13-L22](file:///d:/EprojectMern/EventSphere_Eproject/server/package.json#L13-L22), [server/server.js:L70](file:///d:/EprojectMern/EventSphere_Eproject/server/server.js#L70).
- **Fix Suggestion**: Install `pino` and `pino-http` (or `morgan`), configure redaction of authorization headers and passwords, and direct logs to a persistent rotating file or log collector.

---

### N15 – Test Coverage
- **Verdict**: **FAIL**
- **Assessment**:
  - *Test Files*: **0 test files exist** across the entire workspace (no `*.test.js`, `*.spec.js`, or `__tests__/` directories).
  - *Test Scripts*: Neither `server/package.json` nor `client/package.json` contains a `test` script.
  - *Test Frameworks*: No testing libraries (`jest`, `vitest`, `supertest`, `playwright`, `cypress`) are installed in either project.
  - *Test Coverage*: **0.0% coverage** across both backend API and frontend application.
- **Evidence**: [server/package.json](file:///d:/EprojectMern/EventSphere_Eproject/server/package.json), [client/package.json](file:///d:/EprojectMern/EventSphere_Eproject/client/package.json).
- **Fix Suggestion**: Install `vitest` + `@testing-library/react` for frontend unit tests, `supertest` for backend API integration tests, and configure a target coverage threshold of 70%+.

---

### N16 – Security Testing (OWASP Baseline)
- **Verdict**: **PARTIAL**
- **Assessment**:
  - *Security Headers*: **Missing**. `helmet` is not installed; missing CSP, HSTS, X-Content-Type-Options, and X-Frame-Options headers.
  - *CORS Configuration*: In [server/server.js:L34](file:///d:/EprojectMern/EventSphere_Eproject/server/server.js#L34), `app.use(cors())` runs with open wildcard configuration, allowing cross-origin requests from any domain (though Socket.IO restricts origin to `http://localhost:5173`).
  - *NoSQL Injection*: **Missing**. `express-mongo-sanitize` is not installed; query inputs are not sanitized.
  - *XSS*: PASS on client. React automatically escapes JSX expressions; no `dangerouslySetInnerHTML` is used.
  - *Rate Limiting*: Missing on sensitive endpoints.
  - *Committed Secrets*: `server/.env` is tracked on disk with real MongoDB Atlas credentials and password.
- **Evidence**: [server/server.js:L34](file:///d:/EprojectMern/EventSphere_Eproject/server/server.js#L34), [server/package.json](file:///d:/EprojectMern/EventSphere_Eproject/server/package.json).
- **Fix Suggestion**: Install `helmet` and `express-mongo-sanitize`, restrict Express CORS origin to `process.env.CLIENT_URL`, and rotate the MongoDB Atlas password.

---

### N17 – User Documentation
- **Verdict**: **PARTIAL**
- **Assessment**:
  - *Present Documentation*:
    - High-level role workflows for Admin, Exhibitor, and Attendee in `README.md` ([lines 63–82](file:///d:/EprojectMern/EventSphere_Eproject/README.md#L63-L82)).
    - 1-click demo login credentials table in `README.md` ([lines 311–320](file:///d:/EprojectMern/EventSphere_Eproject/README.md#L311-L320)).
    - Interactive spring-physics FAQ accordion on public landing page ([`FAQSection.tsx`](file:///d:/EprojectMern/EventSphere_Eproject/client/src/components/landing/faq/FAQSection.tsx)).
  - *Missing Documentation*:
    - No step-by-step end-user manual or PDF guide.
    - No illustrated tutorials for booth reservation or session registration.
- **Evidence**: [README.md:L311](file:///d:/EprojectMern/EventSphere_Eproject/README.md#L311).
- **Fix Suggestion**: Create an illustrated `docs/USER_GUIDE.md` detailing step-by-step workflows for each user role.

---

### N18 – Developer Documentation
- **Verdict**: **PARTIAL**
- **Assessment**:
  - *Present Documentation*:
    - Architecture diagram and complete folder structure in `README.md` ([lines 44–61, 118–244](file:///d:/EprojectMern/EventSphere_Eproject/README.md#L44-L61)).
    - Installation and environment setup steps ([lines 249–308](file:///d:/EprojectMern/EventSphere_Eproject/README.md#L249-L308)).
    - Complete API endpoint specification and WebSocket events table ([lines 323–377](file:///d:/EprojectMern/EventSphere_Eproject/README.md#L323-L377)).
  - *Documentation Drift*:
    - `README.md:L284` references `npm run seed` which does not exist in `server/package.json` (actual scripts are `seed:admin` and `seed:demo`).
    - References `middleware/roleMiddleware.js` and `middleware/uploadMiddleware.js`, whereas actual filenames are `authMiddleware.js` and `upload.js`.
    - Omits database schema data dictionary / field definition tables.
- **Evidence**: [README.md:L218-L220,L284](file:///d:/EprojectMern/EventSphere_Eproject/README.md#L218-L220).
- **Fix Suggestion**: Synchronize `README.md` scripts and file paths with the actual codebase and add a schema dictionary section.

---

### N19 – Demo Video
- **Verdict**: **FAIL**
- **Assessment**:
  - Complete filesystem scan for video formats (`*.mp4`, `*.webm`, `*.mov`, `*.mkv`, `*.avi`) returned zero files.
  - Grep search for video hosting URLs (YouTube, Loom, Vimeo, Google Drive) across all files returned zero links.
  - The requirement for a video showing the complete working of the application is unfulfilled in the repository.
- **Evidence**: Filesystem search across entire workspace returned 0 video files.
- **Fix Suggestion**: Record a 5–10 minute end-to-end screencast demonstrating admin expo creation, exhibitor booth reservation, and attendee session bookmarking, and link it in `README.md`.

---

## 3. Master Non-Functional Audit Table

| ID | Requirement | Verdict | Real-World Evidence & Code Citation | Identified Gap / Recommended Fix |
| --- | --- | :---: | --- | --- |
| **N1** | Response time 1–2 s | **PARTIAL** | Only `User.email` & `Registration` indexed; all list queries do unbounded `.find()`. | Add pagination (`limit`/`skip`) and compound indexes on `Booth`, `Session`, `Message`. |
| **N2** | Scalability | **PARTIAL** | Stateless JWT auth; but Socket.IO has no Redis adapter and files upload to local disk. | Install `@socket.io/redis-adapter` and migrate file storage to S3/Cloudinary. |
| **N3** | Hundreds of concurrent users | **PARTIAL** | Mongoose default pool size 10 ([`db.js:L53`](file:///d:/EprojectMern/EventSphere_Eproject/server/config/db.js#L53)); single Node process; no rate limiting. | Configure `maxPoolSize: 100`, PM2 cluster mode, and request rate limiting. |
| **N4** | Horizontal scaling | **PARTIAL** | Config via `.env`; but no `Dockerfile` or `docker-compose.yml` present in repository. | Create multi-stage `Dockerfile` and `docker-compose.yml`. |
| **N5** | Encryption at rest / transit | **PARTIAL** | Bcrypt salt 10, Atlas TLS; but plaintext reset tokens logged to stdout ([`authController.js:147`](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/authController.js#L147)). | Suppress token console logging and provide Nginx SSL reverse-proxy template. |
| **N6** | Secure authentication | **PARTIAL** | 7-day JWT expiry; but token kept in `localStorage` (XSS risk); zero login rate limiting. | Use `httpOnly` secure cookies and install `express-rate-limit`. |
| **N7** | Authorization (Anti-IDOR) | **PASS** | Role-check middleware on routes; controllers verify `req.user._id` resource ownership. | None. Proper IDOR protection across profile, booths, registrations, messages. |
| **N8** | GDPR and consent | **FAIL** | No `/privacy` route, no consent checkbox, no data export, no account deletion endpoint. | Implement Privacy Policy, registration consent checkbox, and data export/erasure. |
| **N9** | Uptime 99% & backups | **PARTIAL** | `/api/health` endpoint, DB reconnection loop, 503 outage guard; but no backup script. | Create `scripts/backup.sh` utilizing `mongodump` and document recovery steps. |
| **N10** | Usability & responsive design | **PASS** | High-contrast Neo-Brutal system, fluid `clamp` typography, mobile drawer in `Navbar.jsx`. | None. Responsive across 375 px, 768 px, and 1280 px viewports. |
| **N11** | Accessibility (WCAG) | **PARTIAL** | Strong contrast (>7:1); but missing `aria-*` tags, missing `htmlFor` on inputs, `outline:none`. | Add accessible focus rings, `id`/`htmlFor` bindings, and ARIA live regions. |
| **N12** | Cross-browser compatibility | **PASS** | Standard ES6+ and CSS Grid/Flexbox bundled via Vite; runs on Chromium, Firefox, WebKit. | None. Standard modern web API usage throughout. |
| **N13** | Mobile compatibility | **PASS** | `<meta name="viewport">` set; mobile hamburger drawer; touch targets >= 44 px. | None. Mobile navigation and responsive layouts fully functional. |
| **N14** | Logging and monitoring | **FAIL** | No `morgan`/`winston`/`pino`; raw `console.log` only; secrets printed to stdout. | Install `pino` structured logger and remove plaintext secret logs. |
| **N15** | Test coverage | **FAIL** | Zero test files exist in repository; no test runner configured; **0.0% coverage**. | Configure Vitest, React Testing Library, Supertest; target 70%+ coverage. |
| **N16** | Security testing (OWASP) | **PARTIAL** | Bcrypt & JWT active; but lacks Helmet headers, NoSQL sanitize, CORS whitelist, secrets in `.env`. | Add `helmet`, `express-mongo-sanitize`, CORS origin whitelist, and rotate Atlas secrets. |
| **N17** | User documentation | **PARTIAL** | Role summaries and demo credentials in `README.md`; FAQ on landing; but no user manual. | Author comprehensive step-by-step `docs/USER_GUIDE.md`. |
| **N18** | Developer documentation | **PARTIAL** | Architecture & endpoints in `README.md`; but contains script drift and lacks data dictionary. | Update `README.md` scripts/paths and add Mongoose schema data dictionary. |
| **N19** | Demo video | **FAIL** | Zero video files (`.mp4`, `.webm`) and zero video hosting URLs found in codebase. | Record and link a 5–10 minute application walkthrough video. |

---

*End of Phase 2 — Non-Functional Requirements Audit complete.*
