const UserModel = require('../models/userModel');
const { generateAccessToken } = require('../utils/helpers');
const { registerToken } = require('../middleware/authMiddleware');

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username/email and password are required' });
    }

    try {
        const user = await UserModel.findByUsernameOrEmail(username);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await UserModel.comparePassword(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken();
        registerToken(accessToken, user.user_id, user.role);

        res.status(200).json({
            message: 'Login successful',
            accessToken: accessToken,
            user: {
                id: user.user_id,
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
