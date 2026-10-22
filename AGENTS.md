# Agent Guidelines - jz_driving

Driving school management platform (Node.js, Express 5, Mongoose, Joi, JWT; React 19 frontend).

## Folder Map
- `backend/config`: DB connection (`db.js`)
- `backend/controllers`: Request handlers (auth, booking, course, document, notification, payment, review)
- `backend/models`: Mongoose schemas (User, Course, Booking, Payment, Document, Review, Notification)
- `backend/routes`: Express route definitions with auth/admin middleware
- `backend/validators`: Joi request validation schemas
- `backend/middleware`: Auth token verification (`authMiddleware.js`), error handler (`errorMiddleware.js`)
- `backend/docs`: Swagger spec (`api-spec.json`) and API notes
- `frontend/`: React 19 + Vite web client (do not touch until frontend phase)
- `docs/`: Architecture, API summary, and status logs

## Commands (Backend)
- `npm run dev`: Start backend with nodemon (`index.js`) on `PORT` (default 5000)
- `npm start`: Start backend with node
- `npm run seed`: Run safe seed script (`scripts/seed.js`)
- `npm test`: Run test suite

## Environment Variables (`backend/.env`)
- `PORT`: HTTP port (e.g., 5000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing/verification
- `NODE_ENV`: Runtime mode (`development` / `production`)
- `CLIENT_URL`: Allowed CORS origin for frontend (default: `http://localhost:5173`)

## Roles & Auth Rules
- `customer`: Can book courses, view/cancel own bookings, upload documents, review instructors.
- `instructor`: Can view assigned lessons, manage profile/availability (requires admin approval).
- `admin`: Full access; can manage courses, approve instructors, review documents, view all bookings.
- Auth Header: `Authorization: Bearer <token>` signed with `JWT_SECRET` (expires in 30 days).

## Validation & Error Handling
- Joi schemas validate incoming body/params; on failure return `400 Bad Request` with `message`.
- Unhandled errors handled by `errorMiddleware`: return `500 Internal Server Error`. Stack trace only in `development`.
- Protected routes without or with invalid token return `401 Unauthorized`.
- Forbidden role access returns `403 Forbidden`.

## Rules for Agents
- Backend-only until instructed. Never run destructive DB commands without explicit confirmation.
- Inspect only files needed to edit; keep edits minimal, preserving working code and API conventions.
- Never log, commit, or print passwords, secrets, or `.env` file contents.
- Complete one step at a time, update `docs/STATUS.md`, and stop for user approval.
