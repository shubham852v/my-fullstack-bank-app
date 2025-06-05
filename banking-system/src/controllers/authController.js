const User = require('../models/userModel'); // Changed from UserModel to User
const { generateAccessToken } = require('../utils/helpers');
const { registerToken } = require('../middleware/authMiddleware');

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username/email and password are required' });
    }

    try {
        // Use static method from Mongoose model (now `User`)
        const user = await User.findByUsernameOrEmail(username); // Changed from UserModel.findByUsernameOrEmail

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Use instance method from Mongoose document (now `user.comparePassword`)
        const isMatch = await user.comparePassword(password); // Changed from UserModel.comparePassword(password, user.password)

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken();
        registerToken(accessToken, user._id.toString(), user.role); // Use user._id and convert to string

        res.status(200).json({
            message: 'Login successful',
            accessToken: accessToken,
            user: {
                id: user._id.toString(), // Convert _id to string
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};
