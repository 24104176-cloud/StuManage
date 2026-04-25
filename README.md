# StuManage - Student Management System

A fully functional Student Management System built with Node.js, Express, MySQL, and Vanilla JS.

## 🚀 Features
- **Admin Authentication**: Secure login with JWT.
- **Student Management**: CRUD operations for student records.
- **Course Management**: Manage courses and enrollments.
- **Attendance Tracking**: Mark and monitor student attendance.
- **Grade & Results**: Add marks and auto-calculate grades.
- **Fees Management**: Track payments and pending dues.
- **Notifications**: System-wide announcements.
- **Real-time Dashboard**: Live stats from the database.

## 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: MySQL

## ⚙️ Setup Instructions

### 1. Database Setup
1. Open your MySQL terminal or GUI (like MySQL Workbench).
2. Run the commands in `database.sql` to create the database and tables.
   ```sql
   source database.sql;
   ```

### 2. Backend Setup
1. Navigate to the `backend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update the `.env` file with your MySQL credentials:
   ```env
   DB_USER=root
   DB_PASSWORD=your_password
   ```
4. Seed the admin user:
   ```bash
   node seed.js
   ```
5. Start the server:
   ```bash
   node index.js
   ```
   The server will run on `http://localhost:5000`.

### 3. Frontend Setup
1. Open `frontend/index.html` in your browser.
2. Login with:
   - **Username**: `admin`
   - **Password**: `admin123`

## ⚠️ Notes
- Ensure MySQL is running before starting the backend.
- The system uses `localStorage` to persist the JWT token for session management.
