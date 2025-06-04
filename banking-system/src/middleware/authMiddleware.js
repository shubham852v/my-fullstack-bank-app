const activeTokens = new Map(); // token -> { userId, role }

const registerToken = (token, userId, role) => {
    activeTokens.set(token, { userId, role });
};

const invalidateToken = (token) => {
    activeTokens.delete(token);
};

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader;

    const userInfo = activeTokens.get(token);

    if (!userInfo) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.user = userInfo;
    next();
};

const isCustomer = (req, res, next) => {
    if (req.user && req.user.role === 'customer') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Customer role required' });
    }
};

const isBanker = (req, res, next) => {
    if (req.user && req.user.role === 'banker') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Banker role required' });
    }
};

module.exports = {
    registerToken,
    invalidateToken,
    verifyToken,
    isCustomer,
    isBanker,
};
