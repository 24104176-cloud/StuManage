const db = require('./config/db');
const bcrypt = require('bcryptjs');

const seed = async () => {
    try {
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await db.execute('DELETE FROM admins WHERE username = "admin"');
        await db.execute('INSERT INTO admins (username, password) VALUES (?, ?)', ['admin', hashedPassword]);
        
        console.log('Admin seeded successfully');
        process.exit();
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seed();
