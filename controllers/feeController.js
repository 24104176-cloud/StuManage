const db = require('../config/db');

exports.addFee = async (req, res) => {
    const { student_id, amount, date, status } = req.body;
    try {
        await db.execute('INSERT INTO fees (student_id, amount, date, status) VALUES (?, ?, ?, ?)', [student_id, amount, date, status]);
        res.json({ success: true, message: 'Fee record added' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getFees = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT f.*, s.name as student_name 
            FROM fees f 
            JOIN students s ON f.student_id = s.id
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getFeeSummary = async (req, res) => {
    try {
        const [totalRows] = await db.execute('SELECT SUM(amount) as total FROM fees WHERE status = "Paid"');
        const [pendingRows] = await db.execute('SELECT SUM(amount) as total FROM fees WHERE status = "Pending"');
        
        res.json({ 
            success: true, 
            totalCollected: totalRows[0].total || 0,
            totalPending: pendingRows[0].total || 0
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
