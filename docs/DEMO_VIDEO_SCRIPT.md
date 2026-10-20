# EventSphere Management - Demonstration Video Script

- Target Duration: 7 minutes (420 seconds)
- Video Format: 1080p Full HD, 60 FPS
- Audio Style: Clear, professional narration
- Pre-requisites: From the `server` folder, run `npm run seed:demo` against a dedicated demo database. This seed script clears and recreates demo data. Start the server and client with their documented `npm run dev` commands. Configure a registered or bookmarked demo session to start within 30 minutes of recording if demonstrating its automated reminder.

---

### Scene Breakdown & Timing

#### Scene 1: Introduction and Public Landing Page (0:00 - 0:30)
- Visual: Open `http://localhost:5173/`. Show the landing page and navigation, then open the public expos directory and exhibitor directory.
- Narration:
  "Welcome to EventSphere Management, an event and expo management application built with MongoDB, Express, React, Node.js, and Socket.IO. Visitors can browse public expos, schedules, floor plans, exhibitors, and contact information before creating an account."

#### Scene 2: Registration and Password Recovery (0:30 - 1:20)
- Visual: Open Register Pass and show attendee and exhibitor options. Demonstrate attendee registration with a new demo identity, then open Forgot Password and show the reset-link flow using a seeded account. Do not expose real credentials in the recording.
- Narration:
  "Visitors can create attendee or exhibitor accounts. Password recovery currently generates a reset link for display in the application; it does not send email. Reset tokens expire after 15 minutes, and the current link display is not gated by the DEMO_MODE environment variable."

#### Scene 3: Admin Expo Setup and Booth Generation (1:20 - 2:15)
- Visual: Log in as Admin and open `/admin/expos`. Create a demo expo and show the generated booth spaces. Open an existing expo's Edit action and identify the Delete action without deleting live data.
- Narration:
  "The admin workspace supports expo creation, editing, and deletion. Creating an expo can generate its initial booth grid. Expo deletion also removes associated records, so this action should only be demonstrated in the disposable demo database."

#### Scene 4: Booth Reservation and Exhibitor Roster (2:15 - 3:10)
- Visual: Log in as an exhibitor with an approved application. Open `/exhibitor/booths`, select an available booth, choose Reserve Booth Space, then show the exhibitor booth details and staff roster.
- Narration:
  "An exhibitor with an approved application can reserve an available booth. The booth changes to Reserved until confirmed by an administrator. Exhibitors can also maintain their booth description and staff roster."

#### Scene 5: Exhibitor Profile and Attendee Messaging (3:10 - 4:10)
- Visual: Open `/exhibitor/profile`, update the demo company profile and upload a permitted JPG, JPEG, PNG, or WEBP logo. Then sign in as an attendee, open an exhibitor profile, send a message, and show it in the exhibitor inbox.
- Narration:
  "Exhibitors can update their public company profile and logo. Attendees can contact exhibitors through the messaging interface. Incoming messages use the `message:new` Socket.IO event to update the recipient's navigation badge."

#### Scene 6: Attendee Registration, Reminder, and Feedback (4:10 - 5:20)
- Visual: As the attendee, register for an expo and a session, bookmark another session, and open My Schedule. For the reminder demonstration, use a registered or bookmarked session whose start time is within the next 30 minutes; wait for the scheduler poll and show the notification bell. Submit a feedback item.
- Narration:
  "Attendees can register for expos and sessions, bookmark sessions, and review their personal schedule. The server polls every 60 seconds and creates an in-app reminder 30 minutes before a registered or bookmarked session. Feedback can be submitted as a suggestion or an issue."

#### Scene 7: Analytics and Role Guards (5:20 - 6:20)
- Visual: Log in as Admin and open `/admin/analytics`. Show the metric cards and both charts, then identify which values are measured counts and which chart categories use simulated or fallback values. Separately, log in as an attendee and attempt to open `/admin` to demonstrate the role guard.
- Narration:
  "The admin analytics page reports expo, booth, attendee, exhibitor, registration, and session counts. Attendance-category chart values are simulated from fixed proportions, and some booth chart values use fallbacks; the system does not measure booth traffic or session popularity. Role-protected workspaces restrict access by account type."

#### Scene 8: Responsive Layout and Closing (6:20 - 7:00)
- Visual: Use the browser's device emulation to show the public landing page and expo directory at mobile width. Open and close the mobile navigation, then return to the landing page.
- Narration:
  "The interface includes responsive layouts and mobile navigation. Browser compatibility, accessibility conformance, and performance targets remain to be verified. This concludes the EventSphere Management demonstration."
