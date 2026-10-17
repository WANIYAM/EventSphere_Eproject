# EventSphere Management - Demonstration Video Script

- Target Duration: 7 minutes (420 seconds)
- Video Format: 1080p Full HD, 60 FPS
- Audio Style: Clear, professional narrative voiceover
- Pre-requisites: Execute `npm run seed:demo` prior to recording to ensure full data hydration.

---

### Scene Breakdown & Timing

#### Scene 1: Introduction & Architecture (0:00 - 0:45)
- Visual: Open browser to http://localhost:5173. Scroll down the public landing page showcasing the kinetic typography, smooth scrolling, and the stage recordings video wall.
- Narration:
  "Welcome to EventSphere Management, a real-time event operating system built on the MERN stack with Socket.IO. Traditional trade shows suffer from manual queues, static floor plans, and double-booked booths. EventSphere connects organizers, exhibitors, and attendees into a unified platform. Let us explore the system across its primary roles."

#### Scene 2: Visitor Discovery & Public Directories (0:45 - 1:40)
- Visual: Click Expos in navigation. Filter by city. Click View Details on an upcoming expo. Switch between the Schedule, Exhibitors, and Floor Plan tabs. Open /exhibitors and demonstrate live search filtering by typing "cloud".
- Narration:
  "Unauthenticated visitors have immediate access to public event dossiers. The directory organizes expos by region. Inside an expo, visitors can inspect multi-day timetables, search participating commercial brands, and view the architectural floor plan with color-coded booth availability. Notice that public responses are sanitized to protect corporate emails."

#### Scene 3: Attendee Pass Registration & Personal Timetable (1:40 - 2:50)
- Visual: Click Login. Click the Attendee 1-click demo button. Log in as attendee1@demo.com. Open an expo. Register for the event pass. Switch to the Schedule tab, register for an active keynote, and bookmark a workshop. Navigate to My Schedule (/schedule).
- Narration:
  "Logging in as an attendee unlocks event participation. We claim our expo pass with a single click, receiving an instant confirmation. When registering for conference keynotes, the system checks for scheduling collisions and provides non-blocking overlap warnings. In My Schedule, attendees have a personalized itinerary tracking registered passes and bookmarked sessions."

#### Scene 4: Exhibitor Application & Booth Reservation (2:50 - 4:15)
- Visual: Log out. Log in as an exhibitor (bushbabe@demo.com). Open /exhibitor/expos. Click Apply for Expo. Attach a sample PDF document and submit. Open /exhibitor/applications to view pending state.
- Narration:
  "Switching to an exhibitor account, commercial partners can register for upcoming expos. The application modal accepts compliance paperwork with strict MIME type and file size validation. Applications are logged in pending status until reviewed by administrators."

#### Scene 5: Real-Time Multi-Window Synchronization (4:15 - 5:30)
- Visual: Arrange two browser windows side-by-side:
  - Left Window: Admin logged into /admin/applications and /admin/expos/:id/sessions.
  - Right Window: Attendee viewing the expo schedule at http://localhost:5173/expos/:id.
  - Left Window: Admin approves an application, then edits a keynote session title to include "[LIVE UPDATED]".
  - Right Window: Observe the session title in the attendee window update immediately without page refresh.
  - Left Window: Admin assigns an exhibitor to Booth A4.
  - Right Window: Observe Booth A4 on the floor plan transition from green (available) to red (booked) in real time.
- Narration:
  "Here we demonstrate EventSphere's real-time synchronization over WebSockets. In the left window, the organizer updates a keynote title. Instantly, without refreshing the browser on the right, the attendee's timetable updates. Next, the organizer allocates an available booth space. Connected clients immediately see the floor plan reflect the new booking status."

#### Scene 6: Admin Operations, Analytics & Feedback (5:30 - 6:30)
- Visual: Expand Admin window. Open /admin/analytics. Highlight the four metric cards, the attendance bar chart, and the floor plan occupancy donut chart. Open /admin/feedback to view user feedback logs.
- Narration:
  "The administrator console provides oversight of the entire ecosystem. The analytics dashboard compiles floor occupancy rates, attendee reach, and session engagement through interactive charts. Organizers can also monitor user feedback logs and dispatch direct messages to any registered user."

#### Scene 7: Mobile Responsiveness & Conclusion (6:30 - 7:00)
- Visual: Open browser developer tools and toggle Device Toolbar (iPhone 14 / 375 px width). Click the Menu button to reveal the mobile navigation drawer. Close drawer and scroll smoothly through card layouts.
- Narration:
  "EventSphere is responsive across mobile, tablet, and desktop viewports, ensuring attendees can navigate venues directly from handheld devices. This concludes the EventSphere demonstration. Source code and documentation are available in the project repository."
