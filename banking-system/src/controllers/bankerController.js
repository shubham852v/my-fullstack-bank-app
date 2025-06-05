const Account = require('../models/accountModel'); // Use Account model (capitalized)
const User = require('../models/userModel'); // Use User model (capitalized)
const Transaction = require('../models/transactionModel'); // Use Transaction model (capitalized)
const bcrypt = require('bcryptjs');
const { invalidateToken } = require('../middleware/authMiddleware');

exports.getAllCustomerAccounts = async (req, res) => {
    try {
        // Mongoose populate handles joining, no need for complex SQL
        const accounts = await Account.getAllCustomerAccounts();
        // Filter to only include customer accounts if not handled by getAllCustomerAccounts itself
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
    const { userId } = req.params; // This is a Mongoose ObjectId as a string

    try {
        const user = await User.findById(userId); // Find user by ID
        if (!user || user.role !== 'customer') {
            return res.status(404).json({ message: 'Customer not found or invalid user role.' });
        }

        const account = await Account.getAccountByUserId(userId); // Find account by user ObjectId
        if (!account) {
            return res.status(404).json({ message: 'Account not found for this customer.' });
        }

        const transactions = await Transaction.getTransactionsByAccountId(account._id); // Find transactions by account ObjectId

        // Map transactions to match previous API response structure
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
    const { userId } = req.params; // User ID to update (MongoDB ObjectId as string)
    const { username, email, password } = req.body; // New details from request body
    const requestingUser = req.user; // User making the request (from token)

    try {
        if (requestingUser.role !== 'banker') {
            return res.status(403).json({ message: 'Access denied: Only bankers can update user profiles.' });
        }

        const userToUpdate = await User.findById(userId);
        if (!userToUpdate) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Only update fields that are provided
        if (username !== undefined) userToUpdate.username = username;
        if (email !== undefined) userToUpdate.email = email;
        if (password !== undefined) {
            // Mongoose pre-save hook will hash the password if it's modified
            userToUpdate.password = password;
        }

        await userToUpdate.save(); // Save the updated user document

        // Invalidate the token if user's own credentials were updated
        if (password || username || email) {
            if (String(requestingUser.userId) === String(userId)) {
                invalidateToken(req.headers['authorization']);
                return res.status(200).json({ message: 'Your profile updated successfully. Please log in again with new credentials.', reauthenticate: true });
            }
        }

        res.status(200).json({ message: 'User profile updated successfully.' });

    } catch (error) {
        console.error('Error updating user:', error);
        // MongoDB duplicate key error code
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(409).json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.` });
        }
        res.status(500).json({ message: 'Server error updating user profile' });
    }
};
