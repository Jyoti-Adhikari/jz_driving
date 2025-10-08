jz_driving API Documentation
Overview
This API serves the backend for the jz_driving MERN application, managing user authentication, course management, bookings, payments, reviews, documents, and notifications. It is currently running locally at http://localhost:5000/api/.
Base URL

Development: http://localhost:5000/api/

Authentication

Token: Use a Bearer token obtained from /api/auth/login or /api/auth/register for protected endpoints.
How to Get Token: Send a POST request with email and password to /api/auth/login.

Authentication Endpoints

Register User

URL: /api/auth/register
Method: POST
Body: { "name": "string", "email": "string", "phone": "string", "password": "string", "role": "customer|instructor|admin", "address": { "city": "string", "country": "string" }, "profile": { ... } }
Response: 201 with { "_id", "name", "email", "role", "token" }
Auth: None


Login User

URL: /api/auth/login
Method: POST
Body: { "email": "string", "password": "string" }
Response: 200 with { "_id", "name", "email", "role", "token" }
Auth: None



Course Endpoints

Create Course (Admin Only)

URL: /api/courses
Method: POST
Body: { "title": "string", "description": "string", "durationHours": number, "price": number, "instructorId": "string" }
Response: 201 with course object
Auth: Required, Admin role


Get All Courses

URL: /api/courses
Method: GET
Response: 200 with array of courses
Auth: None


Update Course (Admin Only)

URL: /api/courses/:id
Method: PUT
Body: Partial course data
Response: 200 with updated course
Auth: Required, Admin role


Delete Course (Admin Only)

URL: /api/courses/:id
Method: DELETE
Response: 200 with { "message": "Course removed" }
Auth: Required, Admin role



Booking Endpoints

Create Booking

URL: /api/bookings
Method: POST
Body: { "courseId": "string", "instructorId": "string", "schedule": { "date": "YYYY-MM-DD", "timeSlot": "string" } }
Response: 201 with booking object
Auth: Required


Get User Bookings

URL: /api/bookings
Method: GET
Response: 200 with array of bookings
Auth: Required


Update Booking Status

URL: /api/bookings/:id/status
Method: PUT
Body: { "status": "pending|confirmed|completed|cancelled" }
Response: 200 with updated booking
Auth: Required (Admin/Instructor role TBD)


Cancel Booking

URL: /api/bookings/:id/cancel
Method: PUT
Response: 200 with updated booking
Auth: Required



Payment Endpoints

Process Payment

URL: /api/payments
Method: POST
Body: { "bookingId": "string", "amount": number, "method": "stripe|cash|esewa", "transactionId": "string" }
Response: 201 with payment object
Auth: Required
Note: Payment processing is placeholder; integrate Stripe/eSewa later.


Get Payment Status

URL: /api/payments/:id
Method: GET
Response: 200 with payment object
Auth: Required



Review Endpoints

Submit Review

URL: /api/reviews
Method: POST
Body: { "instructorId": "string", "courseId": "string", "rating": number, "comment": "string" }
Response: 201 with review object
Auth: Required


Get Reviews for Instructor

URL: /api/reviews/instructor/:id
Method: GET
Response: 200 with array of reviews
Auth: Required



Document Endpoints

Upload Document

URL: /api/documents/upload
Method: POST
Body: { "type": "citizenship|license|passport", "fileUrl": "string" }
Response: 201 with document object
Auth: Required
Note: fileUrl is a placeholder; integrate multer for file uploads.


Review Document (Admin Only)

URL: /api/documents/:id/review
Method: PUT
Body: { "status": "pending|approved|rejected" }
Response: 200 with updated document
Auth: Required, Admin role



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



Notes

Authentication: Use Bearer token in the Authorization header for protected endpoints. Obtain token from /api/auth/login.
Local Development: URLs are for http://localhost:5000. They will change upon deployment.
Incomplete Features: 
File uploads (/api/documents/upload) require multer integration.
Payment processing (/api/payments) is a placeholder; integrate Stripe/eSewa.
Some endpoints lack role-specific authorization (e.g., updateBookingStatus).


Testing: Run backend with npm run dev and test with Thunder Client or frontend code.
Updates: This doc may evolve as backend features are refined. Check for updates regularly.
