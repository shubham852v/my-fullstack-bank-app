import React, { useEffect, useState } from 'react';
import { getCustomerDashboard, depositAmount, withdrawAmount } from '../api/customer';
import { useAuth } from '../AuthContext.jsx'; 
import { useNavigate } from 'react-router-dom';

const CustomerTransactionsPage = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [transactionType, setTransactionType] = useState('');
    const [amount, setAmount] = useState('');
    const [popupMessage, setPopupMessage] = useState('');

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const fetchDashboardData = async () => {
        try {
            if (!user || user.role !== 'customer') {
                alert("Unauthorized access. Please login as a customer.");
                logout();
                navigate('/login');
                return;
            }
            const data = await getCustomerDashboard();
            setDashboardData(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching customer dashboard:", err);
            setError(err.message || String(err));
            setLoading(false);
            if (String(err).includes('Invalid or expired token') || String(err).includes('Access denied')) {
                 alert("Session expired or unauthorized. Please login again.");
                 logout();
            }
        }
    };

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user, logout, navigate]);

    const handleTransaction = async () => {
        setPopupMessage('');
        if (isNaN(amount) || parseFloat(amount) <= 0) {
            setPopupMessage('Please enter a valid positive amount.');
            return;
        }

        try {
            let response;
            if (transactionType === 'deposit') {
                response = await depositAmount(parseFloat(amount));
            } else if (transactionType === 'withdrawal') {
                response = await withdrawAmount(parseFloat(amount));
            }
            setPopupMessage(response.message);
            setAmount('');
            fetchDashboardData();
            setTimeout(() => setShowPopup(false), 1500);
        } catch (err) {
            setPopupMessage(err.message || String(err)); // Ensure error is a string
        }
    };

    const openPopup = (type) => {
        setTransactionType(type);
        setAmount('');
        setPopupMessage('');
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        setAmount('');
        setPopupMessage('');
    };

    if (loading) return <p className="text-center mt-12 text-lg text-gray-700">Loading your dashboard...</p>;
    if (error) return <p className="text-center mt-12 text-lg text-red-600 font-semibold">Error: {error}</p>;
    if (!dashboardData) return <p className="text-center mt-12 text-lg text-gray-600">No account data found.</p>;
    if (!user || user.role !== 'customer') return null;

    const { account, transactions } = dashboardData;

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-5xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl my-8">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 text-center sm:text-left">Welcome, {user.username}!</h2>
                    <button
                        onClick={logout}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg text-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-red-300"
                    >
                        Logout
                    </button>
                </div>

                <div className="text-center my-8 p-6 sm:p-8 bg-blue-50 rounded-xl border border-blue-200 shadow-md">
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">Available Balance:</h3>
                    <p className="text-4xl sm:text-5xl font-extrabold text-blue-700 mb-6">
                        {typeof account.balance === 'number' ? `$${account.balance.toFixed(2)}` : 'N/A'}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-4">
                        <button
                            onClick={() => openPopup('deposit')}
                            className="py-3 px-8 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-lg sm:text-xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300"
                        >
                            Deposit
                        </button>
                        <button
                            onClick={() => openPopup('withdrawal')}
                            className="py-3 px-8 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold rounded-lg text-lg sm:text-xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-amber-300"
                        >
                            Withdraw
                        </button>
                    </div>
                </div>

                <h3 className="text-2xl font-semibold text-gray-700 mb-6">Your Transactions</h3>
                {transactions.length === 0 ? (
                    <p className="text-center text-gray-600 mt-8 text-lg py-10 border border-gray-200 rounded-lg bg-gray-50">No transactions yet.</p>
                ) : (
                    <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200">
                        <table className="min-w-full bg-white">
                            <thead className="bg-blue-100 border-b border-blue-200">
                                <tr>
                                    <th className="py-4 px-4 text-left text-sm font-bold text-blue-800 uppercase tracking-wider">ID</th>
                                    <th className="py-4 px-4 text-left text-sm font-bold text-blue-800 uppercase tracking-wider">Type</th>
                                    <th className="py-4 px-4 text-left text-sm font-bold text-blue-800 uppercase tracking-wider">Amount</th>
                                    <th className="py-4 px-4 text-left text-sm font-bold text-blue-800 uppercase tracking-wider">Date & Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx) => (
                                    <tr key={tx.transaction_id} className="border-b border-gray-100 hover:bg-gray-50 transition duration-150 ease-in-out">
                                        <td className="py-3 px-4 text-gray-700 font-mono">{tx.transaction_id}</td>
                                        <td className="py-3 px-4">
                                            <span className={`font-bold ${tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                                                {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-800 font-semibold">
                                            {typeof tx.amount === 'number' ? `$${tx.amount.toFixed(2)}` : 'N/A'}
                                        </td>
                                        <td className="py-3 px-4 text-gray-700">{new Date(tx.timestamp).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-sm w-full flex flex-col gap-6 transform transition-all duration-300 scale-100">
                        <h3 className="text-2xl font-bold text-gray-800">{transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}</h3>
                        <p className="text-gray-700 text-lg">Current Balance: <span className="font-semibold text-blue-700">${account.balance ? account.balance.toFixed(2) : '0.00'}</span></p>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            min="0.01"
                            step="0.01"
                            className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                        />
                        {popupMessage && <p className="text-red-600 text-sm font-medium -mt-2">{popupMessage}</p>}
                        <div className="flex justify-center gap-4 mt-4">
                            <button
                                onClick={handleTransaction}
                                className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={closePopup}
                                className="py-2 px-6 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerTransactionsPage;
