const db = require('../config/db');

exports.markAttendance = async (req, res) => {
    const { student_id, course_id, date, status } = req.body;
    try {
        await db.execute('INSERT INTO attendance (student_id, course_id, date, status) VALUES (?, ?, ?, ?)', [student_id, course_id, date, status]);
        res.json({ success: true, message: 'Attendance marked' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getAttendance = async (req, res) => {
    const { student_id, course_id } = req.query;
    try {
        let query = `
            SELECT a.*, s.name as student_name, c.name as course_name 
            FROM attendance a 
            JOIN students s ON a.student_id = s.id 
            JOIN courses c ON a.course_id = c.id
        `;
        let params = [];
        if (student_id && course_id) {
            query += ' WHERE a.student_id = ? AND a.course_id = ?';
            params = [student_id, course_id];
        } else if (student_id) {
            query += ' WHERE a.student_id = ?';
            params = [student_id];
        }

        const [rows] = await db.execute(query, params);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getAttendancePercentage = async (req, res) => {
    const { student_id, course_id } = req.params;
    try {
        const [rows] = await db.execute(`
            SELECT 
                COUNT(*) as total, 
                SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present 
            FROM attendance 
            WHERE student_id = ? AND course_id = ?`, [student_id, course_id]);
        
        const { total, present } = rows[0];
        const percentage = total > 0 ? (present / total) * 100 : 0;
        
        res.json({ success: true, percentage: percentage.toFixed(2) });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
