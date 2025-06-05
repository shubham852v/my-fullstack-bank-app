import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCustomerTransactions } from '../api/banker';
import { useAuth } from '../AuthContext.jsx'; 

const BankerCustomerTransactionsPage = () => {
    const { userId } = useParams();
    const [customerData, setCustomerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user, logout } = useAuth();

    useEffect(() => {
        const fetchCustomerDetails = async () => {
            try {
                if (!user || user.role !== 'banker') {
                    alert("Unauthorized access. Please login as a banker.");
                    logout();
                    return;
                }

                const data = await getCustomerTransactions(userId);
                setCustomerData(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching customer details:", err);
                setError(err.message || String(err));
                setLoading(false);
                if (String(err).includes('Invalid or expired token') || String(err).includes('Access denied')) {
                     alert("Session expired or unauthorized. Please login again.");
                     logout();
                }
            }
        };

        if (user) {
             fetchCustomerDetails();
        }
    }, [userId, user, logout]);

    if (loading) return <p className="text-center mt-12 text-lg text-gray-700">Loading customer transactions...</p>;
    if (error) return <p className="text-center mt-12 text-lg text-red-600 font-semibold">Error: {error}</p>;
    if (!customerData) return <p className="text-center mt-12 text-lg text-gray-600">No customer data found.</p>;

    const { customer, account, transactions } = customerData;

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl my-8">
                <button
                    onClick={() => window.history.back()}
                    className="mb-6 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-5 rounded-lg text-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-300"
                >
                    Back to Accounts
                </button>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-6 text-center sm:text-left">Transaction History</h2>
                <div className="border border-blue-200 rounded-lg p-5 mb-8 bg-blue-50 shadow-md">
                    <p className="text-gray-700 text-lg mb-2"><strong className="font-semibold text-blue-800">Customer Name:</strong> {customer.username}</p>
                    <p className="text-gray-700 text-lg mb-2"><strong className="font-semibold text-blue-800">Email:</strong> {customer.email}</p>
                    <p className="text-gray-700 text-lg mb-2"><strong className="font-semibold text-blue-800">Account Number:</strong> <span className="font-mono">{account.accountNumber}</span></p>
                    <p className="text-gray-700 text-lg"><strong className="font-semibold text-blue-800">Current Balance:</strong> <span className="font-bold text-green-700">${account.balance ? account.balance.toFixed(2) : '0.00'}</span></p>
                </div>

                <h3 className="text-2xl font-semibold text-gray-700 mb-6">Transactions</h3>
                {transactions.length === 0 ? (
                    <p className="text-center text-gray-600 mt-8 text-lg py-10 border border-gray-200 rounded-lg bg-gray-50">No transactions found for this account.</p>
                ) : (
                    <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200">
                        <table className="min-w-full bg-white">
                            <thead className="bg-blue-100 border-b border-blue-200">
                                <tr>
                                    <th className="py-4 px-4 text-left text-sm font-bold text-blue-800 uppercase tracking-wider">Transaction ID</th>
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
        </div>
    );
};

export default BankerCustomerTransactionsPage;
