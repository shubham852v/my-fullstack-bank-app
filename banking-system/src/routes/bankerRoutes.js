const express = require('express');
const router = express.Router();
const bankerController = require('../controllers/bankerController');
const authMiddleware = require('../middleware/authMiddleware');

router.get(
    '/accounts',
    authMiddleware.verifyToken,
    authMiddleware.isBanker,
    bankerController.getAllCustomerAccounts
);

router.get(
    '/accounts/:userId/transactions',
    authMiddleware.verifyToken,
    authMiddleware.isBanker,
    bankerController.getCustomerTransactions
);

// New: Route to update a user's details (username, email, password)
// Accessible by bankers to update any user.
router.put(
    '/users/:userId', // :userId is a URL parameter for the user to update
    authMiddleware.verifyToken,
    authMiddleware.isBanker, // Only bankers can use this route
    bankerController.updateUser
);

module.exports = router;
