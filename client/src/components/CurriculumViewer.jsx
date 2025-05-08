import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';

const CurriculumViewer = ({ plan, quizzes }) => {
    const [completed, setCompleted] = useState({});
    const [notes, setNotes] = useState({});
    const [explanations, setExplanations] = useState({});

    // Load progress from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('curriculumData');
        if (saved) {
            const parsed = JSON.parse(saved);
            setCompleted(parsed.completed || {});
            setNotes(parsed.notes || {});
        }
    }, []);

    const days = plan
        .split(/\r?\n/)
        .filter(line => /^Day \d+:/.test(line))
        .map(line => ({
            day: parseInt(line.match(/^Day (\d+):/)[1], 10),
            content: line.replace(/^Day \d+:\s*/, '')
        }));

    const toggleDone = (day) => {
        setCompleted(prev => ({ ...prev, [day]: !prev[day] }));
    };

    const handleNoteChange = (day, value) => {
        setNotes(prev => ({ ...prev, [day]: value }));
    };

    const getExplanation = async (day, question) => {
        if (explanations[question]) return;

        try {
            const res = await fetch('http://localhost:5000/explain-question', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question })
            });
            const data = await res.json();
            setExplanations(prev => ({ ...prev, [question]: data.answer || 'No explanation found' }));
        } catch (err) {
            setExplanations(prev => ({ ...prev, [question]: 'Error fetching explanation' }));
        }
    };

    const saveProgress = () => {
        const data = JSON.stringify({ completed, notes });
        localStorage.setItem('curriculumData', data);
        alert('Progress saved!');
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        let y = 20;

        days.forEach(({ day, content }) => {
            doc.setFontSize(14);
            doc.text(`Day ${day}:`, 20, y);
            y += 8;
            doc.setFontSize(12);
            const lines = doc.splitTextToSize(content, 170);
            doc.text(lines, 20, y);
            y += lines.length * 7 + 4;

            const quiz = quizzes.find(q => q.day === day);
            if (quiz?.questions?.length) {
                doc.text('Quiz:', 20, y);
                y += 6;
                quiz.questions.forEach(qst => {
                    const qLines = doc.splitTextToSize(`- ${qst}`, 170);
                    doc.text(qLines, 25, y);
                    y += qLines.length * 7;
                });
                y += 4;
            }

            if (notes[day]) {
                const noteLines = doc.splitTextToSize(`Notes: ${notes[day]}`, 170);
                doc.text(noteLines, 20, y);
                y += noteLines.length * 7 + 4;
            }

            if (y > 270) {
                doc.addPage();
                y = 20;
            }
        });

        doc.save('Curriculum_Plan.pdf');
    };

    return (
        <div className="space-y-10">
            <div className="flex gap-4 justify-end">
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={exportPDF}>
                    Export PDF
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={saveProgress}>
                    Save Progress
                </button>
            </div>

            {days.map(({ day, content }) => (
                <div key={day} className="bg-white p-6 rounded shadow-md">
                    <h3 className="text-xl font-bold mb-2">Day {day}</h3>
                    <p className="mb-4 whitespace-pre-wrap">{content}</p>

                    {quizzes.find(q => q.day === day)?.questions?.length > 0 && (
                        <ul className="mb-4 list-disc list-inside space-y-2">
                            {quizzes.find(q => q.day === day).questions.map((qst, i) => (
                                <li key={i}>
                                    {qst}
                                    <button
                                        className="ml-3 text-blue-600 text-sm underline"
                                        onClick={() => getExplanation(day, qst)}
                                    >
                                        Explain
                                    </button>
                                    {explanations[qst] && (
                                        <div className="text-sm text-gray-700 mt-1 ml-5">{explanations[qst]}</div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}

                    <label className="block mb-2 text-sm font-medium">Personal Notes:</label>
                    <textarea
                        rows="3"
                        value={notes[day] || ''}
                        onChange={(e) => handleNoteChange(day, e.target.value)}
                        className="w-full border p-2 rounded mb-4"
                    />

                    <label className="inline-flex items-center gap-2">
                        <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-blue-600"
                            checked={!!completed[day]}
                            onChange={() => toggleDone(day)}
                        />
                        <span>Mark as done</span>
                    </label>
                </div>
            ))}
        </div>
    );
};

export default CurriculumViewer;
