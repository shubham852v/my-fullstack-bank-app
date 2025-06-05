const activeTokens = new Map(); // token -> { userId, role }

const registerToken = (token, userId, role) => {
    activeTokens.set(token, { userId, role });
};

const invalidateToken = (token) => {
    activeTokens.delete(token);
};

// ... (previous code) ...

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        // Returns 401 Unauthorized if no authorization header is sent
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader; // Assuming token is sent directly

    const userInfo = activeTokens.get(token);

    if (!userInfo) {
        // Returns 403 Forbidden if the token is not found (invalid or expired)
        return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.user = userInfo;
    next();
};

const isCustomer = (req, res, next) => {
    if (req.user && req.user.role === 'customer') {
        next();
    } else {
        // Returns 403 Forbidden if user does not have 'customer' role
        res.status(403).json({ message: 'Access denied: Customer role required' });
    }
};

const isBanker = (req, res, next) => {
    if (req.user && req.user.role === 'banker') {
        next();
    } else {
        // Returns 403 Forbidden if user does not have 'banker' role
        res.status(403).json({ message: 'Access denied: Banker role required' });
    }
};

// ... (exports) ...


module.exports = {
    registerToken,
    invalidateToken,
    verifyToken,
    isCustomer,
    isBanker,
};
