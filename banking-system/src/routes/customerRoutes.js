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

// New: Route for a customer to update their own profile
router.put(
    '/profile', // No :userId parameter, as it updates the authenticated user's profile
    authMiddleware.verifyToken,
    authMiddleware.isCustomer, // Only customers can use this route
    customerController.updateProfile
);

module.exports = router;
