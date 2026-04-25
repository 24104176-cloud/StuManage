const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const authController = require('../controllers/authController');
const studentController = require('../controllers/studentController');
const courseController = require('../controllers/courseController');
const attendanceController = require('../controllers/attendanceController');
const gradeController = require('../controllers/gradeController');
const feeController = require('../controllers/feeController');
const notificationController = require('../controllers/notificationController');
const dashboardController = require('../controllers/dashboardController');

// Auth
router.post('/login', authController.login);

// Protected Routes
router.use(auth);

// Dashboard
router.get('/stats', dashboardController.getStats);

// Students
router.get('/students', studentController.getStudents);
router.post('/students', studentController.addStudent);
router.put('/students/:id', studentController.updateStudent);
router.delete('/students/:id', studentController.deleteStudent);

// Courses
router.get('/courses', courseController.getCourses);
router.post('/courses', courseController.addCourse);
router.delete('/courses/:id', courseController.deleteCourse);
router.post('/courses/assign', courseController.assignCourse);
router.get('/students/:student_id/courses', courseController.getStudentCourses);

// Attendance
router.post('/attendance', attendanceController.markAttendance);
router.get('/attendance', attendanceController.getAttendance);
router.get('/attendance/percentage/:student_id/:course_id', attendanceController.getAttendancePercentage);

// Grades & Results
router.post('/grades', gradeController.addMarks);
router.get('/results', gradeController.getResults);

// Fees
router.post('/fees', feeController.addFee);
router.get('/fees', feeController.getFees);
router.get('/fees/summary', feeController.getFeeSummary);

// Notifications
router.post('/notifications', notificationController.addNotification);
router.get('/notifications', notificationController.getNotifications);

module.exports = router;
