import React, { useState, useEffect } from 'react';
import './quizedit.css'


const QuizEdit = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [quizData, setQuizData] = useState(null); // Store quiz data as an object

    // Fetch quiz data when quizID is set
    useEffect(() => {
        if (quizData && quizData.quizID) {
            fetch(`http://localhost:1050/quizzes/${quizData.quizID}`)
                .then(response => response.json())
                .then(data => setQuizData({
                    ...data,
                    responses: data.responses || ['', '', '', '']
                }))
                .catch(error => console.error('Error fetching quiz data:', error));
        }
    }, [quizData?.quizID]);

    // Handle search operation
    const handleSearch = () => {
        fetch(`http://localhost:1050/search_quizzes?chaptername=${encodeURIComponent(searchTerm)}`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setSearchResults(data);
                } else {
                    console.error('Unexpected response format:', data);
                }
            })
            .catch(error => console.error('Error searching quizzes:', error));
    };

    // Select quiz from search results
    const handleSelectQuiz = (quiz) => {
        setQuizData({
            quizID: quiz._id,
            question: quiz.question,
            responses: quiz.responses || ['', '', '', ''],
            correctResponse: quiz.correct_response,
            chapterName: quiz.chaptername
        });
        setSearchResults([]); // Clear search results after selection
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submit clicked');
        
        if (quizData && quizData.quizID) {
            fetch(`http://localhost:1050/quizzes/update/${quizData.quizID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: quizData.question,
                    responses: quizData.responses,
                    correct_response: quizData.correctResponse,
                    chaptername: quizData.chapterName
                })
            })
            .then(response => {
                console.log('Response Status:', response.status);
                if (response.ok) {
                    return response.json();
                } else {
                    return response.text().then(text => {throw new Error(text)});
                }
            })
            .then(data => {
                console.log('Update response data:', data);
                alert('Quiz updated successfully');
            })
            .then(data => {
                alert('Quiz updated successfully');
                // Optionally, refresh the quiz data
                fetch(`http://localhost:1050/quizzes/${quizData.quizID}`)
                    .then(response => response.json())
                    .then(data => setQuizData(data))
                    .catch(error => console.error('Error fetching updated quiz data:', error));
            })
            
            .catch(error => {
                console.error('Error updating quiz:', error);
                alert('Failed to update quiz. Check console for details.');
            });
        }
    };
    
    
    // Handle reset operation
    const handleReset = () => {
        setQuizData(null); // Clear quiz data
    };

    // Handle response change
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
                    placeholder="Search for quizzes by chapter name..."
                />
                <button type="button" onClick={handleSearch}>Search 🔍</button>
            </div>

            <ul className="search-results">
                {searchResults.length > 0 ? (
                    searchResults.map(quiz => (
                        <li key={quiz._id} onClick={() => handleSelectQuiz(quiz)}>
                            <strong>Question:</strong> {quiz.question}
                            <br />
                            <strong>Responses:</strong>
                            <ul>
                                {quiz.responses.map((response, index) => (
                                    <li key={index}>{response}</li>
                                ))}
                            </ul>
                            <strong>Correct Response:</strong> {quiz.correct_response}
                            <br />
                            <strong>Chapter:</strong> {quiz.chaptername}
                        </li>
                    ))
                ) : (
                    <li></li>
                )}
            </ul>

            {quizData && (
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
                        <button type="submit">Save ✔️</button>
                        <button type="reset">Reset ❌</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default QuizEdit;
