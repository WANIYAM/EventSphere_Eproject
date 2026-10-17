# Phase 3 – Security Audit & Vulnerability Assessment

**Auditor**: Antigravity Agent  
**Date**: 2026-10-17  
**Scope**: Read-Only Security Review against S1–S12 (OWASP Top 10 for MERN)  
**Status**: Comprehensive Vulnerability Assessment Complete  

---

## 1. Executive Summary & Vulnerability Severity Distribution

A comprehensive, read-only static security audit was performed across the EventSphere client and server codebases, evaluating authentication mechanics, authorization boundaries, cryptographic standards, input sanitization, information disclosure, and session management.

| Severity | Count | Primary Impact |
| :--- | :---: | :--- |
| 🔴 **CRITICAL** | **1** | Full, unauthenticated account takeover via password reset token leakage in API response |
| 🟠 **HIGH** | **3** | Unlimited brute-force attacks (no rate limiting), NoSQL injection risks, wildcard CORS & missing Helmet headers |
| 🟡 **MEDIUM** | **3** | Hardcoded JWT fallback secret in Socket.IO, JWT in `localStorage`, live Atlas credentials in `.env` |
| 🟢 **LOW** | **1** | ReDoS risks on unescaped regex queries and unbounded `.find()` resource exhaustion |
| **TOTAL FINDINGS** | **8** | — |

### Check Compliance Summary (S1–S12)
- **PASS**: **5** (S1, S5, S6, S8, S9, S10)
- **PARTIAL**: **3** (S2, S11)
- **FAIL**: **4** (S3, S4, S7, S12)

---

## 2. In-Depth Security Audit by Checklist (S1–S12)

### S1 – Passwords Hashed with Bcrypt/Argon2 with Adequate Cost Factor
- **Verdict**: **PASS**
- **Severity**: None
- **Code Location**: [server/models/User.js:L26-L36](file:///d:/EprojectMern/EventSphere_Eproject/server/models/User.js#L26-L36)
- **Analysis**:
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
  - Uses `bcryptjs` with salt round `10` (recommended industry standard).
  - Pre-save hook accurately checks `this.isModified("password")` to avoid redundant double-hashing on non-password profile edits.
  - Reset password controller invokes `user.save()`, properly triggering the hashing hook. Passwords are never stored in plain text.

---

### S2 – JWT: Strong Secret in Environment, Expiry Set, Verified on Every Route
- **Verdict**: **PARTIAL**
- **Severity**: 🟡 **MEDIUM**
- **Code Location**: [server/controllers/authController.js:L6-L8](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/authController.js#L6-L8), [server/middleware/authMiddleware.js:L15](file:///d:/EprojectMern/EventSphere_Eproject/server/middleware/authMiddleware.js#L15), [server/utils/socket.js:L20](file:///d:/EprojectMern/EventSphere_Eproject/server/utils/socket.js#L20)
- **Analysis**:
  - Main API uses `jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" })`.
  - HTTP auth middleware strictly calls `jwt.verify(token, process.env.JWT_SECRET)`.
  - **Vulnerability**: In `server/utils/socket.js:L20`, the Socket.IO authentication middleware uses:
    ```javascript
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    ```
    If `process.env.JWT_SECRET` is unset or fails to load, Socket.IO accepts tokens signed with the static string `"fallback_secret"`, allowing attackers to forge arbitrary user and role identities over WebSocket.
  - **Expiry**: 7 days is long for an access token without a token revocation list (blacklist) or refresh token rotation mechanism. Logging out does not invalidate the token server-side.
- **Proof-of-Concept (described in words)**:
  An attacker detects that the server environment temporarily lacks `JWT_SECRET`. The attacker signs an arbitrary payload `{"id": "admin_user_id", "role": "admin"}` using the literal secret `"fallback_secret"` using standard `jsonwebtoken`, then connects to `ws://localhost:5000` via Socket.IO client supplying this token in `auth.token`. The server admits the socket connection and joins the socket into `role:admin`.
- **Recommended Fix**:
  Remove `"fallback_secret"`. Fail fast on startup if `JWT_SECRET` is missing. Implement an access-token + refresh-token architecture (15-min access token + 7-day refresh token).

---

### S3 – Password Reset Tokens: Random, Single-Use, Short-Lived, Stored Hashed
- **Verdict**: **FAIL**
- **Severity**: 🔴 **CRITICAL**
- **Code Location**: [server/controllers/authController.js:L138-L153](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/authController.js#L138-L153)
- **Analysis**:
  - The token generation itself adheres to cryptographic standards: generates 20 random bytes via `crypto.randomBytes(20)`, hashes it with SHA-256 for database storage (`user.resetToken`), and sets an expiration timestamp of 15 minutes (`Date.now() + 15 * 60 * 1000`).
  - **CRITICAL FLAW**: The endpoint `POST /api/auth/forgot-password` does **not** email the reset token. Instead, it returns the raw token and the entire password reset URL directly in the HTTP JSON response body!
    ```javascript
    const resetLink = `http://localhost:5173/reset-password/${rawToken}`;
    console.log(`[DEV Password Reset Link]: ${resetLink}`);

    return res.status(200).json({
      message: successMsg,
      resetToken: rawToken,
      resetLink
    });
    ```
  - Anyone can send a forgot-password request for **any** user's email address (including `admin@eventsphere.com`), and the server will return the valid password reset URL in the response, enabling instantaneous account takeover without email access.
- **Proof-of-Concept (described in words)**:
  1. Attacker sends an unauthenticated HTTP POST request to `POST http://localhost:5000/api/auth/forgot-password` with JSON payload `{"email": "admin@eventsphere.com"}`.
  2. The server responds with HTTP 200 OK and JSON body:
     `{"message": "...", "resetToken": "7f8b9a...", "resetLink": "http://localhost:5173/reset-password/7f8b9a..."}`.
  3. Attacker extracts `resetToken` from the response, visits the link or directly sends `PUT /api/auth/reset-password/7f8b9a...` with `{"password": "AttackerControlled123!"}`.
  4. The administrator's password is now changed, giving the attacker full unauthorized administrative access.
- **Recommended Fix**:
  Immediately remove `resetToken` and `resetLink` from the JSON response and console logs. Return only a generic message: `{"message": "If that email exists, a reset link has been dispatched."}`. Integrate `nodemailer` to dispatch the link privately to the user's verified email address.

---

### S4 – NoSQL Injection: Query Sanitization & Raw Body Handling
- **Verdict**: **FAIL**
- **Severity**: 🟠 **HIGH**
- **Code Location**: [server/controllers/userController.js:L7-L11](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/userController.js#L7-L11), [server/controllers/applicationController.js:L74-L80](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/applicationController.js#L74-L80), [server/controllers/exhibitorController.js:L33](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/exhibitorController.js#L33)
- **Analysis**:
  - `express-mongo-sanitize` is **not installed** in `server/package.json`.
  - In `userController.js`:
    ```javascript
    const { role } = req.query;
    const filter = {};
    if (role) filter.role = role;
    const users = await User.find(filter)...
    ```
    If an attacker passes query parameters as nested objects (e.g. `?role[$ne]=null`), Express parses this into an object `{ $ne: null }`. Mongoose passes this directly to MongoDB, enabling query selector injection.
  - In `applicationController.js`:
    ```javascript
    const { status, expo } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (expo) filter.expo = expo;
    const applications = await Application.find(filter)...
    ```
    Unsanitized object queries like `status[$nin]=[]` bypass expected enum filters.
  - In `exhibitorController.js`:
    ```javascript
    userFilter.category = { $regex: new RegExp(`^${category}$`, "i") };
    ```
    Unsanitized user input is passed directly to the `RegExp` constructor without escaping special regex characters, exposing the Node process to Regular Expression Denial of Service (ReDoS).
- **Proof-of-Concept (described in words)**:
  1. An attacker issues `GET /api/users?role[$ne]=null` with an authenticated admin token. Instead of filtering by a single string role, MongoDB receives `{ role: { $ne: null } }`, dumping all user roles.
  2. An attacker sends `GET /api/exhibitors?category=((((((a%2B)%2B)%2B)%2B)%2B)%2B)%21`. The unescaped regex creates catastrophic exponential backtracking in the V8 JavaScript engine, pegging the Node.js event loop at 100% CPU and denying service to all other users.
- **Recommended Fix**:
  Install `express-mongo-sanitize` and apply it as global middleware in `server.js` (`app.use(mongoSanitize())`). Escape all user input before passing into `new RegExp(escapeRegex(input), "i")`.

---

### S5 – Cross-Site Scripting (XSS): Output Encoding & Unsafe HTML
- **Verdict**: **PASS**
- **Severity**: None
- **Code Location**: [client/src/](file:///d:/EprojectMern/EventSphere_Eproject/client/src)
- **Analysis**:
  - Rigorous search across all JSX files confirmed **0 occurrences** of `dangerouslySetInnerHTML`.
  - Zero usages of `innerHTML`, `outerHTML`, `document.write`, or `eval()`.
  - React's virtual DOM automatically encodes all rendered strings before inserting them into the DOM, neutralizing standard reflected and stored HTML script injection.
  - External links use `rel="noreferrer"` and `target="_blank"`.

---

### S6 – CSRF Protection
- **Verdict**: **PASS**
- **Severity**: None
- **Analysis**:
  - Cross-Site Request Forgery (CSRF) requires a browser to automatically attach credentials (such as session cookies or HTTP Basic Auth headers) to ambient cross-site requests.
  - EventSphere uses **strictly stateless Bearer token authentication** (`Authorization: Bearer <token>`). The browser does not send this header automatically on cross-site form submissions or image tags.
  - Therefore, traditional CSRF attacks are technically inapplicable to this architecture.

---

### S7 – Helmet, CORS Restricted to Known Origins, Rate Limiting
- **Verdict**: **FAIL**
- **Severity**: 🟠 **HIGH**
- **Code Location**: [server/server.js:L34](file:///d:/EprojectMern/EventSphere_Eproject/server/server.js#L34), [server/package.json](file:///d:/EprojectMern/EventSphere_Eproject/server/package.json)
- **Analysis**:
  1. **Helmet**: `helmet` is **not installed**. The application returns zero security response headers:
     - No `Content-Security-Policy` (CSP)
     - No `X-Content-Type-Options: nosniff` (vulnerable to MIME type sniffing)
     - No `Strict-Transport-Security` (HSTS)
     - No `X-Frame-Options` (vulnerable to Clickjacking in iframes)
  2. **CORS Policy**: In `server/server.js:L34`:
     ```javascript
     app.use(cors());
     ```
     `cors()` is invoked with **zero configuration options**. This defaults to `Access-Control-Allow-Origin: *`, allowing arbitrary external origins to make cross-origin requests. (Note: Socket.IO specifies `origin: "http://localhost:5173"`, but the Express HTTP REST layer is completely open).
  3. **Rate Limiting**: `express-rate-limit` is **not installed**. Sensitive endpoints (`POST /api/auth/login`, `POST /api/auth/register`, `POST /api/auth/forgot-password`, `POST /api/messages`) have no rate limits, permitting unlimited brute-force password cracking and resource spamming.
- **Proof-of-Concept (described in words)**:
  An attacker writes a client-side script running on `http://attacker-controlled-site.com` that sends thousands of requests per minute to `http://localhost:5000/api/auth/login` attempting dictionary passwords against `admin@eventsphere.com`. Because CORS allows `*` and no rate limiter exists, the server evaluates every attempt without delay or throttling.
- **Recommended Fix**:
  1. Install `helmet` and apply `app.use(helmet())`.
  2. Restrict CORS in `server.js`:
     ```javascript
     app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
     ```
  3. Install `express-rate-limit` and configure a limiter for authentication routes:
     ```javascript
     const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: "Too many attempts." });
     app.use("/api/auth/login", authLimiter);
     app.use("/api/auth/forgot-password", authLimiter);
     ```

---

### S8 – File Upload Security: MIME Validation, Size Limits, Non-Executable Storage
- **Verdict**: **PASS**
- **Severity**: None
- **Code Location**: [server/middleware/upload.js:L5-L42](file:///d:/EprojectMern/EventSphere_Eproject/server/middleware/upload.js#L5-L42)
- **Analysis**:
  - File Size: Capped at 5 MB (`limits: { fileSize: 5 * 1024 * 1024 }`).
  - Safe Naming: Files are renamed using randomized entropy (`${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`), preventing path traversal attacks (e.g. `../../etc/passwd`).
  - Whitelist: Strict extension validation:
    - Banners: `.jpeg`, `.jpg`, `.png`, `.webp` (and verified `mimetype.startsWith("image/")`).
    - Documents: `.jpeg`, `.jpg`, `.png`, `.webp`, `.pdf`, `.doc`, `.docx`.
    - Dangerous extensions (`.exe`, `.sh`, `.php`, `.js`, `.html`, `.svg`) are blocked.
  - Storage: Files stored in `uploads/` directory on local disk.

---

### S9 – Mass Assignment Protection
- **Verdict**: **PASS**
- **Severity**: None
- **Code Location**: [server/controllers/authController.js:L30-L34](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/authController.js#L30-L34), [server/controllers/profileController.js:L21-L35](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/profileController.js#L21-L35)
- **Analysis**:
  - Registration: `authController.js` explicitly checks `if (userRole === "admin" || !["exhibitor", "attendee"].includes(userRole))` and returns HTTP 400. A user sending `{"role": "admin"}` in `POST /api/auth/register` cannot elevate their privileges.
  - Profile Update: `profileController.js` explicitly deconstructs only benign fields: `{ name, phone, company, description, website, category }`. The `role` and `password` properties cannot be modified via `PUT /api/profile`.

---

### S10 – Insecure Direct Object References (IDOR) & Privilege Escalation on `:id` Routes
- **Verdict**: **PASS**
- **Severity**: None
- **Code Location**: All 17 `:id` routes across `server/routes/` and `server/controllers/`
- **Analysis**:
  - All mutating routes on expos, sessions, and booth assignments are strictly protected by `protect, authorize("admin")`.
  - Attendee and exhibitor mutating routes enforce cryptographic token ownership checks:
    - `PUT /api/booths/:id/cancel`: Enforces `booth.exhibitor.toString() === req.user._id.toString()`.
    - `PUT /api/booths/:id/my-details`: Enforces `booth.exhibitor.toString() === req.user._id.toString()`.
    - `DELETE /api/registrations/:id`: Enforces `reg.user.toString() === req.user._id.toString()`.
    - `PUT /api/messages/:id/read`: Enforces `message.receiver.toString() === req.user._id.toString()`.
    - `PUT /api/notifications/:id/read`: Enforces `Notification.findOne({ _id: id, user: req.user.id })`.
  - Tampering with the `:id` parameter to access another user's data returns HTTP 403 or 404.

---

### S11 – Secrets Management & Dependency Audit
- **Verdict**: **PARTIAL**
- **Severity**: 🟡 **MEDIUM**
- **Code Location**: [server/.env](file:///d:/EprojectMern/EventSphere_Eproject/server/.env), [server/seed/createAdmin.js:L21](file:///d:/EprojectMern/EventSphere_Eproject/server/seed/createAdmin.js#L21)
- **Analysis**:
  - *Git Tracking*: Confirmed that `server/.env` is ignored by `.gitignore` and has **never been committed** to git history (verified via `git log --all --full-history -- "server/.env"`).
  - *Local Disk Disclosure*: However, the working directory file `server/.env` contains the live MongoDB Atlas production URI with embedded plaintext credentials (`admin:JnH6nqWM0bKOvVdy`) and the production JWT secret.
  - *Hardcoded Credentials in Seed Files*:
    - `server/seed/createAdmin.js:L21` hardcodes admin password `Admin@123`.
    - `server/seed/seedDemoData.js:L22` hardcodes demo password `Demo@123`.
  - *Dependency Audit*: The dependencies are on latest modern releases (Express 5.2.1, Mongoose 9.10.3, React 19.2.8, Vite 8.3.0). Zero packages with published critical CVEs are present in `package.json`.
- **Recommended Fix**:
  Rotate the MongoDB Atlas password in the Atlas console immediately. Use environment variables for seed script passwords rather than hardcoded strings.

---

### S12 – Sensitive Data Exposure in API Responses
- **Verdict**: **FAIL**
- **Severity**: 🔴 **CRITICAL**
- **Code Location**: [server/controllers/authController.js:L149-L153](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/authController.js#L149-L153)
- **Analysis**:
  - Passwords and password hashes are properly hidden: `User.js` models do not serialize passwords, and controllers explicitly invoke `.select("-password")`.
  - **CRITICAL FAILURE**: As documented under **S3**, `POST /api/auth/forgot-password` returns the plaintext `resetToken` and full `resetLink` directly in the API JSON response payload to unauthenticated callers.
- **Proof-of-Concept (described in words)**:
  An unauthenticated client issues `curl -X POST http://localhost:5000/api/auth/forgot-password -d '{"email":"admin@eventsphere.com"}' -H "Content-Type: application/json"`. The response body contains `{ "resetToken": "...", "resetLink": "..." }`, exposing the sensitive one-time password reset secret over the wire to anyone.
- **Recommended Fix**:
  Strip `resetToken` and `resetLink` from the JSON response object immediately.

---

## 3. Prioritized Vulnerability Remediation Register

| Vulnerability ID | Title | Severity | Location | Recommended Remediation |
| :--- | :--- | :---: | :--- | :--- |
| **SEC-01** | Password Reset Token Leaked in API Response | 🔴 **CRITICAL** | `authController.js:149-153` | Remove `resetToken` and `resetLink` from JSON response and console logs; send reset links exclusively via private email. |
| **SEC-02** | Absence of Rate Limiting on Auth Endpoints | 🟠 **HIGH** | `server.js`, `authRoutes.js` | Install `express-rate-limit` and apply strict rate limits (e.g. 5 requests / 15 mins) on login and password reset routes. |
| **SEC-03** | NoSQL Injection & Query Selector Pollution | 🟠 **HIGH** | `server.js`, `userController.js`, `applicationController.js` | Install `express-mongo-sanitize` globally; validate query inputs against explicit scalar types. |
| **SEC-04** | Missing Helmet Headers & Open CORS Policy | 🟠 **HIGH** | `server.js:34` | Install `helmet`; configure CORS to whitelist only `CLIENT_URL`. |
| **SEC-05** | Insecure Fallback Secret in Socket.IO JWT Verification | 🟡 **MEDIUM** | `socket.js:20` | Remove `"fallback_secret"`; fail immediately on server startup if `JWT_SECRET` is undefined. |
| **SEC-06** | JWT Token Stored in `localStorage` | 🟡 **MEDIUM** | `AuthContext.jsx:44` | Migrate token transmission to `httpOnly`, `secure`, `SameSite=Strict` cookies. |
| **SEC-07** | Live Atlas Credentials in Working Directory `.env` | 🟡 **MEDIUM** | `server/.env` | Rotate the Atlas password; replace local `.env` with a non-production development cluster string. |
| **SEC-08** | Unescaped Regex Queries (ReDoS Risk) | 🟢 **LOW** | `exhibitorController.js:33` | Sanitize and escape special regex characters before constructing `RegExp` queries. |

---

## 4. Master Security Compliance Matrix (S1–S12)

| ID | Check | Verdict | Severity | Primary Evidence | Status / Remediation |
| --- | --- | :---: | :---: | --- | --- |
| **S1** | Password hashing (bcrypt salt 10) | **PASS** | — | [`User.js:27-31`](file:///d:/EprojectMern/EventSphere_Eproject/server/models/User.js#L27-L31) | Robust bcrypt hashing in pre-save hook. |
| **S2** | JWT secret, expiry, verification | **PARTIAL** | 🟡 Medium | [`authMiddleware.js:15`](file:///d:/EprojectMern/EventSphere_Eproject/server/middleware/authMiddleware.js#L15), [`socket.js:20`](file:///d:/EprojectMern/EventSphere_Eproject/server/utils/socket.js#L20) | Token verification active; remove Socket fallback secret. |
| **S3** | Reset tokens: random, single-use, hashed | **FAIL** | 🔴 Critical | [`authController.js:149`](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/authController.js#L149) | Tokens are hashed in DB, but leaked in JSON response! |
| **S4** | NoSQL injection & query sanitization | **FAIL** | 🟠 High | [`userController.js:8`](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/userController.js#L8) | No `express-mongo-sanitize`; raw `req.query` passed to queries. |
| **S5** | XSS protection & output encoding | **PASS** | — | Entire `client/src/` | 0 `dangerouslySetInnerHTML`; React automatic JSX escaping. |
| **S6** | CSRF protection | **PASS** | — | `server.js` | N/A — Pure Bearer token auth; ambient cookies not used. |
| **S7** | Helmet, CORS restriction, rate limiting | **FAIL** | 🟠 High | [`server.js:34`](file:///d:/EprojectMern/EventSphere_Eproject/server/server.js#L34) | No Helmet; wildcard CORS; zero rate limiting installed. |
| **S8** | File uploads: types, size, safe names | **PASS** | — | [`upload.js:20-42`](file:///d:/EprojectMern/EventSphere_Eproject/server/middleware/upload.js#L20-L42) | 5 MB limit, extension whitelist, safe randomized naming. |
| **S9** | Mass assignment protection | **PASS** | — | [`authController.js:32`](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/authController.js#L32) | `role: admin` blocked at register; whitelist in profile updates. |
| **S10** | IDOR and privilege escalation on `:id` | **PASS** | — | All 17 `:id` controllers | Role middleware + explicit resource ownership checks. |
| **S11** | Secrets management & npm audit | **PARTIAL** | 🟡 Medium | [`server/.env`](file:///d:/EprojectMern/EventSphere_Eproject/server/.env) | Not in git, but live Atlas credentials on disk; rotate password. |
| **S12** | Sensitive data never returned by APIs | **FAIL** | 🔴 Critical | [`authController.js:151`](file:///d:/EprojectMern/EventSphere_Eproject/server/controllers/authController.js#L151) | Password reset token and link returned in API response body. |

---

*End of Phase 3 — Security Audit complete.*
