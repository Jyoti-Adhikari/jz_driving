# Project Status — `jz_driving`

## Current Stage
* **Active Step**: **Step 3 — Verification** (Completed)
* **Backend Status**: **Fully Verified & Operational**
* **Next Phase**: Website Frontend / Android Mobile App (Awaiting user instructions)

---

## 1. System & Architecture Overview
* **Repository Root**: `/home/jyoti/Desktop/jz_driving`
* **Backend**: Node.js (`v22.23.2`), Express 5 (`5.1.0`), Mongoose (`8.19.1`), Joi (`18.0.1`), JWT (`9.0.2`), bcryptjs (`3.0.2`), Winston (`3.18.3`), Swagger UI (`5.0.1`).
* **Active Security & Utility Packages**: `cors`, `helmet`, `express-rate-limit`, `multer`.
* **Database**: MongoDB connected and operational.
* **Frontend**: React 19 + Vite (on hold until next phase).
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
