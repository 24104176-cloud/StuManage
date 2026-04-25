const db = require('../config/db');

exports.getStudents = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM students');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.addStudent = async (req, res) => {
    const { name, email, branch, year } = req.body;
    try {
        await db.execute('INSERT INTO students (name, email, branch, year) VALUES (?, ?, ?, ?)', [name, email, branch, year]);
        res.json({ success: true, message: 'Student added' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateStudent = async (req, res) => {
    const { id } = req.params;
    const { name, email, branch, year } = req.body;
    try {
        await db.execute('UPDATE students SET name = ?, email = ?, branch = ?, year = ? WHERE id = ?', [name, email, branch, year, id]);
        res.json({ success: true, message: 'Student updated' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteStudent = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM students WHERE id = ?', [id]);
        res.json({ success: true, message: 'Student deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
