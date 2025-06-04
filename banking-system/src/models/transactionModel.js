const pool = require('../config/db');

class TransactionModel {
    static async createTransaction(accountId, type, amount, connection) {
        const conn = connection || pool;
        await conn.execute(
            'INSERT INTO Transactions (account_id, type, amount) VALUES (?, ?, ?)',
            [accountId, type, amount]
        );
    }

    static async getTransactionsByAccountId(accountId) {
        const [rows] = await pool.execute('SELECT * FROM Transactions WHERE account_id = ? ORDER BY timestamp DESC', [accountId]);
        const parsedRows = rows.map(row => ({
            ...row,
            amount: parseFloat(row.amount) // Convert amount to a float
        }));
        return parsedRows;
    }
}

module.exports = TransactionModel;
