import React from 'react';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-4 sm:p-6">
            <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl text-center max-w-md w-full transform transition-all duration-300 hover:scale-105">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
                    Welcome to <span className="text-blue-600">SecureBank</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                    Your trusted partner for seamless banking solutions.
                </p>

                <div className="flex flex-col space-y-4">
                    <Link
                        to="/login"
                        className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                    >
                        Banker Login
                    </Link>
                    <Link
                        to="/login"
                        className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300"
                    >
                        Customer Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;
