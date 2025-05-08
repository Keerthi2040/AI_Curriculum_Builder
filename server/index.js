// server/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
    res.send('AI Curriculum Builder Backend Running 🚀');
});

// POST /generate-curriculum
app.post('/generate-curriculum', async (req, res) => {
    const { topic, pace, learningStyle, depth } = req.body;

    const planPrompt = `
Generate a detailed 14-day curriculum for learning "${topic}" with the following preferences:
- Pace: ${pace}
- Learning Style: ${learningStyle}
- Depth: ${depth}

Each day should start with "Day N:" followed by a brief explanation (4-6 lines) of the day's topic and include 2-3 relevant resources (links if possible). 

Don't include quizzes. Just return the curriculum as plain text.
`;

    try {
        const planResp = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'openai/gpt-3.5-turbo',
                messages: [{ role: 'user', content: planPrompt }]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://your-app.com/',
                    'X-Title': 'Curriculum Builder Bala'
                }
            }
        );

        const plan = planResp.data.choices[0]?.message?.content?.trim() || 'No plan generated.';
        const dayLines = plan.split(/\r?\n/).filter(line => /^Day \d+:/.test(line));

        const quizzes = [];

        for (let i = 0; i < dayLines.length; i++) {
            const line = dayLines[i];
            const quizPrompt = `Create 3 quiz questions that test the learner's understanding of:\n\n${line}\n\nReturn only a valid JSON array of questions.`;

            try {
                const quizResp = await axios.post(
                    'https://openrouter.ai/api/v1/chat/completions',
                    {
                        model: 'openai/gpt-3.5-turbo',
                        messages: [{ role: 'user', content: quizPrompt }]
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                            'Content-Type': 'application/json',
                            'HTTP-Referer': 'https://your-app.com/',
                            'X-Title': 'Curriculum Quiz Gen'
                        }
                    }
                );

                let questions = [];
                const text = quizResp.data.choices[0]?.message?.content || '';
                try {
                    questions = JSON.parse(text);
                } catch {
                    questions = text
                        .split(/\r?\n/)
                        .filter(l => l.trim())
                        .map(l => l.replace(/^\d+[\).\s]*/, '').trim());
                }

                quizzes.push({ day: i + 1, questions });
            } catch (quizErr) {
                console.error(`Quiz generation failed for day ${i + 1}:`, quizErr.message);
                quizzes.push({ day: i + 1, questions: [] });
            }
        }

        return res.json({ plan, quizzes });

    } catch (err) {
        console.error('Curriculum generation error:', err.response?.data || err.message);
        return res.status(500).json({
            plan: '⚠️ Failed to generate curriculum.',
            quizzes: [],
        });
    }
});

// POST /explain-question
app.post('/explain-question', async (req, res) => {
    const { question } = req.body;
    if (!question) return res.status(400).json({ answer: 'Question is required' });

    try {
        const explanationPrompt = `Explain this quiz question clearly:\n\n"${question}"`;

        const resp = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'openai/gpt-3.5-turbo',
                messages: [{ role: 'user', content: explanationPrompt }]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://your-app.com/',
                    'X-Title': 'Question Explanation'
                }
            }
        );

        const explanation = resp.data.choices[0]?.message?.content?.trim() || 'No explanation provided.';
        res.json({ answer: explanation });

    } catch (err) {
        console.error('Explanation error:', err.message);
        res.status(500).json({ answer: 'Error fetching explanation.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
