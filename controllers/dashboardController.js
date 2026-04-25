const db = require('../config/db');

exports.getStats = async (req, res) => {
    try {
        const [studentCount] = await db.execute('SELECT COUNT(*) as count FROM students');
        const [courseCount] = await db.execute('SELECT COUNT(*) as count FROM courses');
        const [attendanceCount] = await db.execute('SELECT COUNT(*) as count FROM attendance');
        const [feeCollected] = await db.execute('SELECT SUM(amount) as total FROM fees WHERE status = "Paid"');

        res.json({
            success: true,
            data: {
                totalStudents: studentCount[0].count,
                totalCourses: courseCount[0].count,
                totalAttendance: attendanceCount[0].count,
                totalFees: feeCollected[0].total || 0
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
