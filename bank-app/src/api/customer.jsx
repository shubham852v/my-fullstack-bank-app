import axios from 'axios';

// This API_URL will be replaced by an environment variable during deployment
// For local development, it defaults to http://localhost:5000/api
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Retrieves the authorization headers including the access token from local storage.
 * @returns {object} - An object containing the Authorization header.
 */
const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
        headers: {
            // The backend expects the token directly in the Authorization header (no 'Bearer ' prefix)
            Authorization: `${token}`
        }
    };
};

/**
 * Fetches the customer's dashboard data, including account balance and transactions.
 * Requires customer authentication.
 * @returns {Promise<object>} - A promise that resolves to an object containing account and transaction data.
 * @throws {string} - Throws an error message if fetching dashboard data fails.
 */
export const getCustomerDashboard = async () => {
    try {
        const response = await axios.get(`${API_URL}/customer/dashboard`, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch customer dashboard data';
    }
};

/**
 * Sends a deposit request to the backend.
 * Requires customer authentication.
 * @param {number} amount - The amount to deposit.
 * @returns {Promise<object>} - A promise that resolves to the deposit response data (e.g., message, newBalance).
 * @throws {string} - Throws an error message if the deposit fails.
 */
export const depositAmount = async (amount) => {
    try {
        const response = await axios.post(`${API_URL}/customer/deposit`, { amount }, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Deposit failed';
    }
};

/**
 * Sends a withdrawal request to the backend.
 * Requires customer authentication.
 * @param {number} amount - The amount to withdraw.
 * @returns {Promise<object>} - A promise that resolves to the withdrawal response data (e.g., message, newBalance).
 * @throws {string} - Throws an error message if the withdrawal fails.
 */
export const withdrawAmount = async (amount) => {
    try {
        const response = await axios.post(`${API_URL}/customer/withdraw`, { amount }, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Withdrawal failed';
    }
};
