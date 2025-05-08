// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Adjust if needed

const LoginPage = () => {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (name.trim()) {
            localStorage.setItem('user', name.trim());
            navigate('/curriculum'); // go to curriculum directly
        } else {
            alert('Please enter your name');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
            <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md text-center">
                {/* Logo */}
                <img src={logo} alt="Logo" className="mx-auto w-24 h-24 mb-4" />

                {/* Tagline */}
                <h1 className="text-xl font-semibold text-gray-700 mb-2">AI Curriculum Builder</h1>
                <p className="text-sm text-gray-500 mb-6">Learn smarter. Learn faster. Personalized for you.</p>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        Continue
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
