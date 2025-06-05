const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    type: {
        type: String,
        enum: ['deposit', 'withdrawal'],
        required: [true, 'Transaction type is required']
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0.01, 'Amount must be a positive number']
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

transactionSchema.statics.getTransactionsByAccountId = async function(accountId) {
    return this.find({ account: accountId }).sort({ timestamp: -1 }).exec();
};

transactionSchema.statics.createTransaction = async function(accountId, type, amount) {
    const newTransaction = new this({
        account: accountId,
        type: type,
        amount: amount
    });
    await newTransaction.save();
};

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
