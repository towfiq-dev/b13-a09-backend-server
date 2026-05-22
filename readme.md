# 🩺 Doctor Appointment & Booking Server

This is the backend API for a Doctor Appointment and Booking Management System. Built with Express.js, MongoDB, and secured using BetterAuth (JWKS-based token verification) to ensure high security and seamless performance.

## 🚀 Features

* **Secure Authentication:** Token validation and API protection via BetterAuth and `jose-cjs` (JWKS).
* **Doctor Appointment Management:** Full CRUD operations (Create, Read, Update, Delete) and filtering for doctor appointments.
* **User Booking System:** Allows users to create, view, modify, and cancel/delete their booking history.
* **Profile Management:** Dynamic user profile handling using an Upsert (Create/Update) mechanism.
* **Optimized Database:** Reliable connection setup with MongoDB including a deployment ping verification.

---

## 🛠️ Technology Stack

* **Runtime Environment:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (Official Driver)
* **Authentication:** JWKS (`jose-cjs`)
* **Other Dependencies:** `cors`, `dotenv`

---

## ⚙️ Deployment

* **CLIENT_URL:** https://doctor-appointment-manager-one.vercel.app