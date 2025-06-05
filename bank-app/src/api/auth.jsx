import axios from 'axios';

// IMPORTANT: This API_URL uses Vite's environment variable mechanism.
// For local development, it defaults to http://localhost:5000/api.
// For deployment (e.g., on Render), you set VITE_API_URL in Render's static site environment variables.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Handles user login by sending credentials to the backend.
 * @param {string} username - The user's username or email.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} - A promise that resolves to the login response data (e.g., accessToken, user info).
 * @throws {string} - Throws an error message if login fails.
 */
export const loginUser = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, {
            username,
            password
        });
        return response.data;
    } catch (error) {
        // Extract a user-friendly error message from the backend response
        throw error.response?.data?.message || 'Login failed';
    }
};
