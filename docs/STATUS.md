# Project Status — `jz_driving`

## Current Stage
* **Active Phase**: **Frontend Phase 2 — Core Features** (Part 4: Role-Based Dashboards Completed)
* **Backend Status**: **Fully Verified & Operational** (Running on port 5000)
* **Frontend Status**: **Authentication & Routing Operational** (React 19 + Vite + react-router-dom)

---

## 1. System & Architecture Overview
* **Repository Root**: `/home/jyoti/Desktop/jz_driving`
* **Backend**: Node.js (`v22.23.2`), Express 5 (`5.1.0`), Mongoose (`8.19.1`), Joi (`18.0.1`), JWT (`9.0.2`), bcryptjs (`3.0.2`), Winston (`3.18.3`), Swagger UI (`5.0.1`).
* **Active Security & Utility Packages**: `cors`, `helmet`, `express-rate-limit`, `multer`.
* **Database**: MongoDB connected and operational.
* **Frontend**: React 19 (`^19.1.1`), `react-router-dom` (`^7.18.4`), `lucide-react` (`^1.61.0`), Vanilla CSS design system.
* **Mobile App**: To be bootstrapped in subsequent phase.

---

## 2. Seven Core Collections & Schemas Status
| Collection | Model Path | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Users** | `backend/models/userModel.js` | Verified | Seeded with 5 users. Passwords hashed; `toJSON` automatically strips passwords across all responses. |
| **Courses** | `backend/models/courseModel.js` | Verified | 4 active courses seeded with valid instructor references. |
| **Bookings** | `backend/models/bookingModel.js` | Verified | Status transitions restricted to assigned instructor/admin; cancellations restricted to booking owner/admin. |
| **Payments** | `backend/models/paymentModel.js` | Verified | Payment creation successfully updates `Booking.paymentStatus = 'paid'`. eSewa/Khalti TODO logged. |
| **Documents** | `backend/models/documentModel.js` | Verified | Multer file upload (JPG/PNG/PDF, max 5MB) verified; static serving at `/uploads` verified. |
| **Reviews** | `backend/models/reviewModel.js` | Stable | Instructor reviews model active. |
| **Notifications**| `backend/models/notificationModel.js`| Verified | Ownership verified; `markAsRead` successfully updates `isRead = true`. |

---

## 3. Progress Tracking

### Step 0: Documentation (Completed)
- [x] Create root `/AGENTS.md` (under 60 lines with rules, commands, stack, roles, env vars).
- [x] Create `/docs/API_SUMMARY.md` documenting all endpoints derived from route files.
- [x] Create `/docs/STATUS.md` tracking active progress and roadmap.

### Step 1: Backend Fixes (Completed & Verified)
- [x] 1. Configure CORS for `http://localhost:5173`, overridable via `CLIENT_URL`.
- [x] 2. Create `backend/.env.example` with `PORT`, `MONGO_URI`, `JWT_SECRET`, `NODE_ENV`, `CLIENT_URL` (without overwriting `.env`).
- [x] 3. Fix unhandled error handling in `errorMiddleware.js` (return HTTP 500, not 200; hide stack in production).
- [x] 4. Enforce booking status permissions: only assigned instructor or admin can update status; customers cancel via `/cancel`; return 403 on violation.
- [x] 5. Fix notifications: validate only `:id` parameter, verify ownership, set `isRead = true`.
- [x] 6. Implement admin-only `PUT /api/auth/approve-instructor/:id` (set `isApproved = true`, return user without password).
- [x] 7. Update `paymentController.js` to update booking `paymentStatus` to `paid` upon payment creation (add eSewa/Khalti TODO).
- [x] 8. Enable `helmet` and add rate-limiting for login/register (10 requests per 15 minutes).
- [x] 9. Configure Multer file uploads (`backend/uploads`, max 5 MB, JPG/PNG/PDF), serve statically at `/uploads`, ignore uploads in `.gitignore`.
- [x] 10. Ensure all user responses exclude password fields.

### Step 2: Seed Data (Completed & Syntax-Verified)
- [x] Create `backend/scripts/seed.js` with safe reruns (cleans up only seed-matching emails, titles, and IDs).
- [x] Add `"seed": "node scripts/seed.js"` to `backend/package.json`.
- [x] Seed data specification: 1 admin, 2 approved instructors, 2 customers, 4 courses, 3 bookings.
- [x] Passwords hashed with bcrypt; credentials printed cleanly on execution.

### Step 3: Verification (Completed)
- [x] Verify `.env` exists and contains required keys without printing secrets.
- [x] Verify cleanup logic in seed script does not touch non-seed records.
- [x] Run `npm run seed` once (5 users, 4 courses, 3 bookings created).
- [x] Start backend dev server (`npm run dev`) and verify MongoDB connection.
- [x] Verify `/api-docs` Swagger UI endpoint.
- [x] Execute targeted curl API tests covering auth, roles, authorization gaps, and errors.
- [x] Audit npm vulnerabilities using `npm audit` without applying destructive automatic fixes.

### Frontend Phase 1: Foundation Setup (Completed)
- [x] Part 1: Install core dependencies (`react-router-dom`, `lucide-react`) and verify Vite/Rolldown build.
- [x] Part 2: Configure environment (`.env`), native fetch API client (`services/api.js`), and session `AuthContext.jsx`.
- [x] Part 3: Implement Vanilla CSS design system, responsive `Navbar`, `Footer`, `Layout`, role-based route guards (`ProtectedRoute`, `PublicOnlyRoute`), and `App.jsx` routing skeleton with clean placeholders.

### Frontend Phase 2: Core Feature Implementation
- [x] **Part 1: Functional Login & Registration (Completed)**
  - Connected `/login` to `POST /api/auth/login`: client validation, disabled state during submission, backend error alerts, and destination/role redirect.
  - Connected `/register` to `POST /api/auth/register`: student/instructor role selection, conditional instructor fields (experience, specialization, availability), 10-digit phone enforcement, password match checks, and pending instructor approval notice.
  - Form design system: responsive accessible forms, keyboard accessibility (`aria-invalid`, `aria-describedby`), loading spinners.
  - Security: passwords never stored in local storage or state past submission, token persistence, zero backend modifications.
- [x] **Part 2: Real Course Catalog (Completed)**
  - Connected `/courses` to `GET /api/courses` via native API client (`services/api.js`).
  - Displays real course cards showing title, description, duration in hours, price in NPR, assigned instructor name and email, and status badge (`active`, `inactive`, `draft`).
  - Implemented loading state with animated spinner, error state with alert banner and retry button, empty catalog state with reload action, and filtered empty state with reset filter action.
  - Added responsive toolbar with client-side text search (by title, description, instructor) and status dropdown filtering.
  - Publicly accessible without login; booking preserved for Part 3; zero backend modifications.
- [x] **Part 3: Course Booking Flow & Scheduling (Completed)**
  - Connected course cards to `POST /api/bookings` via `services/api.js`.
  - Added "Book Course" action button to active courses for customer and guest users; instructors and admins receive informative read-only role badges.
  - Implemented unauthenticated redirection flow to `/login` preserving intended destination and selected course ID (`location.state.bookingCourseId`), automatically reopening the booking modal post-authentication.
  - Implemented accessible modal dialog (`role="dialog"`, `aria-modal="true"`, Escape key dismissal, backdrop dismiss).
  - Included course summary, calendar date selector with `min` set to today's date, time slot selection, duplicate submission prevention (`isSubmittingBooking`), and real-time backend error handling.
  - Implemented confirmed booking success view with booking details, pending approval badge, and direct navigation to `/dashboard`.
  - Kept instructor and admin permissions unchanged; zero backend modifications.
- [x] **Part 4: Role-Based Dashboards (Customer, Instructor, Admin) (Completed)**
  - **Customer Dashboard (`/dashboard`)**:
    - Connected to `GET /api/bookings` and `GET /api/notifications` via native API client.
    - Displays customer bookings with course title, assigned instructor, date, time slot, booking status, and payment status.
    - Implemented cancel booking action calling `PUT /api/bookings/:id/cancel` with confirmation and loading spinner.
    - Included stats row (Total Bookings, Active Lessons, Completed, Unread Alerts), recent notifications, quick action navigation, loading spinner, error alert with retry button, and empty state.
  - **Instructor Dashboard (`/instructor/dashboard`)**:
    - Connected to `GET /api/bookings` (filtered automatically by backend to assigned instructor).
    - Shows assigned lessons with student details (name, email), date, time slot, and booking status badge.
    - Implemented inline booking status updates calling `PUT /api/bookings/:id/status` (`pending`, `confirmed`, `completed`, `cancelled`) with per-lesson loading state and success/error feedback.
    - Included instructor stats row (Total Lessons, Active, Completed, Students count), loading spinner, error alert with retry button, and empty state.
  - **Admin Dashboard (`/admin/dashboard`)**:
    - Connected to `GET /api/bookings` (returns all bookings system-wide) and `GET /api/courses`.
    - Features tabbed navigation: Overview, All Bookings, Courses, Instructor Approvals, Document Reviews.
    - System overview with metrics, booking breakdown visual bars, and quick action cards.
    - Full booking management with status filtering (`all`, `pending`, `confirmed`, `completed`, `cancelled`) and inline status update via `PUT /api/bookings/:id/status`.
    - Instructor approvals via `PUT /api/auth/approve-instructor/:id` with ID input, loading spinner, validation, success feedback, and convenient helper list of known instructors from active records.
    - Document review via `PUT /api/documents/:id/review` with ID input, status selection (`approved` / `rejected`), loading spinner, and success feedback.
    - Transparent in-UI documentation of backend capabilities (noting that `GET /api/users` and `GET /api/documents` listing endpoints are not provided by the backend).
    - Verified with `npm run lint` and `npm run build` with zero errors.

---

## 4. Actual Endpoint Test Results (Step 3)

| Test Case | Method | Endpoint / Condition | Expected HTTP | Actual HTTP | Result / Response Details |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Swagger UI Documentation** | `GET` | `/api-docs/` | `200` | **200** | Swagger interface rendered successfully. |
| **Customer Authentication** | `POST` | `/api/auth/login` (Customer credentials) | `200` | **200** | Returns token, user info; password omitted. |
| **Admin Authentication** | `POST` | `/api/auth/login` (Admin credentials) | `200` | **200** | Returns token, user info; password omitted. |
| **Instructor Authentication**| `POST` | `/api/auth/login` (Instructor credentials) | `200` | **200** | Returns token, user info; password omitted. |
| **Customer Booking Status Update** | `PUT` | `/api/bookings/:id/status` (Customer token) | `403` | **403** | `"Only assigned instructor or admin can update booking status"` |
| **Instructor Booking Status Update** | `PUT` | `/api/bookings/:id/status` (Assigned instructor) | `200` | **200** | Status successfully updated to `completed`. |
| **Unauthorized Notification Read** | `PUT` | `/api/notifications/:id/read` (Other user token) | `403` | **403** | `"Not authorized to update this notification"` |
| **Authorized Notification Read** | `PUT` | `/api/notifications/:id/read` (Owner token) | `200` | **200** | Status updated: `isRead: true`. |
| **Missing Auth Token** | `GET` | `/api/bookings` (No Authorization header) | `401` | **401** | `"No token provided"` |
| **Invalid Auth Token** | `GET` | `/api/bookings` (Malformed Bearer token) | `401` | **401** | `"Not authorized, token failed"` |
| **Customer accessing Admin Route** | `POST` | `/api/courses` (Customer token) | `403` | **403** | `"Admin access required"` |
| **Admin Instructor Approval** | `PUT` | `/api/auth/approve-instructor/:id` (Admin token) | `200` | **200** | `isApproved: true`; password omitted. |
| **Malformed ID Parameter** | `PUT` | `/api/auth/approve-instructor/invalid_id` | `400` | **400** | `"Invalid instructor ID"` |
| **Non-Existent Resource ID** | `PUT` | `/api/auth/approve-instructor/507f1f...` | `404` | **404** | `"Instructor not found"` |
| **Schema Validation Failure** | `POST` | `/api/courses` (Title too short) | `400` | **400** | `'"title" length must be at least 2 characters long'` |
| **Payment & Booking Sync** | `POST` | `/api/payments` (Valid payload) | `201` | **201** | Payment created; `Booking.paymentStatus` updated to `paid`. |
| **Multer Document Upload** | `POST` | `/api/documents/upload` (`multipart/form-data`) | `201` | **201** | Saved to `/uploads`; file served statically (`HTTP 200`). |
| **Rate Limiter Enforcement** | `POST` | `/api/auth/login` (>10 attempts in 15 min) | `429` | **429** | `"Too many authentication attempts, please try again after 15 minutes"` |

---

## 5. Security & NPM Vulnerability Audit Findings
* **Total Vulnerabilities**: 13 (1 critical, 10 high, 2 moderate)
  * **Critical (1)**: `proxy-addr` (transitive via Express) — GHSA-jqcg-44mw-7w3h (IP spoofing via IPv4-mapped IPv6 trust subnet).
  * **High (10)**:
    * `path-to-regexp` (via Express) — ReDoS via sequential optional groups and multiple wildcards.
    * `mongoose` (direct) — Prototype pollution in schema update casting (`GHSA-wpg9-53fq-2r8h`).
    * `picomatch` / `chokidar` (via nodemon in devDependencies) — ReDoS and method injection in glob matching.
  * **Moderate (2)**: `qs` (via Express) — DoS via arrayLimit bypass.
* **Recommendation**:
  * Do NOT run `npm audit fix --force` as it causes breaking major version changes across Express and Mongoose.
  * In production, fronting Node with NGINX or Cloudflare mitigates the `proxy-addr` IP-spoofing and upstream ReDoS vectors without breaking dependencies.
