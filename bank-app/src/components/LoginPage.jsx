import React, { useState } from 'react';
import { useAuth } from '../AuthContext.jsx'; // Corrected import to .jsx
import { loginUser } from '../api/auth';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await loginUser(username, password);
            login(data.user, data.accessToken);
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 p-4 sm:p-6">
            <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl text-center max-w-md w-full transform transition-all duration-300 hover:scale-105">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-8">Login to Your Account</h2>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
                    <div className="text-left">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Username/Email:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-800"
                            placeholder="Enter your username or email"
                        />
                    </div>
                    <div className="text-left">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-800"
                            placeholder="Enter your password"
                        />
                    </div>
                    {error && <p className="text-red-600 text-sm mt-4 font-medium">{error}</p>}
                    <button
                        type="submit"
                        className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
