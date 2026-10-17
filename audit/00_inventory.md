# Phase 0 – Reconnaissance & Inventory

**Auditor**: Antigravity Agent  
**Date**: 2026-10-17  
**Scope**: Full codebase inventory — no requirement judgement

---

## 1. Tech Stack & Versions

| Layer | Technology | Version (from package.json) |
| --- | --- | --- |
| **Runtime** | Node.js | Not pinned (requires ≥ 18 per README) |
| **Package manager** | npm | Not pinned (requires ≥ 9 per README) |
| **Backend framework** | Express | 5.2.1 |
| **Database ODM** | Mongoose | 9.10.3 |
| **Database** | MongoDB Atlas | Cloud-hosted (connection string in .env) |
| **Auth** | jsonwebtoken | 9.0.3 |
| **Password hashing** | bcryptjs | 3.0.3 |
| **File uploads** | Multer | 2.4.0 |
| **Real-time** | Socket.IO (server) | 4.8.4 |
| **CORS** | cors | 2.8.6 |
| **Env** | dotenv | 18.0.4 |
| **Dev** | nodemon | 3.1.14 |
| **Frontend framework** | React | 19.2.8 |
| **Bundler** | Vite | 8.3.0 |
| **Routing** | react-router-dom | 7.18.4 |
| **HTTP client** | axios | 1.20.0 |
| **Animation** | framer-motion | 13.5.0 |
| **Smooth scroll** | lenis | 1.3.26 |
| **Charts** | recharts | 3.10.1 |
| **Real-time (client)** | socket.io-client | 4.8.4 |

---

## 2. Folder Tree

```
EventSphere_Eproject/
├── README.md
├── EventSphere MERN Project – Audit Plan.md
├── client/
│   ├── public/
│   ├── dist/                          # Built output
│   ├── src/
│   │   ├── App.jsx                    # Router & layout
│   │   ├── main.jsx                   # Vite entry
│   │   ├── index.css                  # Global styles
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── NotificationBell.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── ServerStatusBanner.jsx
│   │   │   ├── common/
│   │   │   │   └── NeoBrutalKit.jsx
│   │   │   └── landing/              # Public landing page components
│   │   │       ├── App.tsx
│   │   │       ├── cards/
│   │   │       ├── common/
│   │   │       ├── faq/
│   │   │       ├── layout/
│   │   │       ├── navigation/
│   │   │       ├── sections/
│   │   │       └── tickets/
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── SocketContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── Expos.jsx
│   │   │   ├── ExpoDetails.jsx
│   │   │   ├── Exhibitors.jsx
│   │   │   ├── ExhibitorProfile.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Messages.jsx
│   │   │   ├── Feedback.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── Unauthorized.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ExhibitorDashboard.jsx
│   │   │   ├── AttendeeDashboard.jsx    # Not routed in App.jsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminExpos.jsx
│   │   │   │   ├── AdminBooths.jsx
│   │   │   │   ├── AdminSessions.jsx
│   │   │   │   ├── AdminApplications.jsx
│   │   │   │   ├── AdminFeedback.jsx
│   │   │   │   └── AdminAnalytics.jsx
│   │   │   ├── exhibitor/
│   │   │   │   ├── ExhibitorProfile.jsx
│   │   │   │   ├── ExhibitorExpos.jsx
│   │   │   │   ├── MyApplications.jsx
│   │   │   │   └── ExhibitorBooths.jsx
│   │   │   └── attendee/
│   │   │       ├── AttendeeExpos.jsx    # Not routed in App.jsx
│   │   │       ├── ExpoDetails.jsx      # Not routed in App.jsx
│   │   │       ├── ExhibitorProfileView.jsx  # Not routed in App.jsx
│   │   │       └── MySchedule.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── styles/
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── .env
│   ├── .env.example
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── analyticsController.js
│   │   ├── applicationController.js
│   │   ├── authController.js
│   │   ├── boothController.js
│   │   ├── exhibitorController.js
│   │   ├── expoController.js
│   │   ├── feedbackController.js
│   │   ├── messageController.js
│   │   ├── notificationController.js
│   │   ├── profileController.js
│   │   ├── publicController.js
│   │   ├── registrationController.js
│   │   ├── sessionController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── dbCheck.js
│   │   ├── upload.js
│   │   └── validateObjectId.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Expo.js
│   │   ├── Booth.js
│   │   ├── Application.js
│   │   ├── Session.js
│   │   ├── Registration.js
│   │   ├── Message.js
│   │   ├── Feedback.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── analyticsRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── authRoutes.js
│   │   ├── boothRoutes.js
│   │   ├── exhibitorRoutes.js
│   │   ├── expoRoutes.js
│   │   ├── feedbackRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── profileRoutes.js
│   │   ├── publicRoutes.js
│   │   ├── registrationRoutes.js
│   │   ├── sessionRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── socket.js
│   │   ├── notify.js
│   │   └── reminders.js
│   ├── seed/
│   │   ├── createAdmin.js
│   │   └── seedDemoData.js
│   ├── scripts/
│   │   └── dropOldRegistrationIndexes.js
│   ├── uploads/
│   ├── server.js
│   └── package.json
```

---

## 3. Every Mongoose Model with Fields

### User (`server/models/User.js`)
| Field | Type | Constraints |
| --- | --- | --- |
| name | String | required |
| email | String | required, unique |
| password | String | required (hashed via pre-save hook, bcrypt salt 10) |
| role | String | enum: `admin`, `exhibitor`, `attendee`; default: `attendee` |
| phone | String | optional |
| company | String | optional |
| description | String | optional |
| website | String | optional |
| category | String | optional |
| logo | String | optional |
| resetToken | String | optional |
| resetTokenExpire | Date | optional |
| timestamps | auto | createdAt, updatedAt |

### Expo (`server/models/Expo.js`)
| Field | Type | Constraints |
| --- | --- | --- |
| title | String | required |
| description | String | optional |
| theme | String | optional |
| location | String | optional |
| startDate | Date | optional |
| endDate | Date | optional |
| image | String | default: "" |
| createdBy | ObjectId → User | optional |
| timestamps | auto | createdAt, updatedAt |

### Booth (`server/models/Booth.js`)
| Field | Type | Constraints |
| --- | --- | --- |
| expo | ObjectId → Expo | required |
| boothNumber | String | required |
| size | String | optional |
| price | Number | optional |
| status | String | enum: `available`, `reserved`, `booked`; default: `available` |
| exhibitor | ObjectId → User | optional |
| details | String | optional |
| staff | Array of `{ name: String (required), role: String }` | optional |
| timestamps | auto | createdAt, updatedAt |

### Application (`server/models/Application.js`)
| Field | Type | Constraints |
| --- | --- | --- |
| expo | ObjectId → Expo | required |
| exhibitor | ObjectId → User | required |
| companyName | String | optional |
| products | String | optional |
| documents | [String] | optional (file paths) |
| status | String | enum: `pending`, `approved`, `rejected`; default: `pending` |
| booth | ObjectId → Booth | optional |
| timestamps | auto | createdAt, updatedAt |

### Session (`server/models/Session.js`)
| Field | Type | Constraints |
| --- | --- | --- |
| expo | ObjectId → Expo | required |
| title | String | required |
| speaker | String | optional |
| topic | String | optional |
| location | String | optional |
| startTime | Date | optional |
| endTime | Date | optional |
| reminderSent | Boolean | default: false |
| timestamps | auto | createdAt, updatedAt |

### Registration (`server/models/Registration.js`)
| Field | Type | Constraints |
| --- | --- | --- |
| user | ObjectId → User | required |
| expo | ObjectId → Expo | required |
| session | ObjectId → Session | optional |
| type | String | enum: `expo`, `session`; default: `expo` |
| registered | Boolean | default: true |
| bookmarked | Boolean | default: false |
| timestamps | auto | createdAt, updatedAt |
| **Indexes** | | Partial unique: `{user,expo}` when type=expo; Partial unique: `{user,session}` when type=session |

### Message (`server/models/Message.js`)
| Field | Type | Constraints |
| --- | --- | --- |
| sender | ObjectId → User | required |
| receiver | ObjectId → User | required |
| subject | String | optional |
| body | String | optional |
| read | Boolean | default: false |
| timestamps | auto | createdAt, updatedAt |

### Feedback (`server/models/Feedback.js`)
| Field | Type | Constraints |
| --- | --- | --- |
| user | ObjectId → User | required |
| type | String | enum: `suggestion`, `issue` |
| message | String | required |
| timestamps | auto | createdAt, updatedAt |

### Notification (`server/models/Notification.js`)
| Field | Type | Constraints |
| --- | --- | --- |
| user | ObjectId → User | required |
| message | String | required |
| link | String | optional |
| type | String | optional |
| read | Boolean | default: false |
| timestamps | auto | createdAt, updatedAt |

---

## 4. Every API Route

### Auth (`/api/auth`)
| Method | Path | Auth | Role | Controller |
| --- | --- | --- | --- | --- |
| POST | `/api/auth/register` | ✗ | any | `register` |
| POST | `/api/auth/login` | ✗ | any | `login` |
| POST | `/api/auth/forgot-password` | ✗ | any | `forgotPassword` |
| PUT | `/api/auth/reset-password/:token` | ✗ | any | `resetPassword` |
| GET | `/api/auth/me` | ✓ protect | any | `getMe` |
| GET | `/api/auth/admin-check` | ✓ protect | admin | inline handler |

### Expos (`/api/expos`)
| Method | Path | Auth | Role | Controller |
| --- | --- | --- | --- | --- |
| GET | `/api/expos/:id/public` | ✗ | any | `getPublicExpoDetails` |
| GET | `/api/expos` | ✗ | any | `getExpos` |
| POST | `/api/expos` | ✓ protect | admin | `createExpo` (+ multer `image`) |
| GET | `/api/expos/:id` | ✗ | any | `getExpo` |
| PUT | `/api/expos/:id` | ✓ protect | admin | `updateExpo` (+ multer `image`) |
| DELETE | `/api/expos/:id` | ✓ protect | admin | `deleteExpo` |
| GET | `/api/expos/:expoId/booths` | ✗ | any | `getBoothsByExpo` |
| GET | `/api/expos/:expoId/sessions` | ✗ | any | `getSessionsByExpo` |

### Booths (`/api/booths`)
| Method | Path | Auth | Role | Controller |
| --- | --- | --- | --- | --- |
| PUT | `/api/booths/:id` | ✓ protect | admin | `updateBooth` |
| PUT | `/api/booths/:id/assign` | ✓ protect | admin | `assignBooth` |
| PUT | `/api/booths/:id/release` | ✓ protect | admin | `releaseBooth` |
| PUT | `/api/booths/:id/confirm` | ✓ protect | admin | `confirmBooth` |
| PUT | `/api/booths/:id/reserve` | ✓ protect | exhibitor | `reserveBooth` |
| PUT | `/api/booths/:id/cancel` | ✓ protect | exhibitor | `cancelReservation` |
| PUT | `/api/booths/:id/my-details` | ✓ protect | exhibitor | `updateMyBooth` |

### Applications (`/api/applications`)
| Method | Path | Auth | Role | Controller |
| --- | --- | --- | --- | --- |
| POST | `/api/applications` | ✓ protect | exhibitor | `createApplication` (+ multer documents×3) |
| GET | `/api/applications/my` | ✓ protect | exhibitor | `getMyApplications` |
| GET | `/api/applications` | ✓ protect | admin | `getAllApplications` |
| PUT | `/api/applications/:id/status` | ✓ protect | admin | `updateApplicationStatus` |

### Sessions (`/api/sessions`)
| Method | Path | Auth | Role | Controller |
| --- | --- | --- | --- | --- |
| POST | `/api/sessions` | ✓ protect | admin | `createSession` |
| GET | `/api/sessions/:id` | ✗ | any | `getSession` |
| PUT | `/api/sessions/:id` | ✓ protect | admin | `updateSession` |
| DELETE | `/api/sessions/:id` | ✓ protect | admin | `deleteSession` |

### Profile (`/api/profile`)
| Method | Path | Auth | Role | Controller |
| --- | --- | --- | --- | --- |
| GET | `/api/profile` | ✓ protect | any | `getProfile` |
| PUT | `/api/profile` | ✓ protect | any | `updateProfile` |
| POST | `/api/profile/logo` | ✓ protect | exhibitor | `uploadLogo` (+ multer `logo`) |

### Messages (`/api/messages`)
| Method | Path | Auth | Role | Controller |
| --- | --- | --- | --- | --- |
| POST | `/api/messages` | ✓ protect | any | `sendMessage` |
| GET | `/api/messages/inbox` | ✓ protect | any | `getInbox` |
| GET | `/api/messages/sent` | ✓ protect | any | `getSent` |
| PUT | `/api/messages/:id/read` | ✓ protect | any | `markAsRead` |
| GET | `/api/messages/unread-count` | ✓ protect | any | `getUnreadCount` |
| GET | `/api/messages/admin-contact` | ✓ protect | any | `getAdminContact` |

### Users (`/api/users`)
| Method | Path | Auth | Role | Controller |
| --- | --- | --- | --- | --- |
| GET | `/api/users` | ✓ protect | admin | `getUsers` |

### Exhibitors (`/api/exhibitors`)
| Method | Path | Auth | Role | Controller |
| --- | --- | --- | --- | --- |
| GET | `/api/exhibitors` | ✓ protect | any | `getExhibitors` |
| GET | `/api/exhibitors/categories` | ✓ protect | any | `getCategories` |
| GET | `/api/exhibitors/:id` | ✓ protect | any | `getExhibitor` |

### Registrations (`/api/registrations`)
| Method | Path | Auth | Role | Controller |
| --- | --- | --- | --- | --- |
| POST | `/api/registrations` | ✓ protect | attendee | `registerForExpo` |
| POST | `/api/registrations/session` | ✓ protect | attendee | `registerForSession` |
| PUT | `/api/registrations/bookmark` | ✓ protect | attendee | `toggleBookmark` |
| GET | `/api/registrations/my` | ✓ protect | attendee | `getMyRegistrations` |
| DELETE | `/api/registrations/:id` | ✓ protect | attendee | `cancelRegistration` |

### Feedback (`/api/feedback`)
| Method | Path | Auth | Role | Controller |
| --- | --- | --- | --- | --- |
| POST | `/api/feedback` | ✓ protect | any | `createFeedback` |
| GET | `/api/feedback` | ✓ protect | admin | `getAllFeedback` |

### Notifications (`/api/notifications`)
| Method | Path | Auth | Role | Controller |
| --- | --- | --- | --- | --- |
| GET | `/api/notifications` | ✓ protect | any | `getMyNotifications` |
| GET | `/api/notifications/unread-count` | ✓ protect | any | `getUnreadCount` |
| PUT | `/api/notifications/read-all` | ✓ protect | any | `markAllAsRead` |
| PUT | `/api/notifications/:id/read` | ✓ protect | any | `markAsRead` |

### Analytics (`/api/analytics`)
| Method | Path | Auth | Role | Controller |
| --- | --- | --- | --- | --- |
| GET | `/api/analytics/admin` | ✓ protect | admin | `getAdminAnalytics` |
| GET | `/api/analytics` | ✓ protect | admin | `getAdminAnalytics` |

### Public (`/api/public`)
| Method | Path | Auth | Role | Controller |
| --- | --- | --- | --- | --- |
| GET | `/api/public/landing-data` | ✗ | any | `getLandingData` |
| GET | `/api/public/stats` | ✗ | any | `getPublicStats` |
| GET | `/api/public/expos` | ✗ | any | `getPublicExpos` |
| GET | `/api/public/expos/:id` | ✗ | any | `getPublicExpoById` |
| GET | `/api/public/exhibitors` | ✗ | any | `getPublicExhibitors` |
| GET | `/api/public/exhibitors/:id` | ✗ | any | `getPublicExhibitorById` |
| GET | `/api/public/featured-exhibitors` | ✗ | any | `getFeaturedExhibitors` |

### Infrastructure
| Method | Path | Auth | Middleware | Notes |
| --- | --- | --- | --- | --- |
| GET | `/api/health` | ✗ | none | Health-check endpoint |
| ALL | `/api/*` (fallback) | ✗ | dbCheck | 404 catch-all, 503 if DB down |

---

## 5. Every React Route / Page

| Path | Component | Auth Required | Role Guard |
| --- | --- | --- | --- |
| `/` | Home | ✗ | — |
| `/expos` | Expos | ✗ | — |
| `/expos/:id` | ExpoDetails | ✗ | — |
| `/exhibitors` | Exhibitors | ✗ | — |
| `/exhibitors/:id` | ExhibitorProfile | ✗ | — |
| `/about` | About | ✗ | — |
| `/contact` | Contact | ✗ | — |
| `/login` | Login | ✗ | — |
| `/register` | Register | ✗ | — |
| `/forgot-password` | ForgotPassword | ✗ | — |
| `/reset-password/:token` | ResetPassword | ✗ | — |
| `/unauthorized` | Unauthorized | ✗ | — |
| `/messages` | Messages | ✓ ProtectedRoute | admin, exhibitor, attendee |
| `/schedule` | MySchedule | ✓ ProtectedRoute | attendee |
| `/feedback` | Feedback | ✓ ProtectedRoute | admin, exhibitor, attendee |
| `/admin` | AdminDashboard | ✓ ProtectedRoute | admin |
| `/admin/expos` | AdminExpos | ✓ ProtectedRoute | admin |
| `/admin/expos/:id/booths` | AdminBooths | ✓ ProtectedRoute | admin |
| `/admin/expos/:id/sessions` | AdminSessions | ✓ ProtectedRoute | admin |
| `/admin/applications` | AdminApplications | ✓ ProtectedRoute | admin |
| `/admin/feedback` | AdminFeedback | ✓ ProtectedRoute | admin |
| `/admin/analytics` | AdminAnalytics | ✓ ProtectedRoute | admin |
| `/exhibitor` | ExhibitorDashboard | ✓ ProtectedRoute | exhibitor |
| `/exhibitor/profile` | ExhibitorProfile (manage) | ✓ ProtectedRoute | exhibitor |
| `/exhibitor/expos` | ExhibitorExpos | ✓ ProtectedRoute | exhibitor |
| `/exhibitor/applications` | MyApplications | ✓ ProtectedRoute | exhibitor |
| `/exhibitor/booths` | ExhibitorBooths | ✓ ProtectedRoute | exhibitor |
| `/attendee` | Redirect → `/` | — | — |
| `/attendee/expos` | Redirect → `/expos` | — | — |
| `/attendee/expos/:id` | Redirect → `/expos/:id` | — | — |
| `/attendee/exhibitors/:id` | Redirect → `/exhibitors/:id` | — | — |
| `/attendee/schedule` | Redirect → `/schedule` | — | — |
| `*` | NotFound | ✗ | — |

---

## 6. Environment Variables

| Variable | .env.example | .env (actual) | Notes |
| --- | --- | --- | --- |
| `PORT` | 5000 | 5000 | ✓ Present |
| `MONGO_URI` | Placeholder | **Real Atlas URI with credentials** | ⚠️ Committed `.env` has real secrets |
| `JWT_SECRET` | Placeholder | **Real Base64 secret** | ⚠️ Committed `.env` has real secrets |
| `CLIENT_URL` | http://localhost:5173 | **Missing** | ⚠️ Not in `.env`, only in `.env.example` |
| `DEMO_MODE` | true | **Missing** | Not in `.env`, only in `.env.example` |

---

## 7. Flags & Observations

### 🔴 Critical Issues
1. **Real secrets committed** – `server/.env` is tracked and contains the real MongoDB Atlas URI (with password `JnH6nqWM0bKOvVdy`) and the real JWT secret. Although `.gitignore` lists `.env`, the file exists on disk — it may have been committed before `.gitignore` was added. **Must verify git history**.
2. **`.env` is currently in `.gitignore`** – confirmed. But having the file in the working tree with secrets is still a risk if the repo is shared.

### 🟡 Medium Issues
3. **README documentation drift** – README lists files that don't match the real tree:
   - README says `middleware/roleMiddleware.js` and `middleware/uploadMiddleware.js` → actual names are `authMiddleware.js` (has both `protect` and `authorize`) and `upload.js`.
   - README says `GET /api/auth/profile`, `PUT /api/auth/profile`, `POST /api/auth/profile/logo` → these are actually under `/api/profile`.
   - README says `POST /api/auth/reset-password/:token` → actual method is `PUT`.
   - README omits several route files: `publicRoutes.js`, `profileRoutes.js`, `userRoutes.js`, `exhibitorRoutes.js`, `registrationRoutes.js`, `notificationRoutes.js`.
4. **Unused / unrouted pages** in `client/src/pages/attendee/`:
   - `AttendeeDashboard.jsx` — exists at `pages/AttendeeDashboard.jsx` but **not routed** in `App.jsx`.
   - `AttendeeExpos.jsx` — exists at `pages/attendee/AttendeeExpos.jsx` but **not routed**.
   - `pages/attendee/ExpoDetails.jsx` — exists but **not routed** (the top-level `ExpoDetails.jsx` is used instead).
   - `pages/attendee/ExhibitorProfileView.jsx` — exists but **not routed**.
5. **Hardcoded URLs** – Client `api.js` has `baseURL: "http://localhost:5000/api"` and `SocketContext.jsx` has `io("http://localhost:5000", ...)` — not configurable via environment.
6. **Duplicate analytics routes** – `GET /api/analytics/admin` and `GET /api/analytics` both map to the same handler.
7. **`CLIENT_URL` and `DEMO_MODE` missing from `.env`** – `.env.example` defines them but the actual `.env` doesn't include them.

### 🟢 Positive Observations
8. Good separation: `client/` and `server/` are cleanly separated with independent `package.json` files.
9. Seed scripts exist (`seed:admin`, `seed:demo`) for demo data.
10. Health-check endpoint at `/api/health`.
11. DB check middleware returns 503 when database is unavailable.
12. Centralized error handler in `server.js` handles CastError and ValidationError.
13. Socket.IO integration with JWT authentication on connection.
14. Automatic session reminder system via `setInterval` in `utils/reminders.js`.
15. File upload middleware with type/size validation.
16. ObjectId validation middleware used on `:id` routes.
17. `ProtectedRoute` component enforces role-based access on the client side.

### 📋 Missing (not found)
- **No test files** anywhere in the repo (no `__tests__/`, no `*.test.js`, no `*.spec.js`).
- **No Dockerfile or docker-compose**.
- **No `helmet` package** for security headers.
- **No `express-mongo-sanitize`** or equivalent for NoSQL injection prevention.
- **No `express-rate-limit`** for rate limiting.
- **No logging library** (no morgan/winston/pino).
- **No CSRF protection**.
- **No privacy policy page**.
- **No user data export/delete endpoint** (GDPR).
- **No demo video** found in the repo.
- **No LICENSE file** despite README referencing it.
- **`seed` script referenced in README (`npm run seed`)** doesn't exist – actual scripts are `seed:admin` and `seed:demo`.

---

*End of Phase 0 — Inventory complete. No requirement judgement made.*
