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

export const getCustomerDashboard = async () => {
    try {
        const response = await axios.get(`${API_URL}/customer/dashboard`, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch customer dashboard data';
    }
};

export const depositAmount = async (amount) => {
    try {
        const response = await axios.post(`${API_URL}/customer/deposit`, { amount }, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Deposit failed';
    }
};

export const withdrawAmount = async (amount) => {
    try {
        const response = await axios.post(`${API_URL}/customer/withdraw`, { amount }, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Withdrawal failed';
    }
};
