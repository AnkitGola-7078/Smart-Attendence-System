# Smart Attendance System

### 🚀 Overview

A **real-time Attendance Management System** built with **.NET 8, MongoDB, JWT Authentication, and Role-Based Access Control (RBAC)**. The system enables secure user management, attendance tracking, and department administration with a scalable architecture.

---

## ✨ Key Features

🔐 **Secure Authentication**

* User Registration & Login
* JWT-based Authentication
* Password Hashing & Secure Session Management

👥 **Role-Based Access Control**

* **Admin** – Manage users, departments, and attendance records
* **Employee** – Mark and view attendance
* **Student** – Track personal attendance records

🏢 **Department Management**

* Create and manage departments
* Assign users to departments

🕒 **Attendance Tracking**

* Real-time attendance marking
* User-specific attendance history
* Attendance record management

🗄️ **MongoDB Integration**

* Efficient NoSQL database storage
* Prisma-like ORM layer for database operations

---

## 🛠️ Tech Stack

**Backend:** .NET 8, ASP.NET Core Web API
**Database:** MongoDB
**Authentication:** JWT (JSON Web Tokens)
**Frontend:** React.js, Vite
**ORM Layer:** Custom MongoDB Repository Pattern

---

## ⚙️ Installation & Setup

### 1️⃣ Configure MongoDB

#### Option A: MongoDB Atlas (Recommended)

* Create a cluster in MongoDB Atlas
* Obtain the connection string
* Update the `.env` file

#### Option B: Local MongoDB

```env
MONGO_URI=mongodb://localhost:27017/SmartAttendance
JWT_SECRET=YourSecureJWTSecretKey
PORT=5000
```

### 2️⃣ Start Backend

```bash
cd backend/SmartAttendance.API
dotnet run
```

### 3️⃣ Start Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📡 API Endpoints

### 🔐 Authentication

* `POST /api/auth/register` → Register User
* `POST /api/auth/login` → Login & Generate JWT

### 👤 User Management

* `GET /api/users` → Fetch All Users
* `GET /api/users/{id}` → Fetch User by ID
* `PUT /api/users/{id}` → Update User
* `DELETE /api/users/{id}` → Delete User

### 🕒 Attendance

* `GET /api/attendance` → Get Attendance Records
* `POST /api/attendance` → Mark Attendance
* `GET /api/attendance/user/{userId}` → User Attendance History

---

## 🗃️ Database Schema

### Users Collection

```json
{
  "name": "string",
  "email": "string (unique)",
  "password": "string (hashed)",
  "role": "Admin | Employee | Student",
  "department": "string"
}
```

---

## 📖 System Workflow

1. User registers with secure credentials.
2. Data is stored in MongoDB with encrypted passwords.
3. User logs in and receives a JWT token.
4. JWT verifies requests and maintains secure sessions.
5. Role-based permissions control access to resources.
6. Attendance records are stored and retrieved in real time.

---

## 🎯 Future Enhancements

📊 Attendance Analytics Dashboard
📧 Email & Notification Integration
📱 Mobile Application Support
🔍 Advanced Reporting System
📷 QR Code Based Attendance
🖐️ Biometric Attendance Integration

---

### ⭐ Highlights

✔ Secure JWT Authentication
✔ Role-Based Authorization
✔ Real-Time Attendance Tracking
✔ MongoDB Integration
✔ Scalable REST API Architecture
