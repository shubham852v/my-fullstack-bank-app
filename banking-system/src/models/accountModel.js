const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
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
        min: [0, 'Balance cannot be negative']
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

accountSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

accountSchema.statics.getAllCustomerAccounts = async function() {
    return this.find()
        .populate('user', 'username email role')
        .exec();
};

accountSchema.statics.getAccountByUserId = async function(userId) {
    return this.findOne({ user: userId }).exec();
};

accountSchema.statics.getAccountByAccountId = async function(accountId) {
    return this.findById(accountId).exec();
};

accountSchema.statics.updateBalance = async function(accountId, newBalance) {
    await this.findByIdAndUpdate(accountId, { balance: newBalance, updatedAt: Date.now() }).exec();
};

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
