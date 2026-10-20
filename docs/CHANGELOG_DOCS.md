# Documentation Change Log

## `docs/DEVELOPER_GUIDE.md`

- Corrected the package table to use declared package version ranges and removed the unsupported Node.js/npm minimum-version claims.
- Updated the actual folder layout and repository architecture; retained the flat backend structure and removed any implication of a backend service layer.
- Corrected environment-variable behavior, including the required `MONGO_URI`, CORS-only `CLIENT_URL`, unused `DEMO_MODE`, and lack of a default database URI.
- Documented reset-link behavior from the implementation: no email delivery, reset tokens expire after 15 minutes, links are returned/logged without a `DEMO_MODE` check, JWT lifetime is seven days, bcrypt cost is 10, and minimum password length is six.
- Added the Expo capacity field, Session capacity field and enforcement, and the explicit nine-model list; clarified that exhibitor accounts are Users with company fields.
- Added Visitor to the role-permission summary and documented UC1-UC23 as guide-local pending SRS confirmation.
- Corrected route/event descriptions, verified the notification event name as `notification`, and noted that the client does not subscribe to `expo:updated`.
- Corrected upload-validation details and narrowed security claims to controls present in the code.
- Added honest privacy, performance, compatibility, accessibility, load-testing, penetration-testing, and documentation statuses; recorded the analytics limitations and implemented auth rate limiter.

## `docs/USER_GUIDE.md`

- Corrected password-recovery instructions to match the response and display behavior; clarified that no email is sent and `DEMO_MODE` is not enforced.
- Added local start/seed instructions, with the demo seed run from `server/` and a warning that it recreates demo data.
- Corrected document and image upload type lists and added exhibitor-to-exhibitor messaging.
- Added Admin Dashboard, expo edit/delete, and admin inbox tutorials, while retaining the existing screenshot tags 01-24.
- Added new screenshot tags 25-29 for the landing page, admin dashboard, exhibitor peer messaging, admin messages, and expo edit/delete.
- Corrected the analytics chart explanation to distinguish database counts from simulated/fallback values and removed claims of booth-traffic or session-popularity metrics.
- Corrected Socket.IO event names and documented that the notification page component is not currently routed.
- Reworded cross-browser and accessibility statements to say verification is pending rather than claiming browser coverage or a WCAG level.

## `docs/TEST_CASES.md`

- Corrected the case count from 64 to 83: 73 existing cases plus 10 planned gap-verification cases.
- Added a `Req.` column to every case. Since the SRS PDF was unavailable, unverified mappings are explicitly marked rather than assigned invented FR/NFR IDs.
- Added planned cases for browser coverage, performance, concurrent users, backup/restore, exhibitor peer messaging, Admin expo editing, landing page, missing/invalid/expired JWT, reminder timing/duplicate checks, and privacy/consent.
- Preserved the Actual Result and Status columns; original entries remain `To be filled`, and new cases are `Planned`.
- Corrected the password-reset case and analytics expectation to match current behavior.
- Clarified that `seed:demo` runs from `server/` and clears/recreates demo data.

## `docs/SCREENSHOT_CHECKLIST.md`

- Preserved screenshots 01-24 and added rows 25-29 for the landing page, admin dashboard, exhibitor peer messaging, admin inbox, and expo edit/delete.
- Rows describe capture requirements; no screenshot files were available in `docs/screenshots/`.

## `docs/DEMO_VIDEO_SCRIPT.md`

- Rebalanced the script into eight scenes with a total duration of 7:00.
- Added registration, reset-link recovery, expo creation/booth generation, edit/delete, exhibitor booth reservation and roster, profile/logo, attendee-exhibitor messaging, reminder, feedback, analytics limitations, role guards, and responsive layout.
- Corrected the booth-reservation scene to show an actual reservation.
- Removed unsupported session-engagement claims and documented the server-folder seed command and destructive seed behavior.

## `docs/screenshots/.gitkeep`

- Updated the directory comment from 24 to 29 planned screenshots.

## `docs/GAP_REPORT.md`

- Added code-evidence statuses, recommended actions, unverified documentation items, and owner decisions. The source SRS PDF and original Word document were unavailable, so exact SRS mapping and the Word v2 deliverable remain blocked.

## `MERN_EventSphere_Management_Documentation_Themed.docx`

- Not changed: the requested source Word file was not present in the workspace. No v2 `.docx` was created because preserving its theme, styles, diagrams, captions, TOC, lists, and field codes was not possible without the original.
