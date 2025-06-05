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

router.put(
    '/users/:userId',
    authMiddleware.verifyToken,
    authMiddleware.isBanker,
    bankerController.updateUser
);

module.exports = router;
