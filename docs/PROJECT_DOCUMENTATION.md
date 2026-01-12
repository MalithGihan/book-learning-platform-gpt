
---

## 2) `docs/PROJECT_DOCUMENTATION.md`

```md
# Project Documentation — Online Learning Platform

### 1. Project Summary
This project is an online learning platform with:
- User authentication (Register/Login/Logout)
- Role-based access control (student/instructor/admin)
- Course listing + course details
- Course CRUD for instructors/admin
- Student enrollments + “My Enrollments”
- Secure backend practices (cookies, CORS allowlist, rate limit, etc.)

---

### 2. System Architecture (High-Level)

#### Components
1) **Frontend (React + TS + Vite)**
- Single Page App (SPA)
- Tailwind UI
- Redux Toolkit + RTK Query for API communication & caching

2) **Backend (Node.js + Express + TypeScript)**
- REST API with `/api/v1` versioning
- JWT auth via HttpOnly cookies (access + refresh approach)
- RBAC middleware to protect instructor/admin routes

3) **Database (MongoDB Atlas + Mongoose)**
- Stores users, courses, and enrollments
- Prevents duplicate enrollments via unique index `(studentId + courseId)`

#### Request Flow
Browser (client) → Express API (`/api/v1`) → MongoDB Atlas  
Auth is maintained using **HttpOnly cookies** (sent automatically with `credentials: "include"` in frontend requests).

---

### 3. Frontend Documentation

#### 3.1 Tech Stack
- React + TypeScript (Vite)
- React Router
- Tailwind CSS
- Redux Toolkit + RTK Query
- Formik + Yup
- lucide-react

#### 3.2 Frontend Architecture
- **Pages / Routes**: marketing pages, auth pages, dashboard pages
- **Redux + RTK Query**:
  - Central API layer for requests
  - Caching + auto-refetch
  - Tag invalidation for create/update/delete
- **UI Components**:
  - Reusable layout components (navbar/sidebar)
  - Modals/loaders/toasts
- **Role-based UI**:
  - Navigation and available actions depend on `user.role`

#### 3.3 Forms & Validation
Formik + Yup:
- Client-side validation
- Inline error messages
- Clean payload submission
- Loading states for submit

#### 3.4 Frontend Local Setup
```bash
cd client
npm install
cp .env.example .env
npm run dev
