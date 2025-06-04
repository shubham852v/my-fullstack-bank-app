const AccountModel = require('../models/accountModel');
const TransactionModel = require('../models/transactionModel');
const UserModel = require('../models/userModel');
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const { invalidateToken } = require('../middleware/authMiddleware');

exports.getCustomerDashboard = async (req, res) => {
    const { userId } = req.user;

    try {
        const account = await AccountModel.getAccountByUserId(userId);
        if (!account) {
            return res.status(404).json({ message: 'Account not found for this customer.' });
        }

        const transactions = await TransactionModel.getTransactionsByAccountId(account.account_id);

        res.status(200).json({
            account: account,
            transactions: transactions
        });

    } catch (error) {
        console.error('Error fetching customer dashboard data:', error);
        res.status(500).json({ message: 'Server error fetching dashboard data' });
    }
};

exports.deposit = async (req, res) => {
    const { userId } = req.user;
    const { amount } = req.body;

    if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: 'Invalid deposit amount.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const account = await AccountModel.getAccountByUserId(userId);
        if (!account) {
            await connection.rollback();
            return res.status(404).json({ message: 'Account not found.' });
        }

        const newBalance = parseFloat(account.balance) + parseFloat(amount);

        await AccountModel.updateBalance(account.account_id, newBalance, connection);
        await TransactionModel.createTransaction(account.account_id, 'deposit', amount, connection);

        await connection.commit();
        res.status(200).json({
            message: 'Deposit successful',
            newBalance: newBalance.toFixed(2)
        });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error during deposit:', error);
        res.status(500).json({ message: 'Server error during deposit' });
    } finally {
        if (connection) connection.release();
    }
};

exports.withdraw = async (req, res) => {
    const { userId } = req.user;
    const { amount } = req.body;

    if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: 'Invalid withdrawal amount.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const account = await AccountModel.getAccountByUserId(userId);
        if (!account) {
            await connection.rollback();
            return res.status(404).json({ message: 'Account not found.' });
        }

        if (parseFloat(account.balance) < parseFloat(amount)) {
            await connection.rollback();
            return res.status(400).json({ message: 'Insufficient Funds' });
        }

        const newBalance = parseFloat(account.balance) - parseFloat(amount);

        await AccountModel.updateBalance(account.account_id, newBalance, connection);
        await TransactionModel.createTransaction(account.account_id, 'withdrawal', amount, connection);

        await connection.commit();
        res.status(200).json({
            message: 'Withdrawal successful',
            newBalance: newBalance.toFixed(2)
        });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error during withdrawal:', error);
        res.status(500).json({ message: 'Server error during withdrawal' });
    } finally {
        if (connection) connection.release();
    }
};

// New: Function to update customer's own profile
exports.updateProfile = async (req, res) => {
    const { userId: authenticatedUserId, role: authenticatedUserRole } = req.user; // User ID from the token
    const { username, email, password } = req.body; // New details from request body

    try {
        if (authenticatedUserRole !== 'customer') {
            return res.status(403).json({ message: 'Access denied: Only customers can update their own profile.' });
        }

        const userToUpdate = await UserModel.findById(authenticatedUserId);
        if (!userToUpdate) {
            return res.status(404).json({ message: 'Authenticated user not found.' });
        }

        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const result = await UserModel.update(authenticatedUserId, username, email, hashedPassword);

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'No changes made or user not found.' });
        }

        if (password || username || email) {
            invalidateToken(req.headers['authorization']); // Invalidate the current token
            return res.status(200).json({ message: 'Your profile updated successfully. Please log in again with new credentials.', reauthenticate: true });
        }

        res.status(200).json({ message: 'Profile updated successfully.' });

    } catch (error) {
        console.error('Error updating customer profile:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Username or email already exists.' });
        }
        res.status(500).json({ message: 'Server error updating profile' });
    }
};
