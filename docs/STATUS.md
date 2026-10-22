# Project Status — `jz_driving`

## Current Stage
* **Active Step**: **Step 0 — Documentation** (Completed)
* **Next Step**: **Step 1 — Backend fixes** (Awaiting user approval)

---

## 1. System & Architecture Overview
* **Repository Root**: `/home/jyoti/Desktop/jz_driving`
* **Backend**: Node.js (`v22.23.2`), Express 5 (`5.1.0`), Mongoose (`8.19.1`), Joi (`18.0.1`), JWT (`9.0.2`), bcryptjs (`3.0.2`), Winston (`3.18.3`), Swagger UI (`5.0.1`).
* **Newly Added Packages**: `cors`, `helmet`, `express-rate-limit`, `multer`.
* **Frontend**: React 19 + Vite (untouched, on hold until backend completion).
* **Mobile App**: Not yet created (to be started after website/backend phases).

---

## 2. Seven Core Collections & Schemas Status
| Collection | Model Path | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Users** | `backend/models/userModel.js` | Stable | Roles: `customer`, `instructor`, `admin`. Pre-save hooks for timestamps. |
| **Courses** | `backend/models/courseModel.js` | Stable | Referenced by instructor `User`. |
| **Bookings** | `backend/models/bookingModel.js` | Needs Auth Rule | References `User` (student), `Course`, `User` (instructor). |
| **Payments** | `backend/models/paymentModel.js` | Needs Sync | Mocked payment records; needs sync to `Booking.paymentStatus`. |
| **Documents** | `backend/models/documentModel.js` | Needs Multer | Stored file URLs for citizen/license/passport; needs static upload handling. |
| **Reviews** | `backend/models/reviewModel.js` | Stable | Rating (1-5) and comments linked to instructor and course. |
| **Notifications**| `backend/models/notificationModel.js`| Bug in Controller | In-app alerts; `markAsRead` schema mismatch to be resolved in Step 1. |

---

## 3. Progress Tracking

### Step 0: Documentation (Completed)
- [x] Create root `/AGENTS.md` (under 60 lines with rules, commands, stack, roles, env vars).
- [x] Create `/docs/API_SUMMARY.md` documenting all endpoints derived from route files.
- [x] Create `/docs/STATUS.md` tracking active progress and roadmap.

### Step 1: Backend Fixes (Pending Approval)
- [ ] 1. Configure CORS for `http://localhost:5173`, overridable via `CLIENT_URL`.
- [ ] 2. Create `backend/.env.example` with `PORT`, `MONGO_URI`, `JWT_SECRET`, `NODE_ENV`, `CLIENT_URL` (without overwriting `.env`).
- [ ] 3. Fix unhandled error handling in `errorMiddleware.js` (return HTTP 500, not 200; hide stack in production).
- [ ] 4. Enforce booking status permissions: only assigned instructor or admin can update status; customers cancel via `/cancel`; return 403 on violation.
- [ ] 5. Fix notifications: validate only `:id` parameter, verify ownership, set `isRead = true`.
- [ ] 6. Implement admin-only `PUT /api/auth/approve-instructor/:id` (set `isApproved = true`, return user without password).
- [ ] 7. Update `paymentController.js` to update booking `paymentStatus` to `paid` upon payment creation (add eSewa/Khalti TODO).
- [ ] 8. Enable `helmet` and add rate-limiting for login/register (10 requests per 15 minutes).
- [ ] 9. Configure Multer file uploads (`backend/uploads`, max 5 MB, JPG/PNG/PDF), serve statically at `/uploads`, ignore uploads in `.gitignore`.
- [ ] 10. Ensure all user responses exclude password fields.

### Step 2: Seed Data (Upcoming)
- [ ] Create `backend/scripts/seed.js` and add `npm run seed`.
- [ ] Seed: 1 admin, 2 approved instructors, 2 customers, 4 courses, 3 bookings.
- [ ] Safe reruns: delete only explicit seed records; print test login credentials.

### Step 3: Verification (Upcoming)
- [ ] Verify `.env` without printing secrets.
- [ ] Test MongoDB connectivity & execute seed script.
- [ ] Start backend server and verify Swagger at `/api-docs`.
- [ ] Test auth and booking role-based permissions via `curl`.
- [ ] Audit npm vulnerabilities responsibly without breaking overrides.

---

## 4. Completed In This Turn
- Created [AGENTS.md](file:///home/jyoti/Desktop/jz_driving/AGENTS.md) (45 lines).
- Created [docs/API_SUMMARY.md](file:///home/jyoti/Desktop/jz_driving/docs/API_SUMMARY.md).
- Created [docs/STATUS.md](file:///home/jyoti/Desktop/jz_driving/docs/STATUS.md).
