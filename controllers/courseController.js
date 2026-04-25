const db = require('../config/db');

exports.getCourses = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM courses');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.addCourse = async (req, res) => {
    const { name, code, credits } = req.body;
    try {
        await db.execute('INSERT INTO courses (name, code, credits) VALUES (?, ?, ?)', [name, code, credits]);
        res.json({ success: true, message: 'Course added' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteCourse = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM courses WHERE id = ?', [id]);
        res.json({ success: true, message: 'Course deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.assignCourse = async (req, res) => {
    const { student_id, course_id } = req.body;
    try {
        await db.execute('INSERT INTO student_courses (student_id, course_id) VALUES (?, ?)', [student_id, course_id]);
        res.json({ success: true, message: 'Course assigned to student' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getStudentCourses = async (req, res) => {
    const { student_id } = req.params;
    try {
        const [rows] = await db.execute(`
            SELECT c.* FROM courses c 
            JOIN student_courses sc ON c.id = sc.course_id 
            WHERE sc.student_id = ?`, [student_id]);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
