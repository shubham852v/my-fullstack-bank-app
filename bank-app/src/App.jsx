import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext.jsx'; // Corrected import to .jsx
import LoginPage from './components/LoginPage.jsx'; // Corrected import to .jsx
import BankerAccountsPage from './components/BankerAccountsPage.jsx'; // Corrected import to .jsx
import BankerCustomerTransactionsPage from './components/BankerCustomerTransactionsPage.jsx'; // Corrected import to .jsx
import CustomerTransactionsPage from './components/CustomerTransactionsPage.jsx'; // Corrected import to .jsx
import WelcomePage from './components/WelcomePage.jsx'; // Corrected import to .jsx
import Footer from './components/Footer.jsx'; // Corrected import to .jsx

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
    // If not authenticated or role is unknown, redirect to login
    return <Navigate to="/login" replace />;
};


function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="flex flex-col min-h-screen"> {/* Flex column to push footer to bottom */}
                    <main className="flex-grow"> {/* Main content area grows to fill space */}
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
                    </main>
                    <Footer /> {/* Footer component rendered on all pages */}
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
