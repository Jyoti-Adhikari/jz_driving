# API Summary — `jz_driving`

> **Note**: This reference is derived directly from the backend route files (`backend/routes/*.js`), their corresponding controllers, and middleware, rather than static swagger documentation.

Base URL (local development): `http://localhost:5000/api`

---

## 1. Authentication & Users (`routes/authRoutes.js`)

| Method | Endpoint | Auth / Roles | Request Body / Params | Expected Response | Description & Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | **Public** | `{ name, email, phone, password, role, address: { city, country }, profile? }` | `201 Created` `{ _id, name, email, role, token }` | Registers user. Password hashed with bcrypt. Profile required if `role: "instructor"` (`isApproved` set to false). Password excluded in response. |
| `POST` | `/auth/login` | **Public** | `{ email, password }` | `200 OK` `{ _id, name, email, role, token }` | Authenticates credentials; returns Bearer JWT. Password excluded. |
| `PUT` | `/auth/profile` | **Protected** (Bearer token) | `{ name?, phone?, address?, profile? }` | `200 OK` `{ _id, name, email, role }` | Updates logged-in user's profile details. Excludes password. |
| `PUT` | `/auth/approve-instructor/:id` | **Protected** (`admin` only) | Param: `id` (User ID) | `200 OK` (Updated user) | Approves an instructor account (`isApproved: true`). Excludes password. |

---

## 2. Courses (`routes/courseRoutes.js`)

| Method | Endpoint | Auth / Roles | Request Body / Params | Expected Response | Description & Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/courses` | **Protected** (`admin` only) | `{ title, description, durationHours, price, instructorId, status? }` | `201 Created` (Course object) | Creates a new driving course. |
| `GET` | `/courses` | **Public** | None | `200 OK` `[ Course objects ]` | Fetches all available courses, populating instructor name and email. |
| `PUT` | `/courses/:id` | **Protected** (`admin` only) | Param: `id`, Body: partial course fields (`title`, `price`, `status`, etc.) | `200 OK` (Updated Course object) | Updates course details. At least one field required. |
| `DELETE` | `/courses/:id` | **Protected** (`admin` only) | Param: `id` | `200 OK` `{ message: "Course removed" }` | Deletes course by ID via `findByIdAndDelete`. |

---

## 3. Bookings (`routes/bookingRoutes.js`)

| Method | Endpoint | Auth / Roles | Request Body / Params | Expected Response | Description & Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/bookings` | **Protected** (Customer/User) | `{ courseId, instructorId, schedule: { date, timeSlot } }` | `201 Created` (Booking object) | Creates a booking under `req.user._id` and sends an in-app notification. |
| `GET` | `/bookings` | **Protected** (Any authenticated) | None | `200 OK` `[ Booking objects ]` | Fetches bookings for `req.user._id`, populating course title and instructor info. |
| `PUT` | `/bookings/:id/status` | **Protected** (Assigned Instructor or Admin only) | Param: `id`, Body: `{ status: "pending"\|"confirmed"\|"completed"\|"cancelled" }` | `200 OK` (Updated Booking object) | Updates booking status and sends notification. Restricted to assigned instructor or admin (returns 403 otherwise). |
| `PUT` | `/bookings/:id/cancel` | **Protected** (Customer / Owner) | Param: `id` | `200 OK` (Updated Booking object) | Cancels booking (`status: "cancelled"`). Enforces customer ownership. |

---

## 4. Payments (`routes/paymentRoutes.js`)

| Method | Endpoint | Auth / Roles | Request Body / Params | Expected Response | Description & Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/payments` | **Protected** (Authenticated) | `{ bookingId, amount, method: "stripe"\|"cash"\|"esewa", transactionId }` | `201 Created` (Payment object) | Mock payment processing. Updates associated booking's `paymentStatus` to `paid`. *(TODO: real eSewa/Khalti integration)*. |
| `GET` | `/payments/:id` | **Protected** (Authenticated) | Param: `id` | `200 OK` (Payment object) | Retrieves payment status populated with user and booking details. |

---

## 5. Documents (`routes/documentRoutes.js`)

| Method | Endpoint | Auth / Roles | Request Body / Params | Expected Response | Description & Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/documents/upload` | **Protected** (Authenticated) | `multipart/form-data` with file or JSON `{ type, fileUrl }` | `201 Created` (Document object) | Uploads verification document (`citizenship`, `license`, `passport`). Multer handles JPG, PNG, PDF up to 5 MB; static serving via `/uploads`. |
| `PUT` | `/documents/:id/review` | **Protected** (`admin` only) | Param: `id`, Body: `{ status: "pending"\|"approved"\|"rejected" }` | `200 OK` (Updated Document object) | Admin approves or rejects a user verification document. Records `reviewedBy`. |

---

## 6. Notifications (`routes/notificationRoutes.js`)

| Method | Endpoint | Auth / Roles | Request Body / Params | Expected Response | Description & Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/notifications` | **Protected** (Authenticated) | None | `200 OK` `[ Notification objects ]` | Fetches notifications belonging to `req.user._id`, ordered newest first. |
| `PUT` | `/notifications/:id/read` | **Protected** (Owner only) | Param: `id` | `200 OK` (Updated Notification object) | Marks notification as read (`isRead = true`). Validates `:id` param and enforces user ownership. |

---

## 7. Reviews (`routes/reviewRoutes.js`)

| Method | Endpoint | Auth / Roles | Request Body / Params | Expected Response | Description & Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/reviews` | **Protected** (Customer/User) | `{ instructorId, courseId, rating (1-5), comment? }` | `201 Created` (Review object) | Creates a rating/review for an instructor. |
| `GET` | `/reviews/instructor/:id` | **Protected** (Authenticated) | Param: `id` (Instructor User ID) | `200 OK` `[ Review objects ]` | Fetches all reviews for the specified instructor, populating reviewer name. |

---

## Common Headers & Response Formats

* **Protected Requests**:
  ```http
  Authorization: Bearer <jwt_token>
  Content-Type: application/json
  ```
* **Validation Error (`400 Bad Request`)**:
  ```json
  { "message": "<Validation error description>" }
  ```
* **Authentication Error (`401 Unauthorized`)**:
  ```json
  { "message": "Not authorized, token failed" }
  ```
* **Authorization Error (`403 Forbidden`)**:
  ```json
  { "message": "Admin access required" }
  ```
* **Rate Limit Error (`429 Too Many Requests`)**:
  ```json
  { "message": "Too many authentication attempts, please try again after 15 minutes" }
  ```
* **Server Error (`500 Internal Server Error`)**:
  ```json
  { "message": "<Error message>", "stack": "<Stack trace only if NODE_ENV=development>" }
  ```
