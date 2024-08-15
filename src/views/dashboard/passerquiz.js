import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

const QuizListPage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [submittedAnswers, setSubmittedAnswers] = useState([]);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(null);
    const [incorrectAnswers, setIncorrectAnswers] = useState([]);
    
    useEffect(() => {
        fetch('http://127.0.0.1:100/quizzes/random/20') // Fetch 20 random quizzes
            .then(response => response.json())
            .then(data => setQuizzes(data))
            .catch(error => console.error('Error fetching quizzes:', error));
    }, []);

    const handleAnswerChange = (quizId, selectedAnswer) => {
        // Update submitted answers in the state
        const updatedAnswers = submittedAnswers.filter(answer => answer.id !== quizId);
        setSubmittedAnswers([...updatedAnswers, { id: quizId, response: selectedAnswer }]);
    };

    const handleSubmit = () => {
        fetch('http://127.0.0.1:100/quizzes/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submittedAnswers),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Number of correct answers:', data.correct_answers_count);
            setCorrectAnswersCount(data.correct_answers_count);
            setIncorrectAnswers(data.incorrect_answers);
        })
        .catch(error => console.error('Error submitting quiz:', error));
    };

    return (
        <div className="quiz-list-container">
            <h2>Quiz</h2>
            {quizzes.map((quiz, index) => (
                <div key={index} className="quiz-item">
                    <h3>Question {index + 1}</h3>
                    <p>{quiz.Question}</p>
                    <div className="answers">
                        {(quiz.Reponses || []).map((reponse, idx) => (
                            <div key={idx}>
                                <input
                                    type="radio"
                                    id={`Reponse${idx}`}
                                    name={`quiz${index}`}
                                    value={reponse}
                                    onChange={() => handleAnswerChange(quiz._id, reponse)}
                                />
                                <label htmlFor={`Reponse${idx}`}>{reponse}</label>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            
            <Button onClick={handleSubmit}>Submit Quiz</Button>
            
            {correctAnswersCount !== null && (
                <div className="result">
                    <h3>Quiz Result</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Number of Correct Answers</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{correctAnswersCount}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {incorrectAnswers && incorrectAnswers.length > 0 && (
                <div className="incorrect-answers">
                    <h3>Incorrect Answers</h3>
                    <ul>
                        {incorrectAnswers.map((answer, index) => (
                            <li key={index}>
                                <p>Question: {answer.question}</p>
                                <p>Submitted Answer: {answer.submitted_response}</p>
                                
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default QuizListPage;
