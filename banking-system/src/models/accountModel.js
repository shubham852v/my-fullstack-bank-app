const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
        unique: true // One account per user
    },
    accountNumber: {
        type: String,
        required: [true, 'Account number is required'],
        unique: true,
        trim: true
    },
    balance: {
        type: Number,
        required: [true, 'Balance is required'],
        default: 0.00,
        min: [0, 'Balance cannot be negative'] // Ensure balance doesn't go below zero
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update `updatedAt` field on every save
accountSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Static method to find all customer accounts, populating user details
accountSchema.statics.getAllCustomerAccounts = async function() {
    return this.find()
        .populate('user', 'username email role') // Populate username, email, role from User model
        .exec();
};

// Static method to get account by user ID
accountSchema.statics.getAccountByUserId = async function(userId) {
    return this.findOne({ user: userId }).exec();
};

// Static method to get account by account ID
accountSchema.statics.getAccountByAccountId = async function(accountId) {
    return this.findById(accountId).exec();
};

// Static method to update balance (simplified for direct update, not transactional)
accountSchema.statics.updateBalance = async function(accountId, newBalance) {
    await this.findByIdAndUpdate(accountId, { balance: newBalance, updatedAt: Date.now() }).exec();
};


const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
