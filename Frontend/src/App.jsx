import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext.jsx';
import LoginPage from './components/LoginPage.jsx';
import BankerAccountsPage from './components/BankerAccountsPage.jsx';
import BankerCustomerTransactionsPage from './components/BankerCustomerTransactionsPage.jsx';
import CustomerTransactionsPage from './components/CustomerTransactionsPage.jsx';
import WelcomePage from './components/WelcomePage.jsx';
import Footer from './components/Footer.jsx';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return <p className="text-center mt-8 text-gray-700">Loading user data...</p>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        alert("You do not have permission to view this page.");
        if (user?.role === 'customer') {
            return <Navigate to="/customer/transactions" replace />;
        } else if (user?.role === 'banker') {
            return <Navigate to="/banker/accounts" replace />;
        }
        return <Navigate to="/" replace />;
    }

    return children;
};

const AuthRedirect = () => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return <p className="text-center mt-8 text-gray-700">Loading...</p>;
    }

    if (isAuthenticated) {
        if (user?.role === 'customer') {
            return <Navigate to="/customer/transactions" replace />;
        } else if (user?.role === 'banker') {
            return <Navigate to="/banker/accounts" replace />;
        }
    }
    return <Navigate to="/login" replace />;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="flex flex-col min-h-screen">
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/" element={<WelcomePage />} />

                            <Route path="/login" element={<LoginPage />} />

                            <Route
                                path="/dashboard-redirect"
                                element={
                                    <AuthRedirect />
                                }
                            />

                            <Route
                                path="/banker/accounts"
                                element={
                                    <ProtectedRoute allowedRoles={['banker']}>
                                        <BankerAccountsPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/banker/accounts/:userId/transactions"
                                element={
                                    <ProtectedRoute allowedRoles={['banker']}>
                                        <BankerCustomerTransactionsPage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/customer/transactions"
                                element={
                                    <ProtectedRoute allowedRoles={['customer']}>
                                        <CustomerTransactionsPage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route path="*" element={<h1 className="text-center text-3xl font-bold mt-12 text-gray-800">404 - Page Not Found</h1>} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
