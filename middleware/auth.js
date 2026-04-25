const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ success: false, message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.adminId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
};

module.exports = verifyToken;
