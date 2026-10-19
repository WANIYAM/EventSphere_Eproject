# EventSphere Management - Developer & Technical Architecture Guide

## 1. System Overview & Technology Stack

EventSphere Management is an enterprise expo operating system constructed on the MERN stack. It decouples high-performance React UI rendering from an Express REST API and a real-time Socket.IO WebSocket bus backed by MongoDB Atlas.

### Package Versions (from package.json)

| Component | Package Name | Version | Role in Architecture |
| :--- | :--- | :--- | :--- |
| Runtime | Node.js | >= 18.0.0 | JavaScript runtime |
| Backend Framework | express | 5.2.1 | HTTP routing and REST endpoints |
| Database ODM | mongoose | 9.10.3 | Schema definition, validation, and queries |
| Real-Time Server | socket.io | 4.8.4 | WebSocket server and room dispatch |
| Real-Time Client | socket.io-client | 4.8.4 | WebSocket client connection |
| Authentication | jsonwebtoken | 9.0.3 | Stateless JWT signing and verification |
| Cryptography | bcryptjs | 3.0.3 | Password hashing with salt rounds |
| File Handling | multer | 2.4.0 | Multipart form-data parser and file storage |
| CORS Management | cors | 2.8.6 | Cross-origin request headers |
| Environment | dotenv | 18.0.4 | Environment variable loading |
| Frontend Library | react / react-dom | 19.2.8 | User interface components and hooks |
| Bundler & Dev Server | vite | 8.3.0 | Modern ESM frontend bundler |
| Client Routing | react-router-dom | 7.18.4 | Single-page application route management |
| HTTP Client | axios | 1.20.0 | REST client with request/response interceptors |
| Animation Physics | framer-motion | 13.5.0 | Spring physics and layout transitions |
| Smooth Scrolling | lenis | 1.3.26 | Momentum scrolling engine |
| Data Visualisation | recharts | 3.10.1 | SVG charts for analytics dashboards |

---

## 2. System Architecture & Request Lifecycle

```mermaid
graph TD
    subgraph Client_Layer [Client Layer - React 19 + Vite 8]
        UI[UI Components & Pages]
        AxiosClient[Axios Instance - api.js]
        SocketClient[Socket.IO Client - SocketContext]
    end

    subgraph Server_Gateway [Server Gateway - Express 5]
        CORS[CORS Middleware]
        StaticServe[Static File Server - /uploads]
        ValidateID[validateObjectId Middleware]
        AuthMW[authMiddleware - protect & authorize]
        DBCheck[dbCheck Middleware - 503 Guard]
    end

    subgraph Controller_Layer [Application Logic]
        Controllers[API Controllers - 14 Modules]
        SocketBus[Socket.IO Event Bus - socket.js]
        Scheduler[Background Job - reminders.js]
    end

    subgraph Data_Layer [Persistence]
        Mongoose[Mongoose 9 ODM]
        MongoDB[(MongoDB Atlas)]
        DiskStorage[(Local Disk - server/uploads)]
    end

    UI --> AxiosClient
    UI <--> SocketClient
    AxiosClient --> CORS
    CORS --> DBCheck
    DBCheck --> ValidateID
    ValidateID --> AuthMW
    AuthMW --> Controllers
    Controllers --> Mongoose
    Controllers -.-> DiskStorage
    Controllers --> SocketBus
    SocketBus <--> SocketClient
    Scheduler --> Mongoose
    Scheduler --> SocketBus
    Mongoose <--> MongoDB
```

### Request Lifecycle Flow

1. Client Dispatch: User action in a React component executes an asynchronous call through `client/src/services/api.js`.
2. Interceptor: The Axios request interceptor checks `localStorage.getItem("token")` and attaches `Authorization: Bearer <token>` if present.
3. Database Shield (`dbCheck.js`): Verifies `mongoose.connection.readyState === 1`. If disconnected, halts request immediately with HTTP 503.
4. Parameter Validation (`validateObjectId.js`): Validates any `:id` or `:*Id` route parameters. If invalid, halts request with HTTP 400 `{ message: "Invalid id" }`.
5. Authentication Guard (`authMiddleware.js` - protect): Decodes and verifies the Bearer JWT against `process.env.JWT_SECRET`. Attaches sanitized user record (`req.user`) omitting password.
6. Role Authorization (`authMiddleware.js` - authorize): Asserts `allowedRoles.includes(req.user.role)`. If unauthorized, halts with HTTP 403.
7. Controller: Executes business logic, enforces entity ownership, queries Mongoose, and triggers live socket broadcasts via `emitToAll` or `emitToUser`.
8. Global Error Handler (`server.js`): Catches unhandled rejections, converts `CastError` and `ValidationError` to HTTP 400, sanitizes unexpected 500 exceptions, and returns `{ message }`.

---

## 3. Real Repository Folder Structure

```
EventSphere_Eproject/
├── README.md                          # Primary project documentation and quickstart
├── package.json                       # Root workspace descriptor
├── client/                            # React frontend application
│   ├── index.html                     # HTML5 entry template
│   ├── vite.config.js                 # Vite bundler configuration
│   ├── package.json                   # Client dependency definitions
│   └── src/
│       ├── main.jsx                   # React root mount point
│       ├── App.jsx                    # Route dispatcher and layout coordinator
│       ├── index.css                  # Global styles, variables, and responsive media rules
│       ├── components/
│       │   ├── Navbar.jsx             # Admin and exhibitor horizontal workspace navigation
│       │   ├── NotificationBell.jsx   # Live alerts dropdown and unread counter
│       │   ├── ProtectedRoute.jsx     # Client-side RBAC route guard and session recovery
│       │   ├── ServerStatusBanner.jsx # Database outage warning bar
│       │   └── landing/               # Public exhibition and festival UI components
│       │       ├── common/            # CustomCursor, GlobalBackground, RetroTvLogo
│       │       ├── navigation/        # Navigation.tsx (Floating pills navbar)
│       │       └── sections/          # HeroSection, AgendaSection, FloorPlanSection, etc.
│       ├── context/
│       │   ├── AuthContext.jsx        # JWT state, user profile, login, and registration
│       │   ├── SocketContext.jsx      # Socket.IO client singleton connection
│       │   └── ToastContext.jsx       # Alert toast notifications with ARIA live region
│       ├── pages/
│       │   ├── Home.jsx               # Public landing page with attendee briefing strip
│       │   ├── Expos.jsx              # Public expo catalog with city filters
│       │   ├── ExpoDetails.jsx        # Unified expo page (Schedule, Exhibitors, Map, About)
│       │   ├── Exhibitors.jsx         # Public exhibitor directory with dynamic categories
│       │   ├── ExhibitorProfile.jsx   # Public exhibitor profile with message redirect
│       │   ├── Contact.jsx            # Public contact desk dispatching to organizer messages
│       │   ├── Feedback.jsx           # User feedback submission form
│       │   ├── Messages.jsx           # Real-time inbox, sent archive, and message composer
│       │   ├── Notifications.jsx      # Full-page system notifications log
│       │   ├── Login.jsx              # Login gateway with target resumption
│       │   ├── Register.jsx           # Registration page with role selection
│       │   ├── ForgotPassword.jsx     # Password reset token request
│       │   ├── ResetPassword.jsx      # Password reset submission
│       │   ├── Unauthorized.jsx       # 403 Forbidden error page
│       │   ├── NotFound.jsx           # 404 Route not found error page
│       │   ├── AdminDashboard.jsx     # Admin workspace launchpad
│       │   ├── ExhibitorDashboard.jsx # Exhibitor workspace launchpad
│       │   ├── admin/                 # Admin management views (Expos, Booths, Sessions, Apps, Analytics, Feedback)
│       │   ├── exhibitor/             # Exhibitor views (Profile, Expos, Applications, Booths)
│       │   └── attendee/              # Attendee views (MySchedule)
│       └── services/
│           └── api.js                 # Axios instance with auth interceptor
└── server/                            # Node.js Express backend
    ├── server.js                      # HTTP server initialization and middleware mounting
    ├── package.json                   # Server dependency definitions
    ├── .env                           # Environment configuration (ignored in production)
    ├── .env.example                   # Environment variable template
    ├── config/
    │   └── db.js                      # MongoDB connection loop and retry handler
    ├── controllers/                   # 14 business logic controllers
    ├── middleware/
    │   ├── authMiddleware.js          # JWT protection and role authorization
    │   ├── dbCheck.js                 # 503 database availability interceptor
    │   ├── upload.js                  # Multer disk storage and file extension filter
    │   └── validateObjectId.js        # MongoDB ObjectId parameter validator
    ├── models/                        # 9 Mongoose data schemas
    ├── routes/                        # 14 Express route modules
    ├── scripts/
    │   └── dropOldRegistrationIndexes.js # Database migration index cleanup utility
    ├── seed/
    │   ├── createAdmin.js             # Standalone admin user creation script
    │   └── seedDemoData.js            # Comprehensive deterministic demo seed engine
    ├── uploads/                       # Local file storage for logos and documents
    └── utils/
        ├── notify.js                  # Notification creation and bulk dispatch
        ├── reminders.js               # Background automated session reminder scheduler
        └── socket.js                  # Socket.IO connection and room management
```

---

## 4. Setup, Installation & Seeding Guide

### Prerequisites
- Node.js version 18.0.0 or higher
- npm version 9.0.0 or higher
- MongoDB instance: Local MongoDB daemon (`mongodb://127.0.0.1:27017/eventsphere`) or a MongoDB Atlas connection string.

### Environment Configuration (`server/.env`)

Create `server/.env` based on `server/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/eventsphere
JWT_SECRET=your_jwt_secret_key_minimum_32_characters
CLIENT_URL=http://localhost:5173
DEMO_MODE=true
```

| Variable Name | Required | Default | Technical Purpose |
| :--- | :---: | :--- | :--- |
| `PORT` | Yes | `5000` | Port on which the Express HTTP and WebSocket server listens. |
| `MONGO_URI` | Yes | `mongodb://127.0.0.1:27017/eventsphere` | Connection string for MongoDB (local or Atlas cluster). |
| `JWT_SECRET` | Yes | None | Secret key used to sign and verify HMAC-SHA256 JWT tokens. |
| `CLIENT_URL` | No | `http://localhost:5173` | Allowed CORS origin and password reset base URL. |
| `DEMO_MODE` | No | `false` | When `"true"`, includes resetToken and resetLink in forgot-password API responses. |

### Installation Steps

1. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```
2. Install frontend dependencies:
   ```bash
   cd ../client
   npm install
   ```

### Database Seeding

The project provides two seed scripts in `server/package.json`:
- `npm run seed:admin`: Creates or updates the default Super Admin user (`admin@eventsphere.com` / `Admin@123`).
- `npm run seed:demo`: Executes `server/seed/seedDemoData.js`.
  - Deletion scope: Completely wipes existing Expos, Booths, Applications, Sessions, Registrations, Messages, Feedback, Notifications, and non-admin Users.
  - Creation scope: Deterministically generates 24 Exhibitor companies, 40 Attendees, 6 multi-day Expos, over 100 Booths with realistic booking distributions, non-overlapping Keynote schedules, threaded Messages, Feedback, and Notifications.

### Launching the Application
- Start Backend Server (Terminal 1):
  ```bash
  cd server
  npm run dev
  ```
  Runs at http://localhost:5000.
- Start Frontend Development Server (Terminal 2):
  ```bash
  cd client
  npm run dev
  ```
  Runs at http://localhost:5173.

---

## 5. Database Schema & Data Models

### 5.1 Models and Field Specifications

#### User Model (`server/models/User.js`)

| Field | Type | Required | Default | Notes / Constraints |
| :--- | :--- | :---: | :--- | :--- |
| `name` | String | Yes | None | User's full name or representative title |
| `email` | String | Yes | None | Unique constraint; lowercased and indexed |
| `password` | String | Yes | None | Hashed with bcrypt (salt 10) in pre-save hook |
| `role` | String | Yes | `"attendee"` | Enum: `["admin", "exhibitor", "attendee"]` |
| `phone` | String | No | None | Contact telephone |
| `company` | String | No | None | Corporate brand name for exhibitors |
| `description` | String | No | None | Exhibitor company biography |
| `website` | String | No | None | Corporate URL |
| `category` | String | No | None | Industry category classification |
| `logo` | String | No | None | File path or URL to brand logo |
| `resetToken` | String | No | None | SHA-256 hashed password reset token |
| `resetTokenExpire` | Date | No | None | Token expiration timestamp (15 min) |
| `timestamps` | Date | Auto | Current time | `createdAt` and `updatedAt` |

#### Expo Model (`server/models/Expo.js`)

| Field | Type | Required | Default | Notes / Constraints |
| :--- | :--- | :---: | :--- | :--- |
| `title` | String | Yes | None | Official exhibition title |
| `description` | String | No | None | Detailed expo description |
| `theme` | String | No | None | Industry category or theme label |
| `location` | String | No | None | Venue location and address |
| `startDate` | Date | No | None | Opening date |
| `endDate` | Date | No | None | Closing date; validated >= startDate |
| `image` | String | No | `""` | Banner image URL or upload path |
| `createdBy` | ObjectId | No | None | Reference to User (`admin`) |

#### Booth Model (`server/models/Booth.js`)

| Field | Type | Required | Default | Notes / Constraints |
| :--- | :--- | :---: | :--- | :--- |
| `expo` | ObjectId | Yes | None | Reference to parent Expo |
| `boothNumber` | String | Yes | None | Identifier (e.g., A1, B4); unique per expo |
| `size` | String | No | None | Dimensions (e.g., 3x3 m, 6x6 m) |
| `price` | Number | No | None | Rental price in USD |
| `status` | String | Yes | `"available"` | Enum: `["available", "reserved", "booked"]` |
| `exhibitor` | ObjectId | No | None | Reference to User (`exhibitor`) |
| `details` | String | No | None | Showcase and demo description |
| `staff` | Array | No | `[]` | Subdocuments: `[{ name: String, role: String }]` |

#### Application Model (`server/models/Application.js`)

| Field | Type | Required | Default | Notes / Constraints |
| :--- | :--- | :---: | :--- | :--- |
| `expo` | ObjectId | Yes | None | Reference to Expo applied for |
| `exhibitor` | ObjectId | Yes | None | Reference to User (`exhibitor`) |
| `companyName` | String | No | None | Legal company entity name |
| `products` | String | No | None | Showcase summary |
| `documents` | [String] | No | `[]` | File paths to uploaded paperwork |
| `status` | String | Yes | `"pending"` | Enum: `["pending", "approved", "rejected"]` |
| `booth` | ObjectId | No | None | Reference to allocated Booth |

#### Session Model (`server/models/Session.js`)

| Field | Type | Required | Default | Notes / Constraints |
| :--- | :--- | :---: | :--- | :--- |
| `expo` | ObjectId | Yes | None | Reference to parent Expo |
| `title` | String | Yes | None | Keynote or workshop title |
| `speaker` | String | No | None | Presenter name and affiliation |
| `topic` | String | No | None | Track topic name |
| `location` | String | No | None | Stage or room name |
| `startTime` | Date | No | None | Scheduled start timestamp |
| `endTime` | Date | No | None | Scheduled end timestamp; validated > start |
| `reminderSent` | Boolean | No | `false` | Flag tracking automated reminder dispatch |

#### Registration Model (`server/models/Registration.js`)

| Field | Type | Required | Default | Notes / Constraints |
| :--- | :--- | :---: | :--- | :--- |
| `user` | ObjectId | Yes | None | Reference to User (`attendee`) |
| `expo` | ObjectId | Yes | None | Reference to Expo |
| `session` | ObjectId | No | None | Reference to Session (null for expo pass) |
| `type` | String | Yes | `"expo"` | Enum: `["expo", "session"]` |
| `registered` | Boolean | No | `true` | Active registration state |
| `bookmarked` | Boolean | No | `false` | Personal bookmark state |

#### Message Model (`server/models/Message.js`)

| Field | Type | Required | Default | Notes / Constraints |
| :--- | :--- | :---: | :--- | :--- |
| `sender` | ObjectId | Yes | None | Reference to User |
| `receiver` | ObjectId | Yes | None | Reference to User |
| `subject` | String | No | None | Message subject line |
| `body` | String | No | None | Message text |
| `read` | Boolean | No | `false` | Read confirmation flag |

#### Notification Model (`server/models/Notification.js`)

| Field | Type | Required | Default | Notes / Constraints |
| :--- | :--- | :---: | :--- | :--- |
| `user` | ObjectId | Yes | None | Reference to recipient User |
| `message` | String | Yes | None | Notification alert text |
| `link` | String | No | None | In-app navigation destination |
| `type` | String | No | None | Category (application, booth, reminder) |
| `read` | Boolean | No | `false` | Read status |

#### Feedback Model (`server/models/Feedback.js`)

| Field | Type | Required | Default | Notes / Constraints |
| :--- | :--- | :---: | :--- | :--- |
| `user` | ObjectId | Yes | None | Reference to submitting User |
| `type` | String | Yes | None | Enum: `["suggestion", "issue"]` |
| `message` | String | Yes | None | Feedback text (min 5 characters) |

### 5.2 Database Indexes

```javascript
// User indexes:
userSchema.index({ email: 1 }, { unique: true });

// Registration indexes (Partial unique indexes enforce one registration per entity):
registrationSchema.index(
  { user: 1, expo: 1 },
  { unique: true, partialFilterExpression: { type: "expo" } }
);
registrationSchema.index(
  { user: 1, session: 1 },
  { unique: true, partialFilterExpression: { type: "session" } }
);

// Booth compound indexes:
boothSchema.index({ expo: 1, status: 1 });
boothSchema.index({ expo: 1, boothNumber: 1 }, { unique: true });

// Session compound index:
sessionSchema.index({ expo: 1, startTime: 1 });

// Message compound indexes:
messageSchema.index({ receiver: 1, read: 1 });
messageSchema.index({ sender: 1, createdAt: -1 });

// Notification index:
notificationSchema.index({ user: 1, read: 1 });

// Application compound indexes:
applicationSchema.index({ expo: 1, status: 1 });
applicationSchema.index({ exhibitor: 1, status: 1 });
```

### 5.3 Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USER ||--o{ EXPO : "creates (Admin)"
    USER ||--o{ APPLICATION : "submits (Exhibitor)"
    USER ||--o{ BOOTH : "assigned to (Exhibitor)"
    USER ||--o{ REGISTRATION : "claims (Attendee)"
    USER ||--o{ MESSAGE : "sends/receives"
    USER ||--o{ NOTIFICATION : "receives"
    USER ||--o{ FEEDBACK : "submits"

    EXPO ||--o{ BOOTH : "contains"
    EXPO ||--o{ SESSION : "schedules"
    EXPO ||--o{ APPLICATION : "receives"
    EXPO ||--o{ REGISTRATION : "registered for"

    BOOTH ||--o| APPLICATION : "allocated to"
    SESSION ||--o{ REGISTRATION : "registered/bookmarked"
```

---

## 6. Use Cases

### 6.1 Use Case Diagram

```mermaid
flowchart LR
    subgraph Actors
        V[Visitor]
        A[Attendee]
        E[Exhibitor]
        AD[Admin / Organizer]
    end

    subgraph Public_Use_Cases [Public & Discovery]
        UC1[Browse Expos & Cities]
        UC2[View Expo Dossier & Schedule]
        UC3[Explore Floor Plan & Booths]
        UC4[Search Exhibitors by Category]
        UC5[Register Account & Login]
        UC6[Recover Password]
    end

    subgraph Attendee_Use_Cases [Attendee Actions]
        UC7[Register for Expo Pass]
        UC8[Register & Bookmark Sessions]
        UC9[Manage Personal Timetable]
        UC10[Message Exhibitor]
        UC11[Receive Session Reminders]
        UC12[Submit User Feedback]
    end

    subgraph Exhibitor_Use_Cases [Exhibitor Actions]
        UC13[Apply for Expo with Documents]
        UC14[Reserve Booth on Floor Plan]
        UC15[Manage Showcase & Staff Roster]
        UC16[Update Company Profile & Logo]
        UC17[Message Organizers & Peers]
    end

    subgraph Admin_Use_Cases [Admin Operations]
        UC18[Create / Edit / Delete Expo]
        UC19[Assign & Confirm Booths]
        UC20[Approve / Reject Applications]
        UC21[Schedule Sessions with Conflict Checks]
        UC22[Monitor Telemetry & Analytics]
        UC23[Review Feedback Logs]
    end

    V --> UC1
    V --> UC2
    V --> UC3
    V --> UC4
    V --> UC5
    V --> UC6

    A --> UC7
    A --> UC8
    A --> UC9
    A --> UC10
    A --> UC11
    A --> UC12

    E --> UC13
    E --> UC14
    E --> UC15
    E --> UC16
    E --> UC17

    AD --> UC18
    AD --> UC19
    AD --> UC20
    AD --> UC21
    AD --> UC22
    AD --> UC23
```

---

## 7. API Reference

All routes are mounted under `/api` in `server/server.js`.

### 7.1 Authentication (`/api/auth`)

| Method | Path | Auth Required | Roles | Purpose | Request Body | Response Payload |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| POST | `/register` | No | Any | Register user | `name, email, password, role, phone, company` | `201: { token, user: { id, name, email, role } }` |
| POST | `/login` | No | Any | Authenticate user | `email, password` | `200: { token, user: { id, name, email, role } }` |
| POST | `/forgot-password` | No | Any | Request reset link | `email` | `200: { message, resetToken?, resetLink? }` |
| PUT | `/reset-password/:token` | No | Any | Execute password reset | `password` | `200: { message: "Password reset successful" }` |
| GET | `/me` | Yes | Any | Get current session | None | `200: { id, name, email, role, phone, company }` |
| GET | `/admin-check` | Yes | Admin | Verify admin privileges | None | `200: { message: "Admin authorized" }` |

### 7.2 Expos (`/api/expos`)

| Method | Path | Auth Required | Roles | Purpose | Request Body | Response Payload |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| GET | `/` | No | Any | List all expos | None | `200: [ Expo ]` sorted by `startDate: 1` |
| POST | `/` | Yes | Admin | Create expo | `title, startDate, endDate, location, description, theme, boothCount, boothPrice, boothSize, image` (or file) | `201: Expo` |
| GET | `/:id` | No | Any | Get single expo | None | `200: { ...expo, booths, sessions, exhibitors }` |
| GET | `/:id/public` | No | Any | Public expo details | None | `200: { ...expo, booths, sessions, exhibitors }` |
| PUT | `/:id` | Yes | Admin | Update expo | `title, description, theme, location, startDate, endDate, image` (or file) | `200: Expo` |
| DELETE | `/:id` | Yes | Admin | Delete expo | None | `200: { message: "Expo and all related booths, applications, sessions, and registrations deleted" }` |
| GET | `/:expoId/booths` | No | Any | Get booths for expo | None | `200: [ Booth ]` |
| GET | `/:expoId/sessions` | No | Any | Get sessions for expo | None | `200: [ Session ]` |

### 7.3 Booths (`/api/booths`)

| Method | Path | Auth Required | Roles | Purpose | Request Body | Response Payload |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| PUT | `/:id` | Yes | Admin | Edit booth specs | `size, price, details, status` | `200: Booth` |
| PUT | `/:id/assign` | Yes | Admin | Assign booth | `exhibitorId` | `200: { message, booth }` |
| PUT | `/:id/release` | Yes | Admin | Release booth | None | `200: { message, booth }` |
| PUT | `/:id/confirm` | Yes | Admin | Confirm reservation | None | `200: { message, booth }` |
| PUT | `/:id/reserve` | Yes | Exhibitor | Self-reserve booth | None | `200: { message, booth }` |
| PUT | `/:id/cancel` | Yes | Exhibitor | Cancel reservation | None | `200: { message, booth }` |
| PUT | `/:id/my-details` | Yes | Exhibitor | Update booth staff | `details, staff: [{ name, role }]` | `200: { message, booth }` |

### 7.4 Applications (`/api/applications`)

| Method | Path | Auth Required | Roles | Purpose | Request Body | Response Payload |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| POST | `/` | Yes | Exhibitor | Submit application | `expo, companyName, products`, multipart `documents` (max 3) | `201: Application` |
| GET | `/my` | Yes | Exhibitor | My applications | None | `200: [ Application ]` |
| GET | `/` | Yes | Admin | List applications | Query: `status, expo` | `200: [ Application ]` |
| PUT | `/:id/status` | Yes | Admin | Approve or reject | `status: "approved"` or `"rejected"` | `200: { message, application }` |

### 7.5 Sessions (`/api/sessions`)

| Method | Path | Auth Required | Roles | Purpose | Request Body | Response Payload |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| POST | `/` | Yes | Admin | Create session | `expo, title, speaker, topic, location, startTime, endTime` | `201: Session` |
| GET | `/:id` | No | Any | Get session | None | `200: Session` |
| PUT | `/:id` | Yes | Admin | Update session | `title, speaker, topic, location, startTime, endTime` | `200: Session` |
| DELETE | `/:id` | Yes | Admin | Delete session | None | `200: { message: "Session deleted successfully" }` |

### 7.6 Registrations (`/api/registrations`)

| Method | Path | Auth Required | Roles | Purpose | Request Body | Response Payload |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| POST | `/` | Yes | Attendee | Register expo pass | `expo` | `201: Registration` |
| POST | `/session` | Yes | Attendee | Register session | `session` | `201: Registration (with warning if overlapping)` |
| PUT | `/bookmark` | Yes | Attendee | Toggle bookmark | `session` | `200: Registration` or `200: { message: "Bookmark removed" }` |
| GET | `/my` | Yes | Attendee | List my timetable | None | `200: [ Registration ]` |
| DELETE | `/:id` | Yes | Attendee | Cancel registration | None | `200: { message }` |

### 7.7 Messages (`/api/messages`)

| Method | Path | Auth Required | Roles | Purpose | Request Body | Response Payload |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| POST | `/` | Yes | Any (Matrix) | Send message | `receiver, subject, body` | `201: Message` |
| GET | `/inbox` | Yes | Any | Get inbox | None | `200: [ Message ]` |
| GET | `/sent` | Yes | Any | Get sent messages | None | `200: [ Message ]` |
| PUT | `/:id/read` | Yes | Any | Mark read | None | `200: { message, messageObj }` |
| GET | `/unread-count` | Yes | Any | Unread count | None | `200: { count: Number }` |
| GET | `/admin-contact` | Yes | Any | Get admin recipient | None | `200: { _id, name }` |

### 7.8 Public Endpoints (`/api/public`)

| Method | Path | Auth Required | Roles | Purpose | Request Parameters | Response Payload |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| GET | `/landing-data` | No | Any | Home data package | None | `200: { stats, allExpos, featuredExpo, sessions, booths, approvedExhibitors }` |
| GET | `/stats` | No | Any | Platform counters | None | `200: { totalExpos, totalExhibitors, totalSessions, totalAttendees, totalBooths, bookedBooths, occupancyRate }` |
| GET | `/expos` | No | Any | All expos | None | `200: [ Expo ]` |
| GET | `/expos/:id` | No | Any | Public expo dossier | Param: `id` | `200: { expo, sessions, booths, exhibitors }` |
| GET | `/exhibitors` | No | Any | Exhibitor directory | Query: `search, category` | `200: [ Exhibitor ]` |
| GET | `/exhibitors/:id` | No | Any | Exhibitor profile | Param: `id` | `200: { _id, name, company, description, website, category, logo, products, expos }` |
| GET | `/featured-exhibitors` | No | Any | Top partners | None | `200: [ Exhibitor ]` |

### 7.9 Other Endpoints
- Profile (`/api/profile`): `GET /` (get profile), `PUT /` (update profile), `POST /logo` (upload logo).
- Users (`/api/users`): `GET /` (admin only, filter by role).
- Exhibitors (`/api/exhibitors`): `GET /` (logged-in list), `GET /categories`, `GET /:id`.
- Feedback (`/api/feedback`): `POST /` (submit feedback), `GET /` (admin review).
- Notifications (`/api/notifications`): `GET /` (history), `GET /unread-count`, `PUT /read-all`, `PUT /:id/read`.
- Analytics (`/api/analytics`): `GET /admin` (admin executive dashboard).
- Infrastructure: `GET /api/health` (health check returning `{ status, database }`).

---

## 8. Real-Time WebSocket Architecture

Socket.IO is mounted on the primary Node HTTP server in `server/utils/socket.js`.

### Authentication Handshake

Clients connect with an authorization payload:
```javascript
const socket = io("http://localhost:5000", { auth: { token } });
```
The server verifies the JWT token. Upon connection:
- User Room: Automatically joins `user:<userId>`.
- Role Room: Automatically joins `role:<userRole>`.

### Socket Events Reference

| Event Name | Direction | Emitter | Listener Component(s) | Payload | Functional Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `booth:updated` | Server -> Client | `boothController.js` | `ExpoDetails.jsx`, `AdminBooths.jsx`, `ExhibitorBooths.jsx` | `{ expoId }` | Re-fetches floor plan layout instantly when a booth is reserved, assigned, or released. |
| `schedule:updated` | Server -> Client | `sessionController.js` | `ExpoDetails.jsx`, `AdminSessions.jsx`, `MySchedule.jsx` | `{ expoId }` | Re-fetches conference timetables when sessions are added, edited, or deleted. |
| `expo:updated` | Server -> Client | `expoController.js` | `Expos.jsx`, `ExpoDetails.jsx` | `{ expoId, action }` | Broadcasts expo creation, updates, and deletions across directories. |
| `message:new` | Server -> Client | `messageController.js` | `Navbar.jsx`, `Navigation.tsx`, `Messages.jsx` | `Message` | Increments unread message counter badge in navigation and delivers chat message to recipient. |
| `notification` | Server -> Client | `notify.js` | `NotificationBell.jsx`, `ToastContext.jsx` | `Notification` | Triggers alert toast notification and increments notification bell badge. |

---

## 9. Background Jobs & Scheduled Workers

### Session Reminder Scheduler (`server/utils/reminders.js`)

- Initialization: Triggered once after MongoDB connects via `startReminders()` in `server/server.js`.
- Execution Interval: Runs every 60,000 ms (60 seconds).
- Algorithm:
  1. Computes the target window: `now` to `now + 30 minutes`.
  2. Queries `Session.find({ startTime: { $gte: now, $lte: thirtyMinsLater }, reminderSent: false })`.
  3. For each upcoming session, queries `Registration.find({ session: session._id, $or: [{ registered: true }, { bookmarked: true }] })` to identify both registered and bookmarked attendees.
  4. Dispatches an in-app notification via `notifyMany(userIds, message, link)`.
  5. Sets `session.reminderSent = true` and saves the document to prevent duplicate alerts.
  6. If an administrator edits a session's start time in `sessionController.js`, `reminderSent` resets to `false`.

---

## 10. File Upload Specifications

File uploads are managed by Multer in `server/middleware/upload.js`.

- Destination: Files are stored on local disk in `server/uploads/`.
- Static Serving: Exposed at `http://localhost:5000/uploads/*` via `app.use("/uploads", express.static(path.resolve("uploads")))` in `server/server.js`.
- Size Ceiling: 5 MB (`limits: { fileSize: 5 * 1024 * 1024 }`).
- File Naming: Naming collisions and path traversal attacks are prevented using timestamped randomized hashes: `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`.
- Extension Whitelist:
  - Banners & Logos: `.jpeg`, `.jpg`, `.png`, `.webp` (asserts `mimetype.startsWith("image/")`).
  - Documents: `.jpeg`, `.jpg`, `.png`, `.webp`, `.pdf`, `.doc`, `.docx`.
  - Executable extensions (`.exe`, `.sh`, `.php`, `.js`, `.html`) are rejected with an error.

---

## 11. Security Implementation Review

1. Password Cryptography: Salted hashing via `bcryptjs` with cost factor 10 in Mongoose pre-save middleware. Raw passwords are never stored or logged.
2. Token Security: Signed 7-day HMAC-SHA256 tokens. The server terminates immediately on boot if `JWT_SECRET` is unset.
3. Anti-IDOR Authorization: Every mutating endpoint verifies that `req.user._id` matches the document's owner or that `req.user.role === "admin"`.
4. Role Matrix Enforcement: Server-side messaging restrictions prevent attendees from messaging other attendees; only organizers and exhibitors are valid recipients.
5. Parameter Sanitization: `validateObjectId.js` intercepts all route parameters ending in `Id` or named `id` and rejects malformed hex strings with HTTP 400.
6. Public Output Scrubbing: Public expo and exhibitor endpoints strip user email addresses, phone numbers, and password reset tokens.
7. Reset Token Protection: Passwords reset tokens are generated via `crypto.randomBytes(20)` and stored exclusively as SHA-256 hashes in MongoDB. Plaintext reset links are disclosed only when `DEMO_MODE=true` is set.
8. ReDoS Protection: Search inputs in `exhibitorController.js` are escaped with `replace(/[.*+?^${}()|[\]\\]/g, "\\$&")` before regular expression compilation.

---

## 12. Non-Functional Requirements Compliance Matrix

| Metric | Brief Requirement | Implementation Status | Implementation Evidence & Technical Notes |
| :--- | :--- | :---: | :--- |
| Security | Data encryption, secure auth, role control | Implemented | Bcrypt salt 10, JWT, server-side RBAC, sanitized public projections, validateObjectId. |
| Performance | 1 to 2 second response times | Partially Implemented | Fast sub-second response on current seed data. Compound indexes added; cursor pagination is not yet implemented on list endpoints. |
| Availability | 99% uptime target, health checks | Partially Implemented | `/api/health` endpoint and automatic MongoDB reconnection while-loop with 503 outage guard. Automated cloud backup script is not implemented. |
| Usability | Intuitive UI, responsive design | Implemented | High-contrast Neo-Brutalist design system, fluid `clamp()` fonts, mobile navigation drawers, and active route indicators. |
| Accessibility | WCAG adherence | Partially Implemented | High contrast ratios exceeding 7:1; inputs feature `:focus-visible` outline rings; ARIA live regions implemented on toast notifications. |
| Compatibility | Cross-browser & mobile responsive | Implemented | Tested across Chromium, Gecko, and WebKit; viewport meta set; touch targets >= 44 px. |
| Scalability | Horizontal scaling capability | Partially Implemented | Stateless JWT auth; local uploads and single-process WebSocket bus would require S3 and Redis pub/sub for multi-instance scaling. |
| Monitoring | Logging and monitoring tools | Partially Implemented | Console logging and server-side stack trace capture; structured cloud logging (e.g., Winston, Pino) is not integrated. |
| Testing | Unit, integration, and E2E coverage | Partially Implemented | Comprehensive manual test matrix documented in `docs/TEST_CASES.md`; automated test runner not integrated into repository. |
| Documentation | User, developer, and video guides | Implemented | Detailed user guide, developer guide, test specifications, and demo video script provided in `docs/`. |

---

## 13. Known Limitations and Future Scope

### Known Limitations
1. In-App Only Reminders: The reminder worker dispatches in-app notifications and WebSocket alerts. Email delivery via SMTP (SendGrid, Mailgun, Nodemailer) is not implemented.
2. Local Disk Storage: Uploaded exhibitor documents and logos are stored in `server/uploads/` on the local file system rather than Amazon S3 or Cloudinary.
3. No Automated Test Runner: There are no unit or integration test runners (Vitest, Jest) configured in `package.json`.
4. Simulated Analytics Multipliers: Attendee category breakdowns in `analyticsController.js` use proportional multipliers rather than dedicated demographic database models.
5. In-Memory Socket Adapter: Sockets run in a single Node process without a Redis pub/sub adapter.

### Future Scope
1. Integration of Nodemailer / SendGrid for production email notifications and password reset delivery.
2. Migration of file storage to Amazon S3 or Cloudinary with pre-signed upload URLs.
3. Implementation of Redis adapter for multi-instance horizontal scaling.
4. Exporting session schedules directly to Google Calendar and Apple iCal (.ics format).
5. Stripe or PayPal payment gateway integration for commercial booth leasing.

---

## 14. Troubleshooting Runbook

### MongoDB Connection Outages
- Symptom: Server returns HTTP 503 Service Unavailable with message "The database is unavailable. Please try again shortly."
- Resolution: Check that your MongoDB Atlas IP Access List includes your current public IP address (or `0.0.0.0/0` for development). If using local MongoDB, verify that the local service is running (`sudo systemctl status mongod` or Windows Services). The server automatically attempts reconnection every 10 seconds.

### Duplicate Key Errors (E11000)
- Symptom: Console logs report `E11000 duplicate key error collection: eventsphere.registrations`.
- Resolution: Run the index migration utility:
  ```bash
  cd server
  node scripts/dropOldRegistrationIndexes.js
  ```
  This removes outdated unique indexes from previous schema iterations and applies partial compound unique indexes.

### Port Conflicts
- Symptom: `Error: listen EADDRINUSE: address already in use :::5000`.
- Resolution: Kill the process holding port 5000:
  - Windows: `netstat -ano | findstr :5000` followed by `taskkill /PID <PID> /F`.
  - macOS/Linux: `lsof -i :5000` followed by `kill -9 <PID>`.

### Environment Variable Reloading
- Symptom: Changes to `server/.env` are not reflected in application behavior.
- Resolution: Nodemon does not always detect changes to non-JavaScript files. Stop the server (Ctrl + C) and restart with `npm run dev`.
