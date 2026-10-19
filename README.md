# 🌐 EventSphere Management (EventSphere_Eproject)
### *Next-Generation Expo, Trade Show & Floor Plan Operating System*

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Real--Time-Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![Framer Motion](https://img.shields.io/badge/Motion-Framer%20Motion%20%2B%20Lenis-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

---

## 📖 Executive Summary & Background

Traditional large-scale expo and trade show management has long been crippled by fragmented workflows: manual paper registration queues, delayed floor plan assignments, double-booked booths, disjointed communication channels, and static, unengaging event schedules.

**EventSphere Management** is an enterprise-grade, synchronous web platform built to eliminate these pain points. It connects **Organizers (Admins)**, **Exhibitors**, and **Attendees** into one unified, real-time ecosystem powered by the **MERN stack**, **Socket.IO live telemetry**, and an award-winning **Neo-Brutalist festival-inspired UI**.

---

## 🎨 UI/UX & Design System Architecture

EventSphere combines an editorial **Neo-Brutalist design language** with high-performance **Framer Motion spring physics** and **Lenis momentum smooth scrolling**.

### 1. Design Tokens & Color Palette
| Token Name | Hex / RGB Value | Role in UI |
| :--- | :--- | :--- |
| **Primary Red** | `rgb(255, 62, 51)` / `#ff3e33` | Brand accent, hero background, key action triggers |
| **Dark** | `rgb(35, 30, 37)` / `#231e25` | 2.5px solid borders, hard drop shadows (`6px 6px 0px`), dark canvas |
| **Light Cream** | `rgb(255, 248, 235)` / `#fff8eb` | Primary card background, editorial surface |
| **Kiwi Green** | `rgb(171, 241, 57)` / `#abf139` | Available booth status, verified badges, live signals |
| **Selective Yellow** | `rgb(254, 184, 4)` / `#feb804` | Reserved booth status, speaker backdrop, alert badges |
| **Purple Mimosa** | `rgb(166, 126, 255)` / `#a67eff` | Sponsor canvas, keynote tracks, exhibitor portal badge |
| **Cerulean Blue** | `rgb(20, 166, 234)` / `#14a6ea` | Interactive tags, TV logo, directory chips |
| **Light Salmon** | `rgb(255, 164, 144)` / `#ffa490` | Terracotta sponsor card, attendee schedules |

### 2. Typography Hierarchy
- **Display Headings**: `Bebas Neue` (400 weight, uppercase, letter-spacing: `1.5px` to `3px`).
- **Body, UI & Meta**: `Satoshi` (400 regular, 500 medium, 700/800 bold, line-height: `1.35` to `1.5`).

---

## 🚀 Core Features & Role-Based Workflows

```
                           ┌───────────────────────────────┐
                           │   EVENTSPHERE UNIFIED HUB     │
                           └───────────────┬───────────────┘
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         │                                 │                                 │
         ▼                                 ▼                                 ▼
┌───────────────────┐             ┌───────────────────┐             ┌───────────────────┐
│   ADMIN CONSOLE   │             │ EXHIBITOR PORTAL  │             │ ATTENDEE PLATFORM │
├───────────────────┤             ├───────────────────┤             ├───────────────────┤
│ • Expo CRUD       │             │ • Profile & Logo  │             │ • Event Discovery │
│ • Booth Grid Gen  │             │ • Multi-Doc App   │             │ • Custom Schedule │
│ • App Approvals   │             │ • Self-Selection  │             │ • Interactive Map │
│ • Live Recharts   │             │ • Staff Roster    │             │ • 1-on-1 Chat     │
│ • Broadcast Chat  │             │ • Lead Tracking   │             │ • Issue Feedback  │
└───────────────────┘             └───────────────────┘             └───────────────────┘
```

### 🛠️ 1. Administrator / Organizer Console
- **Expo Lifecycle Management**: Create, edit, and schedule multi-day trade shows with custom locations, dates, themes, and descriptions.
- **Automated Booth Floor Plan Generator**: Generates interactive booth grids with customizable dimensions (`3x3 m`), pricing tiers, and real-time status management (`Available`, `Reserved`, `Booked`).
- **Exhibitor Application Review**: Review submitted commercial applications, download uploaded compliance documents (PDFs/DOCs/Images), and execute instant **Approve / Reject** decisions.
- **Session & Keynote Timetable**: Assign speakers, room locations, and datetime slots with live socket synchronization.
- **Executive Analytics Dashboard**: Interactive **Donut & Bar Charts (`Recharts`)** visualizing attendee footfall curves, floor plan occupancy percentages, and industry category breakdowns.

### 🏢 2. Exhibitor Portal
- **Brand Profile Workspace**: Configure company profile, industry classification, website URL, description, and upload company logos via Multer.
- **Interactive Booth Self-Selection**: Browse live interactive floor plans with color-coded availability and reserve spaces in real time.
- **Staff Roster Management**: Assign and manage on-site booth staff members with badge roles.
- **Application Tracker**: Real-time status updates on submitted participation requests and assigned booth numbers.
- **Direct Organizer Channel**: Real-time messaging to coordinate special booth requirements or sponsorship requests.

### 🎫 3. Attendee Interface
- **Expo Directory & Floor Navigation**: Filter expos by theme, explore interactive booth maps, and view exhibitor showcases.
- **Personalized Timetable & Bookmarking**: Browse schedules, register for limited-seat workshops, and bookmark sessions with live reminders.
- **B2B Exhibitor Appointments**: Initiate direct messages with exhibitors to schedule product demos and inquiries.
- **Feedback & Review System**: Submit categorized user suggestions (`💡 Suggestion`) or report venue issues (`⚠️ Issue`).

### 🎪 4. Public Animated Landing Page
- **Hero Section**: Mouse spotlight gradient, cursor photo trail, and kinetic `{ REDEFINING }` spring brackets.
- **Horizontal Stage Reel (`25 Years in 2025`)**: 3,400px scroll track that converts vertical scroll into smooth horizontal photo translation with zero overlap.
- **Manifesto & About Section**: Word-by-word scroll-scrubbed text reveal, 3D mouse tilt photo card, and spinning manifesto stamp badge.
- **6-Speaker Leadership Lineup**: Staggered 3-column masonry with comic contour silhouettes and viewfinder corner handles.
- **4K Cinema Stage Intermission**: Full-bleed background video with CRT scanline overlay and audio mute/unmute toggle.
- **Interactive Schedule**: Expanding stage photo thumbnails on hover with rotating arrow indicators.
- **Stacking Sponsors Deck**: 4 brutalist sponsor cards that unstack on scroll while the background dynamically morphs colors (**Pink $\to$ Yellow $\to$ Terracotta $\to$ Kiwi**).
- **Testimonials Deck**: 4 layered attendee cards with scroll-driven peeling and click-to-inspect.
- **Perforated Festival Pass**: Torn-paper ticket with punch-hole cutouts, barcode, QR code, and tear animation.
- **Wobbly Spring FAQs**: Interactive accordions that pop open at random `-2°` / `+2°` angles.
- **Section-Aware Custom Cursor**: A retro mouse pointer that automatically themes itself to match the active section.

---

## 💻 Tech Stack & Architecture

### Frontend (`client/`)
- **Core**: React 18, Vite, React Router DOM v6
- **Animation**: Framer Motion 11, Lenis Momentum Smooth Scroll
- **Visuals & Charts**: Recharts, Canvas WebGL shaders, Custom SVGs
- **HTTP & Sockets**: Axios (with JWT interceptors), Socket.IO Client
- **Icons & Typography**: Google Fonts (Bebas Neue), FontShare (Satoshi)

### Backend (`server/`)
- **Runtime & Framework**: Node.js, Express.js
- **Database & ODM**: MongoDB Atlas, Mongoose
- **Real-Time Communication**: Socket.IO
- **Security & Auth**: JSON Web Tokens (JWT), Bcrypt password hashing, Role-Based Access Control (RBAC) middleware
- **File Storage**: Multer (Local static file uploads)

---

## 📁 Complete Repository Structure

```text
EventSphere_Eproject/
├── client/                               # Frontend Application (React + Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx                # Unified Dashboard Navbar (Role Pills, Socket Unread)
│   │   │   ├── NotificationBell.jsx      # Live Notification Dropdown
│   │   │   ├── ProtectedRoute.jsx        # RBAC Route Guard
│   │   │   ├── Loading.jsx               # Branded Loading Spinner
│   │   │   │
│   │   │   └── landing/                  # Public Landing Page UI
│   │   │       ├── common/
│   │   │       │   ├── CustomCursor.tsx
│   │   │       │   ├── GlobalBackground.tsx
│   │   │       │   ├── RollingTextButton.tsx
│   │   │       │   ├── CursorImageTrail.tsx
│   │   │       │   └── RetroTvLogo.tsx
│   │   │       ├── navigation/
│   │   │       │   └── Navigation.tsx
│   │   │       └── sections/
│   │   │           ├── HeroSection.tsx
│   │   │           ├── HorizontalScrollSection.tsx
│   │   │           ├── AboutSection.tsx
│   │   │           ├── SpeakersSection.tsx
│   │   │           ├── VideoIntermissionSection.tsx
│   │   │           ├── AgendaSection.tsx
│   │   │           ├── StackingSponsorsSection.tsx
│   │   │           ├── TestimonialsDeckSection.tsx
│   │   │           ├── TicketSection.tsx
│   │   │           ├── RecordingsSection.tsx
│   │   │           ├── FAQSection.tsx
│   │   │           ├── MarqueeCTASection.tsx
│   │   │           └── Footer.tsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx           # JWT Auth State, User Profile & Login/Register
│   │   │   ├── SocketContext.jsx         # Live WebSocket Connection
│   │   │   └── ToastContext.jsx          # Flash Notifications
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx                  # Public Landing Page View
│   │   │   ├── Login.jsx                 # Full-Screen Neo-Brutalist Login
│   │   │   ├── Register.jsx              # Full-Screen Neo-Brutalist Registration
│   │   │   ├── ForgotPassword.jsx        # Password Reset Request
│   │   │   ├── ResetPassword.jsx         # Password Reset Handler
│   │   │   ├── Messages.jsx              # Real-Time Chat & Inbox
│   │   │   ├── Notifications.jsx         # Notification Center
│   │   │   ├── Feedback.jsx              # User Feedback Submission
│   │   │   ├── Unauthorized.jsx          # 403 Error Page
│   │   │   ├── NotFound.jsx              # 404 Error Page
│   │   │   │
│   │   │   ├── admin/                    # Admin Console Pages
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AdminExpos.jsx
│   │   │   │   ├── AdminBooths.jsx
│   │   │   │   ├── AdminSessions.jsx
│   │   │   │   ├── AdminApplications.jsx
│   │   │   │   ├── AdminAnalytics.jsx
│   │   │   │   └── AdminFeedback.jsx
│   │   │   │
│   │   │   ├── exhibitor/                # Exhibitor Portal Pages
│   │   │   │   ├── ExhibitorDashboard.jsx
│   │   │   │   ├── ExhibitorProfile.jsx
│   │   │   │   ├── ExhibitorExpos.jsx
│   │   │   │   ├── ExhibitorBooths.jsx
│   │   │   │   └── MyApplications.jsx
│   │   │   │
│   │   │   └── attendee/                 # Attendee Platform Pages
│   │   │       ├── AttendeeDashboard.jsx
│   │   │       ├── AttendeeExpos.jsx
│   │   │       ├── ExpoDetails.jsx
│   │   │       ├── ExhibitorProfileView.jsx
│   │   │       └── MySchedule.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js                    # Axios API Client with Auth Interceptor
│   │   ├── styles/
│   │   │   ├── tokens.css                # Color Variables & Typography
│   │   │   ├── typography.css            # Scale Definitions
│   │   │   └── animations.css            # Keyframes & Scanlines
│   │   ├── App.jsx                       # Routing & Layout Dispatcher
│   │   ├── main.jsx                      # Vite React Root
│   │   └── index.css                     # Global Reset & Responsive Container
│   ├── package.json
│   └── vite.config.js
│
├── server/                               # Backend REST & Socket Server (Node.js)
│   ├── config/
│   │   └── db.js                         # MongoDB Connection String
│   ├── controllers/                      # Business Logic
│   │   ├── authController.js
│   │   ├── expoController.js
│   │   ├── boothController.js
│   │   ├── applicationController.js
│   │   ├── sessionController.js
│   │   ├── messageController.js
│   │   ├── notificationController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js             # JWT Guard
│   │   ├── roleMiddleware.js             # RBAC Permission Guard
│   │   └── uploadMiddleware.js           # Multer Document & Logo Parser
│   ├── models/                           # Mongoose Data Schemas
│   │   ├── User.js
│   │   ├── Expo.js
│   │   ├── Booth.js
│   │   ├── Application.js
│   │   ├── Session.js
│   │   ├── Message.js
│   │   ├── Notification.js
│   │   └── Feedback.js
│   ├── routes/                           # API Endpoint Definitions
│   │   ├── authRoutes.js
│   │   ├── expoRoutes.js
│   │   ├── boothRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── sessionRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── feedbackRoutes.js
│   │   └── analyticsRoutes.js
│   ├── uploads/                          # Static Upload Directory
│   ├── .env.example
│   ├── server.js                         # Express Server & Socket.IO Listener
│   └── package.json
└── README.md
```

---

## ⚡ Installation & Quick Start Guide

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **MongoDB**: Local MongoDB instance or MongoDB Atlas URI

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/WANIYAM/EventSphere_Eproject.git
cd EventSphere_Eproject
```

---

### Step 2: Configure & Start the Backend (`server/`)

1. Navigate to the server folder:
   ```bash
   cd server
   npm install
   ```

2. 2. Create a `.env` file inside `server/`:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/eventsphere?retryWrites=true&w=majority
   JWT_SECRET=eventsphere_super_secret_jwt_key_2025
   CLIENT_URL=http://localhost:5173
   DEMO_MODE=true

3. Seed initial demo data (optional, creates admin & demo expos):
   ```bash
   npm run seed
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *Backend will run on: `http://localhost:5000` with WebSocket support.*

---

### Step 3: Configure & Start the Frontend (`client/`)

1. Open a new terminal and navigate to `client/`:
   ```bash
   cd client
   npm install
   ```

2. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *Frontend will run on: `http://localhost:5173`.*

---

## 🔑 Demo Login Credentials

The test database is populated with deterministic accounts generated via `npm run seed:demo`. You can use the quick login buttons on the `/login` gateway or the credentials below:

| Role | Email Address | Password | Access Rights & Modules |
| :--- | :--- | :--- | :--- |
| **Admin / Organizer** | `admin@eventsphere.com` | `Admin@123` | Full administrative control: Expo CRUD, booth allocations, session scheduler, application approvals, analytics telemetry, feedback inbox. |
| **Exhibitor** | `bushbabe@demo.com` | `Demo@123` | Bush Babe Displays: Booth self-selection, company profile, staff management, document applications, organizer messaging. |
| **Exhibitor** | `epyc@demo.com` | `Demo@123` | EPYC Systems: Cloud infrastructure showcase, booth reservations, application tracker. |
| **Attendee** | `attendee1@demo.com` | `Demo@123` | Aisha Khan: Expo pass claiming, session registration and bookmarking, personal schedule, exhibitor inquiries. |
| **Attendee** | `attendee2@demo.com` | `Demo@123` | Daniel Tan: Conference pass, session scheduling, in-app notifications. |

*(All 24 seeded exhibitors and 40 seeded attendees use password `Demo@123`).*

---

## 📚 Project Documentation

Comprehensive technical, functional, and quality documentation is maintained in the [`docs/`](docs/) directory:

- [User Guide & FAQs](docs/USER_GUIDE.md) — Step-by-step user manuals for Visitors, Attendees, Exhibitors, and Administrators, with 25 code-accurate FAQs.
- [Developer & Technical Architecture Guide](docs/DEVELOPER_GUIDE.md) — Architectural overview, real folder tree, Mongoose schema dictionary, Mermaid ERD, complete API reference, and non-functional requirements status.
- [Manual Test Cases Matrix](docs/TEST_CASES.md) — 64 detailed test cases covering authentication, floor plans, sessions, messaging, and resilience.
- [Screenshot Checklist](docs/SCREENSHOT_CHECKLIST.md) — Numbered reference guide for all 24 UI demonstration screenshots.
- [Demonstration Video Script](docs/DEMO_VIDEO_SCRIPT.md) — A 7-minute scene-by-scene walkthrough script covering all user roles and multi-window WebSocket synchronization.

---

## 🔌 API Endpoint Specifications

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register new user (Admin, Exhibitor, or Attendee).
- `POST /api/auth/login` — Authenticate and receive JWT token.
- `GET /api/auth/profile` — Get authenticated user details.
- `PUT /api/auth/profile` — Update company/profile details.
- `POST /api/auth/profile/logo` — Upload exhibitor company logo (`multipart/form-data`).
- `POST /api/auth/forgot-password` — Generate password reset token.
- `POST /api/auth/reset-password/:token` — Set new password using token.

### Expos & Floor Plans (`/api/expos`)
- `GET /api/expos` — Retrieve all expos.
- `GET /api/expos/:id` — Retrieve single expo details.
- `POST /api/expos` — Create new expo and auto-generate booth spaces (Admin only).
- `PUT /api/expos/:id` — Update expo metadata (Admin only).
- `DELETE /api/expos/:id` — Delete expo and associated booths (Admin only).
- `GET /api/expos/:id/booths` — Get all floor plan booths for an expo.
- `GET /api/expos/:id/sessions` — Get all scheduled sessions for an expo.

### Booth Management (`/api/booths`)
- `PUT /api/booths/:id` — Update booth dimensions, price, status (Admin only).
- `PUT /api/booths/:id/reserve` — Reserve available booth (Exhibitor self-selection).
- `PUT /api/booths/:id/confirm` — Confirm booth reservation to `booked` (Admin only).
- `PUT /api/booths/:id/release` — Release booth back to `available`.
- `PUT /api/booths/:id/assign` — Assign approved exhibitor to booth (Admin only).
- `PUT /api/booths/:id/my-details` — Update booth showcase requirements & staff roster.

### Applications (`/api/applications`)
- `GET /api/applications` — List all applications with status filters (Admin only).
- `GET /api/applications/my` — List applications submitted by authenticated exhibitor.
- `POST /api/applications` — Submit booth application with up to 3 documents (`multipart/form-data`).
- `PUT /api/applications/:id/status` — Approve or Reject application (Admin only).

### Real-Time Messaging (`/api/messages`)
- `GET /api/messages/inbox` — Retrieve user's inbox messages.
- `GET /api/messages/sent` — Retrieve user's sent message archive.
- `GET /api/messages/unread-count` — Get total unread messages count.
- `POST /api/messages` — Send new message (triggers `message:new` socket event).
- `PUT /api/messages/:id/read` — Mark message as read.

### Analytics (`/api/analytics`)
- `GET /api/analytics/admin` — Executive analytics telemetry (booth allocation, registrations, session popularity).

---

## 📡 WebSocket Real-Time Events (`Socket.IO`)

| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `booth:updated` | Server $\to$ Client | `{ expoId, boothId, status }` | Broadcasts live floor plan changes instantly across all users. |
| `schedule:updated`| Server $\to$ Client | `{ expoId, sessionId }` | Triggers instant schedule re-sync for all attendees. |
| `message:new` | Server $\to$ Client | `{ messageId, sender, receiver }` | Increments unread message counter in the Navbar in real time. |
| `notification:new`| Server $\to$ Client | `{ notificationId, message, link }` | Pops toast notification and updates bell dropdown. |

---

## 🔒 Security & Non-Functional Compliance

- **Data Protection**: Passwords encrypted via `bcryptjs` with salt rounds. All API traffic authenticated via `Bearer <JWT>`.
- **RBAC Guards**: Protected route middleware ensures exhibitors cannot alter floor plans and attendees cannot access admin modules.
- **Hardware Acceleration**: Animations powered by CSS GPU transforms and `framer-motion` layout recalculation to maintain steady **60–120 FPS**.
- **GDPR Compliance**: User registration requires explicit consent with secure data purging.

---

## 👥 Authors & Contributors

- **EventSphere Engineering Team**
- **Institution**: Universiti Sains Malaysia (USM), School of Computer Sciences
- **Project**: EventSphere MERN eProject 2025

---

## 📄 License
This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
```

---

### How to use it:
1. Create or open the file **`README.md`** in the root folder of your project (`EventSphere_Eproject/README.md`).
2. Paste the text above into the file.
3. Commit and push to GitHub:
   ```bash
   git add README.md
   git commit -m "docs: complete comprehensive EventSphere README"
   git push origin main
   ```