# EventSphere Management Platform 🚀

EventSphere is a comprehensive full-stack MERN (MongoDB, Express, React, Node.js) web application for managing modern expos, conferences, and conventions. It provides role-based interfaces for Admins, Exhibitors, and Attendees, complete with real-time Socket.IO updates, interactive booth layouts, session scheduling, in-app messaging, live notifications, and visual analytics dashboards.

---

## 🌟 Key Features by Role

### 👑 Admin
- **Expo Management**: Create, edit, and delete expos with automated booth generation and date overlap protection.
- **Booth Layout Control**: View grid layouts, assign booths to approved exhibitors, confirm self-service reservations, or release booked booths.
- **Application Workflow**: Review exhibitor applications, download company documents, and approve or reject submissions.
- **Session Management**: Schedule sessions with speaker info, topics, rooms, and automated location/time collision detection.
- **Visual Analytics**: Interactive Recharts dashboards showing total system metrics, booth status breakdown, application ratios, top 5 popular sessions, and booth occupancy percentages.
- **Feedback & Inbox**: Review user feedback (suggestions & bug reports) and communicate directly with attendees or exhibitors.

### 🏢 Exhibitor
- **Profile & Branding**: Set company details, category, logo image, products, and contact links.
- **Expo Applications**: Apply for upcoming expos with optional file uploads (brochures/PDFs).
- **Booth Self-Selection**: Reserve available booths on an interactive floor plan grid, track reservation status, add staff rosters, and update booth showcase details.
- **Attendee Inquiries**: Receive direct messages from interested attendees and communicate with event organizers.

### 👥 Attendee
- **Expo Discovery**: Browse upcoming expos by date, location, theme, and topic with keyword search and filtering.
- **Interactive Floor Plan**: View booth layouts and click on booked booths to view exhibitor profiles.
- **Session Scheduling**: Register for sessions, bookmark favorite talks, and view a personalized schedule grouped by day.
- **Exhibitor Directory**: Search exhibitors by company name or category and visit detailed public profile pages.
- **Live Notifications & Reminders**: Real-time Socket.IO toast notifications for upcoming registered sessions (30 minutes prior), booth updates, and new messages.
- **Platform Feedback**: Submit suggestions or report technical issues directly to the admin team.

---

## 🛠 Tech Stack

- **Frontend**: React (Vite / ES Modules), React Router v6, Socket.IO Client, Recharts, Vanilla CSS (Design Tokens, Responsive Flexbox & Grid layouts).
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Socket.IO, JWT Authentication, Multer (File Uploads), BcryptJS.

---

## 📋 Prerequisites

- **Node.js**: v18.x or higher
- **MongoDB**: Local instance running at `mongodb://127.0.0.1:27017/eventsphere` or a MongoDB Atlas Cluster URI.
- **npm**: v9.x or higher

---

## 🚀 Step-by-Step Setup Guide

### 1. Clone the Repository
```bash
git clone <repository-url>
cd EventSphere_Eproject
```

### 2. Configure Environment Variables
Navigate to the `server` directory and copy the `.env.example` file:
```bash
cd server
cp .env.example .env
```
*Ensure `MONGO_URI` and `JWT_SECRET` are correctly configured in `server/.env`.*

### 3. Install Dependencies
Install dependencies for both server and client:
```bash
# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

### 4. Seed Seed & Demo Data
Populate MongoDB with default Admin credentials and rich demo data:
```bash
cd ../server
npm run seed:demo
```

### 5. Run the Application
Start the backend server and frontend client development servers:

**Backend Server (Port 5000):**
```bash
cd server
npm run dev
```

**Frontend Client (Port 5173):**
```bash
cd client
npm run dev
```

---

## 🌐 Default Ports & URLs

- **Client App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Static Uploads**: [http://localhost:5000/uploads](http://localhost:5000/uploads)

---

## 🔑 Demo Account Credentials

All seeded demo accounts share the password `Demo@123` (Admin uses `Admin@123`):

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@eventsphere.com` | `Admin@123` | Full Administrative & Analytics Access |
| **Exhibitor 1** | `exhibitor1@demo.com` | `Demo@123` | TechCorp (Technology) |
| **Exhibitor 2** | `exhibitor2@demo.com` | `Demo@123` | Gourmet Foods (Food & Beverage) |
| **Exhibitor 3** | `exhibitor3@demo.com` | `Demo@123` | Vogue Apparel (Fashion) |
| **Attendee 1** | `attendee1@demo.com` | `Demo@123` | Registered for Expos & Sessions |
| **Attendee 2** | `attendee2@demo.com` | `Demo@123` | Bookmarks & Schedule Management |

---

## 📁 Folder Structure

```
EventSphere_Eproject/
├── client/                      # Frontend Application (React + Vite)
│   ├── src/
│   │   ├── components/          # Navbar, Loading spinner, NotificationBell, ProtectedRoute
│   │   ├── context/             # AuthContext, SocketContext, ToastContext
│   │   ├── pages/               # Home, Login, Register, Messages, Feedback, Notifications
│   │   │   ├── admin/           # AdminExpos, AdminBooths, AdminApplications, AdminSessions, AdminAnalytics
│   │   │   ├── exhibitor/       # ExhibitorProfile, MyApplications, ExhibitorBooths
│   │   │   └── attendee/        # AttendeeExpos, ExpoDetails, ExhibitorProfileView, MySchedule
│   │   ├── services/            # Axios API client instance
│   │   └── index.css            # Custom CSS Tokens, Dark/Light Components & Responsiveness
│   └── package.json
│
├── server/                      # Backend REST API & Real-time Server (Node + Express)
│   ├── config/                  # Database Connection (MongoDB)
│   ├── controllers/             # Auth, Expo, Booth, Application, Session, Message, Notification, Analytics
│   ├── middleware/              # Auth Protection, Admin Guard, Multer Uploads
│   ├── models/                  # Mongoose Schemas (User, Expo, Booth, Application, Session, etc.)
│   ├── routes/                  # API Endpoint Definitions
│   ├── seed/                    # Demo & Admin Seed Scripts
│   ├── utils/                   # Socket.IO helper, Notification builder, Session Reminders timer
│   ├── uploads/                 # Static Upload Storage (.gitkeep)
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## 📑 Summary Table of API Routes

| Module | Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Public | Register new user account |
| **Auth** | `POST` | `/api/auth/login` | Public | User login & JWT issuance |
| **Auth** | `GET` | `/api/auth/me` | Protected | Fetch current logged-in user profile |
| **Expos** | `GET` | `/api/expos` | Public | List all expos with search/date filters |
| **Expos** | `POST` | `/api/expos` | Admin | Create expo and generate 20 booths |
| **Expos** | `PUT` | `/api/expos/:id` | Admin | Update expo details |
| **Expos** | `DELETE` | `/api/expos/:id` | Admin | Delete expo and related data |
| **Booths** | `GET` | `/api/expos/:expoId/booths` | Public | Get all booths for an expo |
| **Booths** | `PUT` | `/api/booths/:id/reserve` | Exhibitor | Reserve an available booth |
| **Booths** | `PUT` | `/api/booths/:id/confirm` | Admin | Confirm reserved booth to booked |
| **Booths** | `PUT` | `/api/booths/:id/assign` | Admin | Assign booth to approved exhibitor |
| **Booths** | `PUT` | `/api/booths/:id/release` | Admin | Release a booked or reserved booth |
| **Applications**| `POST` | `/api/applications` | Exhibitor | Submit booth application with documents |
| **Applications**| `GET` | `/api/applications` | Admin | View applications with status filters |
| **Applications**| `PUT` | `/api/applications/:id/status`| Admin | Approve or reject an application |
| **Sessions** | `GET` | `/api/expos/:expoId/sessions`| Public | Fetch scheduled sessions for an expo |
| **Sessions** | `POST` | `/api/sessions` | Admin | Add new session (with overlap check) |
| **Registrations**| `POST` | `/api/registrations` | Attendee | Register for an expo |
| **Registrations**| `POST` | `/api/registrations/session`| Attendee | Register for a session |
| **Registrations**| `PUT` | `/api/registrations/bookmark`| Attendee | Toggle bookmark on a session |
| **Messages** | `POST` | `/api/messages` | Protected | Send in-app message |
| **Messages** | `GET` | `/api/messages/inbox` | Protected | View inbox messages |
| **Notifications**| `GET` | `/api/notifications` | Protected | Get live notifications list |
| **Analytics** | `GET` | `/api/analytics/admin` | Admin | Get full system analytics metrics |

---

## ❓ Troubleshooting

1. **MongoDB Connection Failed / Atlas Timeout**:
   - Ensure your local MongoDB service is running (`net start MongoDB` on Windows) or check your Atlas IP Whitelist (add `0.0.0.0/0` for development).
2. **CORS Policy Error**:
   - Verify that the React client is running on port `5173` or update the CORS origin inside `server/server.js` and `server/utils/socket.js`.
3. **Port 5000 or 5173 Already in Use**:
   - Kill any existing Node processes or specify a different `PORT` in `server/.env`.
4. **Socket.IO Real-Time Connection Issues**:
   - Ensure your JWT token in `localStorage` is valid and not expired. Logging out and logging back in regenerates a fresh token for socket authentication.
