# EventSphere Management - Documentation and SRS Gap Report

## Evidence Scope

The application source and the supplied Markdown documentation were inspected. The named Aptech SRS file `MERN-EventSphere_Management.pdf` and the original `MERN_EventSphere_Management_Documentation_Themed.docx` were not present in the workspace. Therefore, only requirement IDs explicitly supplied in the task can be quoted; all other SRS identifiers and exact requirement wording remain unverified.

The statuses below describe evidence in the current code, not test execution or certification.

## Requirements and Implementation Gaps

| Requirement ID / topic | Status | Code evidence | Recommended action |
| :--- | :--- | :--- | :--- |
| FR-ANA-01: booth-traffic and session-popularity analytics | Not implemented | `server/controllers/analyticsController.js`; `client/src/pages/admin/AdminAnalytics.jsx` | Add data collection and measured traffic/popularity calculations if these metrics are required. Replace fixed attendance proportions and zero-count booth fallbacks with clearly sourced values. |
| NFR-PRV-01/02: GDPR and consent (IDs supplied by the requester; individual wording unavailable) | Not implemented | `server/models/User.js`; `client/src/pages/Register.jsx`; `client/src/App.jsx`; no export/deletion route in `server/routes/` | Confirm exact SRS wording. Add a privacy notice and consent capture/record if required, and implement the required data rights workflows. |
| NFR-DOC-03: complete system demonstration (ID supplied by the requester; exact wording unavailable) | Partial | `docs/DEMO_VIDEO_SCRIPT.md`; application routes in `client/src/App.jsx` | Record and review the planned demonstration against the SRS after preparing a dedicated seeded database. The script has not been recorded or verified. |
| Performance response target (SRS ID unavailable) | Partial | `server/models/Booth.js`; `server/models/Session.js`; `server/models/Message.js`; `docs/TEST_CASES.md` | Benchmark representative endpoints against the exact SRS target and record environment, dataset, and measurements. Existing indexes alone do not prove a 1-2 second response target. |
| Concurrent-user load testing (SRS ID unavailable) | Not implemented | `tests/`; `docs/TEST_CASES.md` | Define the SRS user profile, run a controlled load test, and retain results. |
| Penetration testing (SRS ID unavailable) | Not implemented | `server/middleware/authMiddleware.js`; `server/server.js`; no penetration-test report was available | Arrange authorized penetration testing and record scope, date, findings, and retest evidence. |
| Backup and restore verification (SRS ID unavailable) | Not implemented | `server/scripts/dropOldRegistrationIndexes.js`; no backup/restore implementation or test result was identified | Select a backup owner and mechanism, document retention and restore procedures, and test restoration into an isolated database. |
| Cross-browser compatibility verification (SRS ID unavailable) | Partial | Responsive client source in `client/src/`; `docs/TEST_CASES.md` | Execute the planned Chrome, Firefox, Edge, and Safari cases and record versions/results. No cross-browser test evidence is included. |
| Accessibility / WCAG verification (SRS ID unavailable) | Partial | `client/src/context/ToastContext.jsx`; `client/src/index.css`; `docs/TEST_CASES.md` | Perform keyboard, assistive-technology, and contrast checks against the SRS's stated accessibility target. No WCAG conformance level is asserted. |
| Password-reset email delivery (SRS ID unavailable) | Not implemented | `server/controllers/authController.js`; `server/models/User.js` | Add an email delivery provider if the SRS requires emailed links. Keep reset-link disclosure in a controlled demo-only path; current code returns and logs a link for known accounts without checking `DEMO_MODE`. |
| Session-capacity enforcement (SRS ID unavailable) | Implemented | `server/models/Session.js`; `server/controllers/registrationController.js` | The schema defaults session capacity to 100 and registration rejects when the counted registrations meet the limit. Verify the exact SRS rules and assess atomicity under concurrent registrations; current count-then-create checks are not a transaction. |
| Expo-capacity enforcement (SRS ID unavailable) | Implemented | `server/models/Expo.js`; `server/controllers/registrationController.js` | The schema defaults expo capacity to 1,000 and the controller checks current registrations. Verify required capacity semantics and concurrent behavior against the SRS. |
| Authentication rate limiting (SRS ID unavailable) | Implemented | `server/server.js`; `server/package.json` | Keep the documentation: login, registration, and forgot-password routes have a limit of 20 requests per IP per 15 minutes. Test the behavior if required by the SRS. |
| Expo real-time client refresh (SRS ID unavailable) | Partial | `server/controllers/expoController.js`; client event listeners under `client/src/` | The server emits `expo:updated`, but no client listener was identified. Add listeners if live expo refresh is a required behavior, or describe the event as server-emitted only. |
| Full-page notifications (SRS ID unavailable) | Partial | `client/src/pages/Notifications.jsx`; `client/src/App.jsx` | The component exists but `/notifications` is not registered as a route. Keep the guide focused on the notification bell unless the page is wired into the app. |
| User data export and account deletion (SRS ID unavailable) | Not implemented | `server/routes/profileRoutes.js`; `server/controllers/profileController.js` | Implement the SRS-required data access/deletion endpoints if required; there is no such flow in the current profile routes. |
| Audit log (SRS ID unavailable) | Not implemented | `server/server.js`; no audit-log model or route identified | Implement an audit trail only if required; do not document it as an existing control. |

## Documentation Items Not Verifiable

- Exact SRS requirement IDs and wording, the functional-requirement total, and the SRS use-case numbering could not be independently checked without the source PDF.
- The requested Word document, its 16 diagrams, captions, page fields, TOC, List of Figures, and List of Tables could not be inspected or updated because the original `.docx` is absent. No v2 Word file was created.
- `docs/screenshots/` contains only `.gitkeep`; there are no screenshot images to validate or insert. Checklist rows remain capture instructions, not evidence of captured screens.
- No browser-compatibility, WCAG, load, performance, backup/restore, or penetration-test results were supplied. Test cases are specifications; their actual-result fields remain unfilled and added gap tests are marked Planned.
- The source contains a `Notifications.jsx` page component, but it is not routed. The documentation describes the available bell dropdown and notes the unrouted component.
- The `DEMO_MODE` variable appears in `server/.env.example`, but is not read by current application code. The current reset-link response and UI are not gated by it.
- FR-ANA-01 and NFR-PRV-01/02 labels were supplied by the requester. Their exact text and relationship to the SRS could not be checked.

## Decisions for the Project Owner

1. Provide the original SRS PDF so the requirement matrix, test Req. column, requirement counts, and use-case mappings can be made exact.
2. Provide the original Word document if the v2 deliverable must preserve its theme, styles, numbering, captions, diagrams, and field codes.
3. Decide whether consent/privacy controls, booth-traffic and session-popularity metrics, password-reset email, backup/restore, and audit logging are required for submission. These are not implemented.
4. Session and expo capacity checks are already implemented. Decide whether their current count-then-create behavior is sufficient or needs concurrency-safe enforcement.
5. Decide whether `DEMO_MODE` should actually gate reset-link disclosure. Its current name/example comment suggests gating, but runtime code does not implement it.
