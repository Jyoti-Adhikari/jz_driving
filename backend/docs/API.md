jz_driving API Documentation
Overview

This API serves the backend for the jz_driving MERN application, managing user authentication, course management, bookings, payments, reviews, documents, and notifications.

Base URL (Development): http://localhost:5000/api/

Authentication

Token: Use a Bearer token obtained from /api/auth/login or /api/auth/register for protected endpoints.

How to Get Token: Send a POST request with email and password to /api/auth/login.

Register User

URL: /api/auth/register

Method: POST

Body:

{
  "name": "string",
  "email": "string",
  "phone": "string",
  "password": "string",
  "role": "customer|instructor|admin",
  "address": {
    "city": "string",
    "country": "string"
  },
  "profile": {
    "experience": number,
    "specialization": "string",
    "availability": ["string"]
  }
}


Response: 201

{ "_id", "name", "email", "role", "token" }


Auth: None

Error: 400 if validation fails (e.g., "Phone number must be 10 digits")

Login User

URL: /api/auth/login

Method: POST

Body:

{
  "email": "string",
  "password": "string"
}


Response: 200

{ "_id", "name", "email", "role", "token" }


Auth: None

Error: 400 if validation fails (e.g., "Invalid email format")

Course Endpoints
Create Course (Admin Only)

URL: /api/courses

Method: POST

Body:

{
  "title": "string",
  "description": "string",
  "durationHours": number,
  "price": number,
  "instructorId": "string"
}


Response: 201 with course object

Auth: Required, Admin role

Error: 400 if validation fails

Get All Courses

URL: /api/courses

Method: GET

Response: 200 with array of courses

Auth: None

Update Course (Admin Only)

URL: /api/courses/:id

Method: PUT

Body (Partial course data, at least one field required):

{
  "title": "string",
  "description": "string",
  "durationHours": number,
  "price": number,
  "instructorId": "string",
  "status": "active|inactive|draft"
}


Response: 200 with updated course

Auth: Required, Admin role

Error: 400 if validation fails or no fields provided

Delete Course (Admin Only)

URL: /api/courses/:id

Method: DELETE

Response: 200

{ "message": "Course removed" }


Auth: Required, Admin role

Booking Endpoints
Create Booking

URL: /api/bookings

Method: POST

Body:

{
  "courseId": "string",
  "instructorId": "string",
  "schedule": {
    "date": "YYYY-MM-DD",
    "timeSlot": "string"
  }
}


Response: 201 with booking object

Auth: Required

Error: 400 if validation fails

Get User Bookings

URL: /api/bookings

Method: GET

Response: 200 with array of bookings

Auth: Required

Update Booking Status

URL: /api/bookings/:id/status

Method: PUT

Body:

{
  "status": "pending|confirmed|completed|cancelled"
}


Response: 200 with updated booking

Auth: Required (Admin/Instructor role TBD)

Error: 400 if validation fails

Cancel Booking

URL: /api/bookings/:id/cancel

Method: PUT

Response: 200 with updated booking

Auth: Required

Payment Endpoints
Process Payment

URL: /api/payments

Method: POST

Body:

{
  "bookingId": "string",
  "amount": number,
  "method": "stripe|cash|esewa",
  "transactionId": "string"
}


Response: 201 with payment object

Auth: Required

Note: Payment processing is placeholder; integrate Stripe/eSewa later

Error: 400 if validation fails

Get Payment Status

URL: /api/payments/:id

Method: GET

Response: 200 with payment object

Auth: Required

Review Endpoints
Submit Review

URL: /api/reviews

Method: POST

Body:

{
  "instructorId": "string",
  "courseId": "string",
  "rating": number,
  "comment": "string"
}


Response: 201 with review object

Auth: Required

Error: 400 if validation fails

Get Reviews for Instructor

URL: /api/reviews/instructor/:id

Method: GET

Response: 200 with array of reviews

Auth: Required

Document Endpoints
Upload Document

URL: /api/documents/upload

Method: POST

Body:

{
  "type": "citizenship|license|passport",
  "fileUrl": "string"
}


Response: 201 with document object

Auth: Required

Note: fileUrl is a placeholder; integrate multer for file uploads

Error: 400 if validation fails

Review Document (Admin Only)

URL: /api/documents/:id/review

Method: PUT

Body:

{
  "status": "pending|approved|rejected"
}


Response: 200 with updated document

Auth: Required, Admin role

Error: 400 if validation fails

Notification Endpoints
Get Notifications

URL: /api/notifications

Method: GET

Response: 200 with array of notifications

Auth: Required

Mark Notification as Read

URL: /api/notifications/:id/read

Method: PUT

Response: 200 with updated notification

Auth: Required

Note: Currently validates hardcoded isRead: true; consider accepting { "isRead": true } in body if dynamic updates are added