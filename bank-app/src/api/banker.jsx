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
 * Fetches all customer accounts for the banker dashboard.
 * Requires banker authentication.
 * @returns {Promise<Array<object>>} - A promise that resolves to an array of customer account objects.
 * @throws {string} - Throws an error message if fetching accounts fails.
 */
export const getAllCustomerAccounts = async () => {
    try {
        const response = await axios.get(`${API_URL}/banker/accounts`, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch customer accounts';
    }
};

/**
 * Fetches transaction details for a specific customer, accessible by a banker.
 * Requires banker authentication.
 * @param {string} userId - The ID of the customer whose transactions are to be fetched.
 * @returns {Promise<object>} - A promise that resolves to an object containing customer, account, and transaction data.
 * @throws {string} - Throws an error message if fetching transactions fails.
 */
export const getCustomerTransactions = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/banker/accounts/${userId}/transactions`, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch customer transactions';
    }
};
