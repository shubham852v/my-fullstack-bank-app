const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator'); // For email validation

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please enter a valid email address'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false // Do not return password by default in queries
    },
    role: {
        type: String,
        enum: ['customer', 'banker'],
        required: [true, 'Role is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    // Mongoose automatically adds `_id`
    // No `timestamps: true` here as we have custom `createdAt`
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Method to find user by username or email (for login)
userSchema.statics.findByUsernameOrEmail = async function(identifier) {
    const user = await this.findOne({
        $or: [{ username: identifier }, { email: identifier }]
    }).select('+password'); // Select password explicitly for login comparison
    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
