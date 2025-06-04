import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext.jsx';
import LoginPage from './components/LoginPage.jsx';
import BankerAccountsPage from './components/BankerAccountsPage.jsx';
import BankerCustomerTransactionsPage from './components/BankerCustomerTransactionsPage.jsx';
import CustomerTransactionsPage from './components/CustomerTransactionsPage.jsx';
import WelcomePage from './components/WelcomePage.jsx'; // New: Import WelcomePage

// ProtectedRoute component to guard routes based on authentication and roles
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return <p className="text-center mt-8 text-gray-700">Loading user data...</p>;
    }

    if (!isAuthenticated) {
        // Not authenticated, redirect to login
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        // Authenticated but not authorized for this role
        alert("You do not have permission to view this page.");
        // Redirect to a suitable default based on their actual role if they are authenticated
        if (user?.role === 'customer') {
            return <Navigate to="/customer/transactions" replace />;
        } else if (user?.role === 'banker') {
            return <Navigate to="/banker/accounts" replace />;
        }
        return <Navigate to="/" replace />; // Fallback if role is unknown or not handled
    }

    return children; // Render the component if authenticated and authorized
};

// AuthRedirect component to handle redirection after successful login
// This will now be used by the WelcomePage to direct users to their dashboards
const AuthRedirect = () => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return <p className="text-center mt-8 text-gray-700">Loading...</p>;
    }

    if (isAuthenticated) {
        // If authenticated, redirect based on user role
        if (user?.role === 'customer') {
            return <Navigate to="/customer/transactions" replace />;
        } else if (user?.role === 'banker') {
            return <Navigate to="/banker/accounts" replace />;
        }
    }
    // If not authenticated or role is unknown, direct to the login page (from WelcomePage)
    return <Navigate to="/login" replace />;
};


function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* New: Starting page for role selection */}
                    <Route path="/" element={<WelcomePage />} />

                    {/* Public route for login */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* This route is now primarily for redirection AFTER login from LoginPage */}
                    <Route
                        path="/dashboard-redirect" // A new internal route for AuthRedirect
                        element={
                            <AuthRedirect />
                        }
                    />

                    {/* Banker Routes - Protected: only accessible by authenticated bankers */}
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

                    {/* Customer Routes - Protected: only accessible by authenticated customers */}
                    <Route
                        path="/customer/transactions"
                        element={
                            <ProtectedRoute allowedRoles={['customer']}>
                                <CustomerTransactionsPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Fallback route for any unmatched paths */}
                    <Route path="*" element={<h1 className="text-center text-3xl font-bold mt-12 text-gray-800">404 - Page Not Found</h1>} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
