import React, { useState, useEffect } from 'react';
import './ExamAdd.css';

const ExamEdit = () => {
    const [examData, setExamData] = useState({
        examID: '',
        courseID: '',
        examDate: '',
        duration: '',
        questions: []
    });

    useEffect(() => {
        // Récupérer les données de l'examen depuis l'API
        fetch('/exam/' + examData.examID)
            .then(response => response.json())
            .then(data => setExamData(data))
            .catch(error => console.error('Error fetching exam data:', error));
    }, [examData.examID]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Envoyer les données modifiées de l'examen à l'API
        console.log('Updated Exam Data:', examData);
    };

    const handleReset = () => {
        // Réinitialiser le formulaire
        setExamData({
            examID: '',
            courseID: '',
            examDate: '',
            duration: '',
            questions: []
        });
    };

    const handleDeleteQuiz = (questionId) => {
        // Logique pour supprimer un quiz de l'examen
        console.log('Deleting Quiz...');
        const updatedQuestions = examData.questions.filter(question => question.id !== questionId);
        setExamData({ ...examData, questions: updatedQuestions });
    };

    return (
        <div className="exam-edit-container">
            <h4>Edit Exam</h4>
            <hr />
            <form onSubmit={handleSubmit} onReset={handleReset} className="exam-edit-form">
                <label htmlFor="examDate">Exam Date</label>
                <input type="date" id="examDate" name="examDate" value={examData.examDate} onChange={(e) => setExamData({ ...examData, examDate: e.target.value })} required />

                <label htmlFor="duration">Duration</label>
                <input type="text" id="duration" name="duration" value={examData.duration} onChange={(e) => setExamData({ ...examData, duration: e.target.value })} required />

                <div className="question-list">
                    <h5>Exam Questions</h5>
                    {examData.questions.map(question => (
                        <div key={question.id}>
                            <p>{question.question}</p>
                            <button type="button" onClick={() => handleDeleteQuiz(question.id)}>Delete</button>
                        </div>
                    ))}
                </div>

                <div className="button-group">
                    <button type="submit">Submit ✔️</button>
                    <button type="reset">Cancel ❌</button>
                </div>
            </form>
        </div>
    );
};

export default ExamEdit;
