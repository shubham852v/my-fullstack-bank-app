import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
        headers: {
            Authorization: `${token}`
        }
    };
};

export const getAllCustomerAccounts = async () => {
    try {
        const response = await axios.get(`${API_URL}/banker/accounts`, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch customer accounts';
    }
};

export const getCustomerTransactions = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/banker/accounts/${userId}/transactions`, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch customer transactions';
    }
};
