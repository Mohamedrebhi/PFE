import React, { useState, useEffect } from 'react';
import './ExamAdd.css';

const ExamEdit = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [examData, setExamData] = useState({
        examID: '',
        professorID: '',
        Name: '',
        subject: '',
        duration: '',
        selectedQuizzes: [],
        additionalQuestions: [],
        examenDate: '',
        maxScore: 0,
        content: ''
    });

    useEffect(() => {
        if (examData.examID) {
            fetch('http://localhost:800/examens/' + examData.examID)
                .then(response => response.json())
                .then(data => setExamData({
                    ...data,
                    examenDate: new Date(data.examenDate).toISOString().split('T')[0]
                }))
                .catch(error => console.error('Error fetching exam data:', error));
        }
    }, [examData.examID]);

    const handleSearch = () => {
        fetch('http://localhost:800/search_examens?name=' + searchTerm)
            .then(response => response.json())
            .then(data => setSearchResults(data))
            .catch(error => console.error('Error searching exams:', error));
    };

    const handleSelectExam = (exam) => {
        setExamData({
            examID: exam._id,
            professorID: exam.professorID,
            Name: exam.name,
            subject: exam.subject,
            duration: exam.duration,
            selectedQuizzes: exam.selectedQuizzes || [],
            additionalQuestions: exam.additionalQuestions || [],
            examenDate: new Date(exam.examenDate).toISOString().split('T')[0],
            maxScore: exam.maxScore,
            content: exam.content || ''
        });
        setSearchResults([]);
        setSearchTerm('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:800/examens/' + examData.examID, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(examData)
        })
            .then(response => response.json())
            .then(data => alert('Exam updated successfully'))
            .catch(error => console.error('Error updating exam:', error));
    };

    const handleReset = () => {
        setExamData({
            examID: '',
            professorID: '',
            Name: '',
            subject: '',
            duration: '',
            selectedQuizzes: [],
            additionalQuestions: [],
            examenDate: '',
            maxScore: 0,
            content: ''
        });
    };

    const handleDeleteQuestion = (questionIndex) => {
        const updatedQuestions = examData.additionalQuestions.filter((_, index) => index !== questionIndex);
        setExamData({ ...examData, additionalQuestions: updatedQuestions });
    };

    const handleAddQuestion = () => {
        setExamData({
            ...examData,
            additionalQuestions: [
                ...examData.additionalQuestions,
                { question: '', responses: ['', '','',''], correct: '' }
            ]
        });
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = examData.additionalQuestions.map((q, i) => i === index ? { ...q, [field]: value } : q);
        setExamData({ ...examData, additionalQuestions: updatedQuestions });
    };

    const handleResponseChange = (questionIndex, responseIndex, value) => {
        const updatedQuestions = examData.additionalQuestions.map((q, i) => 
            i === questionIndex ? {
                ...q,
                responses: q.responses.map((r, j) => j === responseIndex ? value : r)
            } : q
        );
        setExamData({ ...examData, additionalQuestions: updatedQuestions });
    };

    return (
        <div className="exam-edit-container">
            <h4>Edit Exam</h4>
            <hr />

            <div className="search-bar">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for an exam by name..."
                />
                <button type="button" onClick={handleSearch}>Search 🔍</button>
            </div>

            <ul className="search-results">
                {searchResults.map(exam => (
                    <li key={exam._id} onClick={() => handleSelectExam(exam)}>
                        {exam.Name}
                    </li>
                ))}
            </ul>

            {examData.examID && (
                <form onSubmit={handleSubmit} onReset={handleReset} className="exam-edit-form">
                    <label htmlFor="professorID">Professor ID</label>
                    <input
                        type="text"
                        id="professorID"
                        name="professorID"
                        value={examData.professorID}
                        onChange={(e) => setExamData({ ...examData, professorID: e.target.value })}
                        required
                    />

                    <label htmlFor="name">Exam Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={examData.Name}
                        onChange={(e) => setExamData({ ...examData, Name: e.target.value })}
                        required
                    />

                    <label htmlFor="subject">Subject</label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={examData.subject}
                        onChange={(e) => setExamData({ ...examData, subject: e.target.value })}
                        required
                    />

                    <label htmlFor="duration">Duration (minutes)</label>
                    <input
                        type="number"
                        id="duration"
                        name="duration"
                        value={examData.duration}
                        onChange={(e) => setExamData({ ...examData, duration: e.target.value })}
                        required
                    />

                    <label htmlFor="examDate">Exam Date</label>
                    <input
                        type="date"
                        id="examDate"
                        name="examDate"
                        value={examData.examenDate}
                        onChange={(e) => setExamData({ ...examData, examenDate: e.target.value })}
                        required
                    />

                    <label htmlFor="maxScore">Max Score</label>
                    <input
                        type="number"
                        id="maxScore"
                        name="maxScore"
                        value={examData.maxScore}
                        onChange={(e) => setExamData({ ...examData, maxScore: e.target.value })}
                        required
                    />

                    <label htmlFor="selectedQuizzes">Selected Quizzes</label>
                    <ul>
                        {examData.selectedQuizzes.map((quiz, index) => (
                            <li key={index}>{quiz}</li>
                        ))}
                    </ul>

                    <div className="question-list">
                        <h5>Exam Questions</h5>
                        {examData.additionalQuestions.map((question, index) => (
                            <div key={index} className="question-item">
                                <label>Question</label>
                                <input
                                    type="text"
                                    value={question.question}
                                    onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                                />

                                <label>Responses</label>
                                {question.responses.map((response, responseIndex) => (
                                    <input
                                        key={responseIndex}
                                        type="text"
                                        value={response}
                                        onChange={(e) => handleResponseChange(index, responseIndex, e.target.value)}
                                    />
                                ))}

                                <label>Correct Answer</label>
                                <input
                                    type="text"
                                    value={question.correct}
                                    onChange={(e) => handleQuestionChange(index, 'correct', e.target.value)}
                                />

                                <button type="button" onClick={() => handleDeleteQuestion(index)}>Delete</button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddQuestion}>Add Question</button>
                    </div>

                    <div className="button-group">
                        <button type="submit">Submit ✔️</button>
                        <button type="reset">Cancel ❌</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ExamEdit;
