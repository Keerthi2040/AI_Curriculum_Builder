import React, { useState } from 'react';
import CurriculumForm from '../components/CurriculumForm';
import CurriculumViewer from '../components/CurriculumViewer';

const CurriculumPage = () => {
    const user = localStorage.getItem('user');
    const [plan, setPlan] = useState('');
    const [quizzes, setQuizzes] = useState([]);

    const handleGenerated = ({ plan, quizzes }) => {
        setPlan(plan);
        setQuizzes(quizzes || []);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <h1 className="text-2xl font-semibold text-center text-blue-700 mb-6">
                Welcome {user}, build your curriculum
            </h1>

            <CurriculumForm onCurriculumGenerated={handleGenerated} />

            {plan && (
                <div className="mt-10">
                    <CurriculumViewer plan={plan} quizzes={quizzes} />
                </div>
            )}
        </div>
    );
};

export default CurriculumPage;
