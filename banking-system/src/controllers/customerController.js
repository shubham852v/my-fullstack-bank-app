const Account = require('../models/accountModel');
const Transaction = require('../models/transactionModel');
const User = require('../models/userModel'); // Import User model
const { invalidateToken } = require('../middleware/authMiddleware'); // Import invalidateToken

exports.getCustomerDashboard = async (req, res) => {
    const { userId } = req.user; // userId is a string representation of MongoDB ObjectId

    try {
        const account = await Account.getAccountByUserId(userId);
        if (!account) {
            return res.status(404).json({ message: 'Account not found for this customer.' });
        }

        const transactions = await Transaction.getTransactionsByAccountId(account._id);

        // Map account and transactions to match previous API response structure
        res.status(200).json({
            account: {
                accountId: account._id,
                accountNumber: account.accountNumber,
                balance: account.balance
            },
            transactions: transactions.map(tx => ({
                transaction_id: tx._id,
                account_id: tx.account,
                type: tx.type,
                amount: tx.amount,
                timestamp: tx.timestamp
            }))
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

    try {
        // Find account by user ID
        const account = await Account.getAccountByUserId(userId);
        if (!account) {
            return res.status(404).json({ message: 'Account not found.' });
        }

        const newBalance = account.balance + parseFloat(amount);

        // Update balance and create transaction.
        // For simplicity, using single document update for balance.
        // For strict atomicity across multiple documents, MongoDB transactions
        // (requiring replica set) would be used.
        await Account.updateBalance(account._id, newBalance); // Update balance
        await Transaction.createTransaction(account._id, 'deposit', amount); // Create transaction

        res.status(200).json({
            message: 'Deposit successful',
            newBalance: newBalance.toFixed(2)
        });

    } catch (error) {
        console.error('Error during deposit:', error);
        res.status(500).json({ message: 'Server error during deposit' });
    }
};

exports.withdraw = async (req, res) => {
    const { userId } = req.user;
    const { amount } = req.body;

    if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: 'Invalid withdrawal amount.' });
    }

    try {
        const account = await Account.getAccountByUserId(userId);
        if (!account) {
            return res.status(404).json({ message: 'Account not found.' });
        }

        if (account.balance < parseFloat(amount)) {
            return res.status(400).json({ message: 'Insufficient Funds' });
        }

        const newBalance = account.balance - parseFloat(amount);

        await Account.updateBalance(account._id, newBalance); // Update balance
        await Transaction.createTransaction(account._id, 'withdrawal', amount); // Create transaction

        res.status(200).json({
            message: 'Withdrawal successful',
            newBalance: newBalance.toFixed(2)
        });

    } catch (error) {
        console.error('Error during withdrawal:', error);
        res.status(500).json({ message: 'Server error during withdrawal' });
    }
};

exports.updateProfile = async (req, res) => {
    const { userId: authenticatedUserId, role: authenticatedUserRole } = req.user; // User ID from the token
    const { username, email, password } = req.body; // New details from request body

    try {
        if (authenticatedUserRole !== 'customer') {
            return res.status(403).json({ message: 'Access denied: Only customers can update their own profile.' });
        }

        const userToUpdate = await User.findById(authenticatedUserId);
        if (!userToUpdate) {
            return res.status(404).json({ message: 'Authenticated user not found.' });
        }

        // Only update fields that are provided
        if (username !== undefined) userToUpdate.username = username;
        if (email !== undefined) userToUpdate.email = email;
        if (password !== undefined) {
            // Mongoose pre-save hook will hash the password if it's modified
            userToUpdate.password = password;
        }

        await userToUpdate.save(); // Save the updated user document

        if (password || username || email) {
            invalidateToken(req.headers['authorization']); // Invalidate the current token
            return res.status(200).json({ message: 'Your profile updated successfully. Please log in again with new credentials.', reauthenticate: true });
        }

        res.status(200).json({ message: 'Profile updated successfully.' });

    } catch (error) {
        console.error('Error updating customer profile:', error);
        // MongoDB duplicate key error code
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(409).json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.` });
        }
        res.status(500).json({ message: 'Server error updating profile' });
    }
};
