import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './QuizList.css';

const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [falsePercentages, setFalsePercentages] = useState({});
    const [searchChapter, setSearchChapter] = useState('');
    const [filteredQuizzes, setFilteredQuizzes] = useState([]);

    useEffect(() => {
        fetch('http://localhost:1050/quizzes')
            .then(response => response.json())
            .then(data => {
                setQuizzes(data);
                setFilteredQuizzes(data); // Initialize with all quizzes
            })
            .catch(error => console.error('Error fetching quizzes:', error));
    }, []);

    useEffect(() => {
        // Filter quizzes based on searchChapter whenever it changes
        const searchLowerCase = searchChapter.toLowerCase();
        const filtered = quizzes.filter(quiz => {
            const chapter = quiz.Chapitre || ''; // Ensure Chapitre is defined
            return chapter.toLowerCase().includes(searchLowerCase);
        });
        setFilteredQuizzes(filtered);
    }, [searchChapter, quizzes]);

    const handleSearchChange = (event) => {
        setSearchChapter(event.target.value);
    };
    
    const handleDelete = (index, quizId) => {
        // Send DELETE request to the server
        fetch(`http://localhost:1050/quizzes/${quizId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                // Remove quiz from state only if server confirms successful deletion
                const updatedQuizzes = [...filteredQuizzes];
                updatedQuizzes.splice(index, 1);
                setFilteredQuizzes(updatedQuizzes);
                setQuizzes(updatedQuizzes); // Also update the original quizzes array
            } else {
                console.error('Failed to delete the quiz');
            }
        })
        .catch(error => console.error('Error deleting quiz:', error));
    };

    const calculateFalsePercentage = (id) => {
        fetch(`http://localhost:1050/quiz/chapter/${id}/false_percentage`)
            .then(response => response.json())
            .then(data => {
                if (data.false_percentage !== undefined) {
                    const newFalsePercentages = { ...falsePercentages, [id]: data.false_percentage };
                    setFalsePercentages(newFalsePercentages);
                } else {
                    console.error('Error fetching false percentage:', data.error);
                }
            })
            .catch(error => console.error(`Error fetching false percentage for quiz ${id}:`, error));
    };
    
    

    return (
        <div className="quiz-list">
            <h4>List of Quizzes</h4>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by chapter..."
                    value={searchChapter}
                    onChange={handleSearchChange}
                />
                <button onClick={() => { /* Trigger search based on input */ }}>
                    <span role="img" aria-label="Search">Search 🔍</span>
                </button>
            </div>
            <ul className="quiz-content">
                {filteredQuizzes.map((quiz, index) => (
                    <div key={index} className="quiz-card">
                        <h3 className="quiz-question">Quiz Subject: {quiz.Subject}</h3>
                        <p className="quiz-question">Question: {quiz.Question}</p>
                        <p className="quiz-info">Answers: {quiz.Reponses ? quiz.Reponses.join(', ') : 'No answers available'}</p>
                        <p className="quiz-info">Correct Answer: {quiz.Reponse_correcte}</p>
                        <p className="quiz-info">Chapter: {quiz.Chapitre}</p>
                        <div className="quiz-actions">
                            <button className="button calculate-btn" onClick={() => calculateFalsePercentage(quiz._id)}>
                                Calculate
                            </button>
                            {falsePercentages[quiz._id] !== undefined && (
                                <p>False Percentage: {falsePercentages[quiz._id]}%</p>
                            )}
                            <div className="buttons">
                                <Link to={`/enseignant/enseignant/EditQuizEnseignant/${quiz._id}`}>
                                    <button className="button edit-btn">
                                        <span role="img" aria-label="Edit">✏️</span>
                                    </button>
                                </Link>
                                <button className="button delete-btn" onClick={() => handleDelete(index, quiz._id)}>
                                     <span role="img" aria-label="Delete">🗑️</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default QuizList;
