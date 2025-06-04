const pool = require('../config/db');

class AccountModel {
    static async getAllCustomerAccounts() {
        const [rows] = await pool.execute(`
            SELECT
                a.account_id,
                a.user_id,
                u.username,
                u.email,
                a.account_number,
                a.balance,
                a.created_at,
                a.updated_at
            FROM Accounts a
            JOIN Users u ON a.user_id = u.user_id
            WHERE u.role = 'customer'
            ORDER BY u.username;
        `);
        // Crucial: Map over rows to ensure 'balance' is a number
        const parsedRows = rows.map(row => ({
            ...row,
            balance: parseFloat(row.balance) // Convert balance to a float
        }));
        return parsedRows;
    }

    static async getAccountByUserId(userId) {
        const [rows] = await pool.execute('SELECT * FROM Accounts WHERE user_id = ?', [userId]);
        const account = rows[0];
        if (account && typeof account.balance === 'string') {
            account.balance = parseFloat(account.balance);
        }
        return account;
    }

    static async getAccountByAccountId(accountId) {
        const [rows] = await pool.execute('SELECT * FROM Accounts WHERE account_id = ?', [accountId]);
        const account = rows[0];
        if (account && typeof account.balance === 'string') {
            account.balance = parseFloat(account.balance);
        }
        return account;
    }

    static async updateBalance(accountId, newBalance, connection) {
        const conn = connection || pool;
        await conn.execute('UPDATE Accounts SET balance = ?, updated_at = CURRENT_TIMESTAMP WHERE account_id = ?', [newBalance, accountId]);
    }
}

module.exports = AccountModel;
