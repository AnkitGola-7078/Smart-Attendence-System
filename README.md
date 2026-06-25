📌 Smart Attendance System
A real-time attendance management system with secure user registration, login, and role-based access control using MongoDB and JWT authentication.

🚀 Features
Real-time user registration with MongoDB

JWT-based authentication for secure sessions

Role-based access control (Admin, Employee, Student)

Department management

Attendance tracking with user-specific records

Prisma-like ORM layer for MongoDB operations

🛠️ Prerequisites
.NET 8+ SDK

Node.js 18+

MongoDB (Local or Atlas)

⚙️ Setup Instructions
1️⃣ MongoDB Setup
Option A: MongoDB Atlas (Cloud - Recommended)

Sign up at MongoDB Atlas

Create a free cluster

Copy your connection string (format: mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/)

Update .env file with your connection string

Option B: MongoDB Local

Download MongoDB Community Server

Install and start MongoDB service

Default connection: mongodb://localhost:27017/SmartAttendance

2️⃣ Environment Variables
Create a .env file in the project root:

env
MONGO_URI=mongodb://localhost:27017/SmartAttendance
JWT_SECRET=ThisIsAVerySecureKeyForSmartAttendanceSystem12345!
PORT=5000
3️⃣ Run the Backend
bash
cd backend/SmartAttendance.API
dotnet run
4️⃣ Run the Frontend
bash
cd frontend
npm install
npm run dev
📡 API Endpoints
🔐 Authentication
POST /api/auth/register → Register a new user

POST /api/auth/login → Login and get JWT token

👤 Users
GET /api/users → Get all users

GET /api/users/{id} → Get user by ID

PUT /api/users/{id} → Update user

DELETE /api/users/{id} → Delete user

🕒 Attendance
GET /api/attendance → Get all attendance records

POST /api/attendance → Mark attendance

GET /api/attendance/user/{userId} → Get user attendance

🗄️ Database Schema
Users Collection
json
{
  "name": "string",
  "email": "string (unique)",
  "password": "string (hashed)",
  "role": "Admin|Employee|Student",
  "department": "string"
}
📖 How It Works
User registers and credentials are stored securely in MongoDB.

JWT token is generated on login for session management.

Role-based access ensures Admins can manage departments and employees, while Students/Employees can mark attendance.

Attendance records are stored and retrieved in real time.

✅ Future Enhancements
Dashboard with analytics (attendance trends, department stats)

Email/notification integration for absentees

Biometric/QR code support for marking attendance
