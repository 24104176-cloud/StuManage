const db = require('../config/db');

const calculateGrade = (marks) => {
    if (marks >= 90) return 'A';
    if (marks >= 80) return 'B';
    if (marks >= 70) return 'C';
    return 'Fail';
};

exports.addMarks = async (req, res) => {
    const { student_id, course_id, marks } = req.body;
    try {
        await db.execute('INSERT INTO grades (student_id, course_id, marks) VALUES (?, ?, ?)', [student_id, course_id, marks]);
        
        // Calculate overall result for the student (simple version: average of all courses)
        const [allMarks] = await db.execute('SELECT marks FROM grades WHERE student_id = ?', [student_id]);
        const total = allMarks.reduce((sum, row) => sum + row.marks, 0);
        const percentage = total / allMarks.length;
        const grade = calculateGrade(percentage);

        // Check if result exists, then update or insert
        const [existing] = await db.execute('SELECT id FROM results WHERE student_id = ?', [student_id]);
        if (existing.length > 0) {
            await db.execute('UPDATE results SET total_marks = ?, percentage = ?, grade = ? WHERE student_id = ?', [total, percentage, grade, student_id]);
        } else {
            await db.execute('INSERT INTO results (student_id, total_marks, percentage, grade) VALUES (?, ?, ?, ?)', [student_id, total, percentage, grade]);
        }

        res.json({ success: true, message: 'Marks added and result updated' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getResults = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT r.*, s.name as student_name 
            FROM results r 
            JOIN students s ON r.student_id = s.id
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
