const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class UserModel {
    static async findByUsernameOrEmail(identifier) {
        const [rows] = await pool.execute(
            'SELECT * FROM Users WHERE username = ? OR email = ?',
            [identifier, identifier]
        );
        return rows[0];
    }

    static async comparePassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }

    static async findById(userId) {
        const [rows] = await pool.execute('SELECT user_id, username, email, role FROM Users WHERE user_id = ?', [userId]);
        return rows[0];
    }

    static async update(userId, username, email, hashedPassword) {
        let query = 'UPDATE Users SET ';
        const params = [];
        const updates = [];
        let paramIndex = 0; // For tracking parameter index if needed, but '?' handles it

        if (username !== undefined) {
            updates.push('username = ?');
            params.push(username);
        }
        if (email !== undefined) {
            updates.push('email = ?');
            params.push(email);
        }
        if (hashedPassword !== undefined) {
            updates.push('password = ?');
            params.push(hashedPassword);
        }

        if (updates.length === 0) {
            return { affectedRows: 0 }; // Nothing to update
        }

        query += updates.join(', ') + ' WHERE user_id = ?';
        params.push(userId);

        const [result] = await pool.execute(query, params);
        return result;
    }
}

module.exports = UserModel;
