const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const authMiddleware = require('../middleware/authMiddleware');

router.get(
    '/dashboard',
    authMiddleware.verifyToken,
    authMiddleware.isCustomer,
    customerController.getCustomerDashboard
);

router.post(
    '/deposit',
    authMiddleware.verifyToken,
    authMiddleware.isCustomer,
    customerController.deposit
);

router.post(
    '/withdraw',
    authMiddleware.verifyToken,
    authMiddleware.isCustomer,
    customerController.withdraw
);


router.put(
    '/profile',
    authMiddleware.verifyToken,
    authMiddleware.isCustomer,
    customerController.updateProfile
);

module.exports = router;
