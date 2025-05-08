// src/pages/HomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    const goToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Top Navigation Bar */}
            <header className="flex items-center justify-between p-6 border-b shadow-sm">
                <div className="text-2xl font-bold text-blue-700">AI Curriculum Builder</div>
                <button
                    onClick={goToLogin}
                    className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition duration-300"
                >
                    Login
                </button>
            </header>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
                <h1 className="text-4xl font-semibold text-gray-800 mb-4">
                    Personalized AI-Powered Learning Plans
                </h1>
                <p className="text-lg text-gray-600 max-w-xl mb-8">
                    Create custom learning paths based on your topic, pace, and style. Track your progress, take quizzes, and export to Notion or PDF.
                </p>
                <button
                    onClick={goToLogin}
                    className="bg-blue-600 text-white px-6 py-3 text-lg rounded hover:bg-blue-700 transition duration-300"
                >
                    Get Started
                </button>
            </main>
        </div>
    );
};

export default HomePage;
