const db = require('../config/db');

exports.addNotification = async (req, res) => {
    const { title, message } = req.body;
    try {
        await db.execute('INSERT INTO notifications (title, message) VALUES (?, ?)', [title, message]);
        res.json({ success: true, message: 'Notification added' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getNotifications = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM notifications ORDER BY date DESC');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
