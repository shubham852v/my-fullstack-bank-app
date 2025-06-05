const Account = require('../models/accountModel');
const User = require('../models/userModel');
const Transaction = require('../models/transactionModel');
const bcrypt = require('bcryptjs');
const { invalidateToken } = require('../middleware/authMiddleware');

exports.getAllCustomerAccounts = async (req, res) => {
    try {
        const accounts = await Account.getAllCustomerAccounts();
        const customerAccounts = accounts.filter(acc => acc.user && acc.user.role === 'customer')
                                       .map(acc => ({
                                           account_id: acc._id,
                                           user_id: acc.user._id,
                                           username: acc.user.username,
                                           email: acc.user.email,
                                           account_number: acc.accountNumber,
                                           balance: acc.balance,
                                           created_at: acc.createdAt,
                                           updated_at: acc.updatedAt
                                       }));
        res.status(200).json(customerAccounts);
    } catch (error) {
        console.error('Error fetching all customer accounts:', error);
        res.status(500).json({ message: 'Server error fetching accounts' });
    }
};

exports.getCustomerTransactions = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user || user.role !== 'customer') {
            return res.status(404).json({ message: 'Customer not found or invalid user role.' });
        }

        const account = await Account.getAccountByUserId(userId);
        if (!account) {
            return res.status(404).json({ message: 'Account not found for this customer.' });
        }

        const transactions = await Transaction.getTransactionsByAccountId(account._id);

        const formattedTransactions = transactions.map(tx => ({
            transaction_id: tx._id,
            account_id: tx.account,
            type: tx.type,
            amount: tx.amount,
            timestamp: tx.timestamp
        }));

        res.status(200).json({
            customer: {
                userId: user._id,
                username: user.username,
                email: user.email
            },
            account: {
                accountId: account._id,
                accountNumber: account.accountNumber,
                balance: account.balance
            },
            transactions: formattedTransactions
        });

    } catch (error) {
        console.error(`Error fetching transactions for user ${userId}:`, error);
        res.status(500).json({ message: 'Server error fetching customer transactions' });
    }
};

exports.updateUser = async (req, res) => {
    const { userId } = req.params;
    const { username, email, password } = req.body;
    const requestingUser = req.user;

    try {
        if (requestingUser.role !== 'banker') {
            return res.status(403).json({ message: 'Access denied: Only bankers can update user profiles.' });
        }

        const userToUpdate = await User.findById(userId);
        if (!userToUpdate) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (username !== undefined) userToUpdate.username = username;
        if (email !== undefined) userToUpdate.email = email;
        if (password !== undefined) {
            userToUpdate.password = password;
        }

        await userToUpdate.save();

        if (password || username || email) {
            if (String(requestingUser.userId) === String(userId)) {
                invalidateToken(req.headers['authorization']);
                return res.status(200).json({ message: 'Your profile updated successfully. Please log in again with new credentials.', reauthenticate: true });
            }
        }

        res.status(200).json({ message: 'User profile updated successfully.' });

    } catch (error) {
        console.error('Error updating user:', error);
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(409).json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.` });
        }
        res.status(500).json({ message: 'Server error updating user profile' });
    }
};
