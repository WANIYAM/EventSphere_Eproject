# EventSphere Management - Screenshot Checklist

This checklist enumerates every screenshot placeholder referenced across the project documentation. Capture each screen in 1920x1080 resolution (or responsive mobile width where specified) using the specified account and URL.

| # | File Name | Role to Log In As | Target URL | Required Elements & UI State |
| :---: | :--- | :--- | :--- | :--- |
| 01 | `01-user-registration.png` | Visitor (Unauthenticated) | `/register` | Registration form card displaying Attendee Pass and Exhibitor Booth role switcher. |
| 02 | `02-user-login.png` | Visitor (Unauthenticated) | `/login` | Login gateway displaying email/password inputs and the 1-click quick demo buttons. |
| 03 | `03-password-recovery.png` | Visitor (Unauthenticated) | `/forgot-password` | Password recovery screen showing the yellow Demo Mode Reset Link container. |
| 04 | `04-visitor-expos-directory.png` | Visitor (Unauthenticated) | `/expos` | Public expo directory with city filter buttons and cards with image banners. |
| 05 | `05-visitor-schedule-tab.png` | Visitor (Unauthenticated) | `/expos/:id` | Expo details page with Schedule tab active showing Login to register buttons. |
| 06 | `06-visitor-floorplan-tab.png` | Visitor (Unauthenticated) | `/expos/:id` | Floor Plan tab showing color-coded booth grid (Available, Reserved, Booked). |
| 07 | `07-visitor-contact-page.png` | Visitor (Unauthenticated) | `/contact` | Contact page showing organizer info and Log in to message the organizers button. |
| 08 | `08-attendee-expo-registered.png` | Attendee (`attendee1@demo.com`) | `/expos/:id` | Expo details hero banner displaying green Registration Confirmed badge and Cancel button. |
| 09 | `09-attendee-session-actions.png` | Attendee (`attendee1@demo.com`) | `/expos/:id` | Schedule tab showing + Register, Cancel, and Bookmarked toggles on session items. |
| 10 | `10-attendee-my-schedule.png` | Attendee (`attendee1@demo.com`) | `/schedule` | My Schedule personal timetable showing registered expos, sessions, and bookmarks. |
| 11 | `11-attendee-messaging.png` | Attendee (`attendee1@demo.com`) | `/messages` | Message composer with prefilled exhibitor recipient and dispatched message history. |
| 12 | `12-attendee-notification-bell.png` | Attendee (`attendee1@demo.com`) | `/expos` | Open notification bell dropdown showing 30-minute session reminders and unread badge. |
| 13 | `13-attendee-feedback-form.png` | Attendee (`attendee1@demo.com`) | `/feedback` | User feedback form with Category Type buttons (Suggestion vs Issue). |
| 14 | `14-exhibitor-apply-modal.png` | Exhibitor (`bushbabe@demo.com`) | `/exhibitor/expos` | Application modal with company prefill, products text area, and document file input. |
| 15 | `15-exhibitor-applications-list.png` | Exhibitor (`bushbabe@demo.com`) | `/exhibitor/applications` | Exhibitor applications table displaying Pending, Approved, and Rejected status badges. |
| 16 | `16-exhibitor-booth-reservation.png` | Exhibitor (`bushbabe@demo.com`) | `/exhibitor/booths` | Interactive floor plan with booth inspector open showing Reserve Booth Space button. |
| 17 | `17-exhibitor-staff-management.png` | Exhibitor (`bushbabe@demo.com`) | `/exhibitor/booths` | My Assigned Booth tab displaying showcase description and staff roster rows. |
| 18 | `18-exhibitor-profile-edit.png` | Exhibitor (`bushbabe@demo.com`) | `/exhibitor/profile` | Profile management page displaying company information fields and logo upload. |
| 19 | `19-admin-create-expo.png` | Admin (`admin@eventsphere.com`) | `/admin/expos` | Create Expo modal displaying dates, venue, booth generator counts, and image URL. |
| 20 | `20-admin-application-review.png` | Admin (`admin@eventsphere.com`) | `/admin/applications` | Applications review table with document download links, Approve, and Reject buttons. |
| 21 | `21-admin-booth-assignment.png` | Admin (`admin@eventsphere.com`) | `/admin/expos/:id/booths` | Admin floor plan manager with booth assignment drawer open. |
| 22 | `22-admin-session-scheduler.png` | Admin (`admin@eventsphere.com`) | `/admin/expos/:id/sessions` | Schedule builder form with room and time inputs and collision detection alerts. |
| 23 | `23-admin-analytics-dashboard.png` | Admin (`admin@eventsphere.com`) | `/admin/analytics` | Executive analytics view showing 4 metric cards, Recharts bar chart, and donut chart. |
| 24 | `24-admin-feedback-inbox.png` | Admin (`admin@eventsphere.com`) | `/admin/feedback` | Admin feedback log displaying categorized user suggestions and issues. |
