const AccountModel = require('../models/accountModel');
const TransactionModel = require('../models/transactionModel');
const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const { invalidateToken } = require('../middleware/authMiddleware');

exports.getAllCustomerAccounts = async (req, res) => {
    try {
        const accounts = await AccountModel.getAllCustomerAccounts();
        res.status(200).json(accounts);
    } catch (error) {
        console.error('Error fetching all customer accounts:', error);
        res.status(500).json({ message: 'Server error fetching accounts' });
    }
};

exports.getCustomerTransactions = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await UserModel.findById(userId);
        if (!user || user.role !== 'customer') {
            return res.status(404).json({ message: 'Customer not found or invalid user role.' });
        }

        const account = await AccountModel.getAccountByUserId(userId);
        if (!account) {
            return res.status(404).json({ message: 'Account not found for this customer.' });
        }

        const transactions = await TransactionModel.getTransactionsByAccountId(account.account_id);

        const parsedTransactions = transactions.map(tx => ({
            ...tx,
            amount: parseFloat(tx.amount)
        }));

        res.status(200).json({
            customer: {
                userId: user.user_id,
                username: user.username,
                email: user.email
            },
            account: account,
            transactions: parsedTransactions
        });

    } catch (error) {
        console.error(`Error fetching transactions for user ${userId}:`, error);
        res.status(500).json({ message: 'Server error fetching customer transactions' });
    }
};

// New: Function to update user details (username, email, password)
exports.updateUser = async (req, res) => {
    const { userId } = req.params; // User ID to update (from URL parameter)
    const { username, email, password } = req.body; // New details from request body
    const requestingUser = req.user; // User making the request (from token)

    try {
        if (requestingUser.role !== 'banker') {
            return res.status(403).json({ message: 'Access denied: Only bankers can update user profiles.' });
        }

        const userToUpdate = await UserModel.findById(userId);
        if (!userToUpdate) {
            return res.status(404).json({ message: 'User not found.' });
        }

        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const result = await UserModel.update(userId, username, email, hashedPassword);

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'No changes made or user not found.' });
        }

        // Invalidate the token of the user whose password was changed
        if (password || username || email) {
            // If the banker updated their OWN account, invalidate their token
            if (String(requestingUser.userId) === String(userId)) {
                invalidateToken(req.headers['authorization']);
                return res.status(200).json({ message: 'Your profile updated successfully. Please log in again with new credentials.', reauthenticate: true });
            }
        }

        res.status(200).json({ message: 'User profile updated successfully.' });

    } catch (error) {
        console.error('Error updating user:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Username or email already exists.' });
        }
        res.status(500).json({ message: 'Server error updating user profile' });
    }
};
