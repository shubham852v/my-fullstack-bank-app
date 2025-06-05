import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-6 mt-auto"> {}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
                <p>&copy; {new Date().getFullYear()} Banking System. All rights reserved.</p>
                <p className="mt-2">Made by Shubham</p>
                <p>
                    Contact: <a href="mailto:vishwakarmashubham852@gmail.com" className="text-blue-400 hover:underline">vishwakarmashubham852@gmail.com</a>
                </p>
                <p>
                    LinkedIn: <a href="https://www.linkedin.com/in/iamshubhamv/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">iamshubhamv</a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
