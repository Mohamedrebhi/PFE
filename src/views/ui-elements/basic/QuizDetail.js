import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './QuizList.css';

const QuizDetail = () => {
    const { ProfessorID } = useParams(); // Récupération de l'identifiant du professeur
    const [quizz, setQuizz] = useState([]); // État pour stocker les quiz
    const [error, setError] = useState(null); // État pour les erreurs
    const [isLoading, setIsLoading] = useState(true); // État pour indiquer le chargement

    useEffect(() => {
        const fetchQuizzes = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Vérification de l'ID du professeur avant de faire la requête
                if (!ProfessorID) {
                    throw new Error('Professor ID is undefined');
                }

                const response = await fetch(`http://localhost:1050/quizzes`);
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                // Déclarer la variable data avant de l'utiliser
                const data = await response.json();

                // Afficher les données après leur initialisation
                console.log("Fetched quizzes:", data);

                setQuizz(data);
            } catch (err) {
                console.error('Error fetching quizzes:', err);
                setError(`An error occurred: ${err.message}`);
            }

            setIsLoading(false);
        };

        fetchQuizzes(); // Appel de la fonction pour récupérer les quiz
    }, [ProfessorID]);

    return (
        <div className="quiz-list">
            {isLoading ? (
                <p className="loading-text">Loading...</p>
            ) : error ? (
                <p className="error-text">{error}</p>
            ) : quizz.length > 0 ? (
                <div className="quiz-content">
                    {quizz.map((quiz) => (
                        <div className='quiz-card' key={quiz._id}> {/* Utilisation d'un identifiant unique */}
                            <h3 className="quiz-question">Quiz sujet: {quiz.Subject}</h3>
                            <p className="quiz-info">Chapitre: {quiz.Chapitre}</p>
                            <h3 className="quiz-question">{quiz.Question}</h3>
                            <ul className="quiz-answers">
                                {quiz.Reponses.map((reponse, index) => (
                                    <li key={index}>{reponse}</li>
                                ))}
                            </ul>
                            <p className="quiz-info">Réponse correcte: {quiz.Reponse_correcte}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-data-text">No quizzes found</p>
            )}
        </div>
    );
};

export default QuizDetail;
