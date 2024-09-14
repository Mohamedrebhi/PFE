import React, { useState, useEffect } from 'react';

import './quizedit.css'
const QuizEdit = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [quizData, setQuizData] = useState({
        quizID: '',
        question: '',
        responses: ['', '', '', ''],
        correctResponse: '',
        chapterName: ''
    });

    useEffect(() => {
        if (quizData.quizID) {
            fetch('http://localhost:1050/quizzes/' + quizData.quizID)
                .then(response => response.json())
                .then(data => setQuizData({
                    ...data,
                    responses: data.responses || ['', '', '', '']
                }))
                .catch(error => console.error('Error fetching quiz data:', error));
        }
    }, [quizData.quizID]);

    const handleSearch = () => {
        fetch('http://localhost:1050/search_quizzes?question=' + searchTerm)
            .then(response => response.json())
            .then(data => setSearchResults(data))
            .catch(error => console.error('Error searching quizzes:', error));
    };

    const handleSelectQuiz = (quiz) => {
        setQuizData({
            quizID: quiz._id,
            question: quiz.question,
            responses: quiz.responses || ['', '', '', ''],
            correctResponse: quiz.correct_response,
            chapterName: quiz.chaptername
        });
        setSearchResults([]);
        setSearchTerm('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:1050/quizzes/' + quizData.quizID, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: quizData.question,
                responses: quizData.responses,
                correct_response: quizData.correctResponse,
                chaptername: quizData.chapterName
            })
        })
            .then(response => response.json())
            .then(data => alert('Quiz updated successfully'))
            .catch(error => console.error('Error updating quiz:', error));
    };

    const handleReset = () => {
        setQuizData({
            quizID: '',
            question: '',
            responses: ['', '', '', ''],
            correctResponse: '',
            chapterName: ''
        });
    };

    const handleResponseChange = (index, value) => {
        const updatedResponses = quizData.responses.map((r, i) => i === index ? value : r);
        setQuizData({ ...quizData, responses: updatedResponses });
    };

    return (
        <div className="quiz-edit-container">
            <h4>Edit Quiz</h4>
            <hr />

            <div className="search-bar">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for a quiz by question..."
                />
                <button type="button" onClick={handleSearch}>Search 🔍</button>
            </div>

            <ul className="search-results">
                {searchResults.map(quiz => (
                    <li key={quiz._id} onClick={() => handleSelectQuiz(quiz)}>
                        {quiz.question}
                    </li>
                ))}
            </ul>

            {quizData.quizID && (
                <form onSubmit={handleSubmit} onReset={handleReset} className="quiz-edit-form">
                    <label htmlFor="question">Question</label>
                    <input
                        type="text"
                        id="question"
                        name="question"
                        value={quizData.question}
                        onChange={(e) => setQuizData({ ...quizData, question: e.target.value })}
                        required
                    />

                    <label htmlFor="responses">Responses</label>
                    {quizData.responses.map((response, index) => (
                        <input
                            key={index}
                            type="text"
                            value={response}
                            onChange={(e) => handleResponseChange(index, e.target.value)}
                            placeholder={`Response ${index + 1}`}
                            required
                        />
                    ))}

                    <label htmlFor="correctResponse">Correct Answer</label>
                    <input
                        type="text"
                        id="correctResponse"
                        name="correctResponse"
                        value={quizData.correctResponse}
                        onChange={(e) => setQuizData({ ...quizData, correctResponse: e.target.value })}
                        required
                    />

                    <label htmlFor="chapterName">Chapter Name</label>
                    <input
                        type="text"
                        id="chapterName"
                        name="chapterName"
                        value={quizData.chapterName}
                        onChange={(e) => setQuizData({ ...quizData, chapterName: e.target.value })}
                        required
                    />

                    <div className="button-group">
                        <button type="submit">Submit ✔️</button>
                        <button type="reset">Cancel ❌</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default QuizEdit;
