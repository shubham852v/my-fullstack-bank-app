import React, { useEffect, useState } from 'react';
import { getAllCustomerAccounts } from '../api/banker';
import { useAuth } from '../AuthContext.jsx';
import { Link } from 'react-router-dom';

const BankerAccountsPage = () => {
    const [accounts, setAccounts] = useState([]);
    const [loadingAccounts, setLoadingAccounts] = useState(true);
    const [error, setError] = useState('');
    const { user, logout, loading: authLoading } = useAuth();

    useEffect(() => {
        console.log("BankerAccountsPage: useEffect triggered. Auth Loading:", authLoading, "User:", user);

        const fetchAccounts = async () => {
            try {
                if (!user || user.role !== 'banker') {
                    console.log("BankerAccountsPage: User is not a banker or not logged in. This should ideally be caught by ProtectedRoute.");
                    setLoadingAccounts(false);
                    return;
                }
                console.log("BankerAccountsPage: Attempting to fetch customer accounts for user:", user.username);
                const data = await getAllCustomerAccounts();
                console.log("BankerAccountsPage: Fetched data:", data);
                setAccounts(data);
                setLoadingAccounts(false);
                setError('');
            } catch (err) {
                console.error("BankerAccountsPage: Error fetching accounts:", err);
                setError(err.message || String(err));
                setLoadingAccounts(false);
                if (String(err).includes('Invalid or expired token') || String(err).includes('Access denied')) {
                     alert("Session expired or unauthorized. Please login again.");
                     logout();
                }
            }
        };

        if (!authLoading && user) {
            fetchAccounts();
        } else if (!authLoading && !user) {
            console.log("BankerAccountsPage: AuthContext finished loading, but no user. ProtectedRoute should redirect.");
        }

    }, [user, logout, authLoading]);

    if (loadingAccounts) return <p className="text-center mt-12 text-lg text-gray-700">Loading customer accounts...</p>;
    if (error) return <p className="text-center mt-12 text-lg text-red-600 font-semibold">Error: {error}</p>;

    if (!user || user.role !== 'banker') {
        console.log("BankerAccountsPage: Not rendering content as user is not a banker after all checks.");
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-6xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl my-8">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 text-center sm:text-left">Banker Dashboard</h2>
                    <button
                        onClick={logout}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg text-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-red-300"
                    >
                        Logout
                    </button>
                </div>

                <h3 className="text-2xl font-semibold text-gray-700 mb-6">All Customer Accounts</h3>

                {accounts.length === 0 ? (
                    <p className="text-center text-gray-600 mt-8 text-lg py-10 border border-gray-200 rounded-lg bg-gray-50">No customer accounts found.</p>
                ) : (
                    <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200">
                        <table className="min-w-full bg-white">
                            <thead className="bg-blue-100 border-b border-blue-200">
                                <tr>
                                    <th className="py-4 px-4 text-left text-sm font-bold text-blue-800 uppercase tracking-wider">Customer Name</th>
                                    <th className="py-4 px-4 text-left text-sm font-bold text-blue-800 uppercase tracking-wider">Email</th>
                                    <th className="py-4 px-4 text-left text-sm font-bold text-blue-800 uppercase tracking-wider">Account Number</th>
                                    <th className="py-4 px-4 text-left text-sm font-bold text-blue-800 uppercase tracking-wider">Balance</th>
                                    <th className="py-4 px-4 text-left text-sm font-bold text-blue-800 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accounts.map((account) => (
                                    <tr key={account.account_id} className="border-b border-gray-100 hover:bg-gray-50 transition duration-150 ease-in-out">
                                        <td className="py-3 px-4 text-gray-800 font-medium">{account.username}</td>
                                        <td className="py-3 px-4 text-gray-700">{account.email}</td>
                                        <td className="py-3 px-4 text-gray-700 font-mono">{account.account_number}</td>
                                        <td className="py-3 px-4 text-gray-800 font-semibold">
                                            {typeof account.balance === 'number' ? `$${account.balance.toFixed(2)}` : 'N/A'}
                                        </td>
                                        <td className="py-3 px-4">
                                            <Link
                                                to={`/banker/accounts/${account.user_id}/transactions`}
                                                className="text-blue-600 hover:text-blue-800 font-semibold transition duration-200 ease-in-out hover:underline"
                                            >
                                                View Transactions
                                            </Link>
                                        </td>
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

export default BankerAccountsPage;
