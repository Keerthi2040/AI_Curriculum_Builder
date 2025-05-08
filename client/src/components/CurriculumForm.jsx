// src/components/CurriculumForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const CurriculumForm = ({ onCurriculumGenerated }) => {
    const [formData, setFormData] = useState({
        topic: '',
        pace: '',
        learningStyle: '',
        depth: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Call your backend
            const { data } = await axios.post(
                'http://localhost:5000/generate-curriculum',
                formData
            );

            console.log('Full response:', data);

            // Forward both plan and quizzes to App.js
            onCurriculumGenerated({
                plan: data.plan,
                quizzes: data.quizzes,
            });
        } catch (error) {
            console.error('Error generating curriculum:', error);
            alert('Failed to generate curriculum.');
        }

        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
                Build Your Curriculum
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <input
                    type="text"
                    name="topic"
                    placeholder="Enter your topic (e.g., Python Programming)"
                    value={formData.topic}
                    onChange={handleChange}
                    className="border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />

                <select
                    name="pace"
                    value={formData.pace}
                    onChange={handleChange}
                    className="border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                >
                    <option value="">Select Pace</option>
                    <option value="2 weeks">2 weeks</option>
                    <option value="1 month">1 month</option>
                    <option value="3 months">3 months</option>
                </select>

                <select
                    name="learningStyle"
                    value={formData.learningStyle}
                    onChange={handleChange}
                    className="border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                >
                    <option value="">Select Learning Style</option>
                    <option value="Visual">Visual</option>
                    <option value="Text-based">Text-based</option>
                    <option value="Hands-on">Hands-on</option>
                </select>

                <select
                    name="depth"
                    value={formData.depth}
                    onChange={handleChange}
                    className="border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                >
                    <option value="">Select Depth</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                </select>

                <button
                    type="submit"
                    className="bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
                    disabled={loading}
                >
                    {loading ? 'Generating...' : 'Generate Curriculum'}
                </button>
            </form>
        </div>
    );
};

export default CurriculumForm;
