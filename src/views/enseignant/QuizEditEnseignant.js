import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Form, Button, FormControl } from 'react-bootstrap';
import './quizedit.css';

const QuizEdit = () => {
    const { id } = useParams(); // Get quiz ID from URL params
    const [formData, setFormData] = useState({
        ID: '',
        question: '',
        reponses: ['', '', '', ''], // Initialize with 4 empty responses
        reponse_correcte: '',
        chapitre: '',
    });

    useEffect(() => {
        fetch(`/quizzes/${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.ID) {
                    setFormData({
                        ID: data.ID,
                        question: data.question,
                        reponses: data.reponses || ['', '', '', ''], // Ensure reponses is an array of 4 elements
                        reponse_correcte: data.reponse_correcte,
                        chapitre: data.chapitre,
                    });
                } else {
                    console.error('Selected quiz not found');
                }
            })
            .catch(error => console.error('Error fetching quiz details:', error));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('reponse')) {
            const index = parseInt(name.replace('reponse', ''));
            const updatedReponses = [...formData.reponses];
            updatedReponses[index] = value;
            setFormData({ ...formData, reponses: updatedReponses });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleReset = () => {
        setFormData({
            ID: '',
            question: '',
            reponses: ['', '', '', ''],
            reponse_correcte: '',
            chapitre: '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://127.0.0.1:100/quiz/${formData.ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: formData.Question,
                    reponses: formData.Reponses,
                    reponse_correcte: formData.Reponse_correcte,
                    chapitre: formData.Chapitre,
                }),
            });
            if (response.ok) {
                console.log('Quiz updated successfully.');
                handleReset();
            } else {
                console.error('Error updating quiz.');
            }
        } catch (error) {
            console.error('Error during request:', error);
        }
    };

    return (
        <Container>
            <h4>Edit Quiz</h4>
            <hr />
            <Form onSubmit={handleSubmit} onReset={handleReset} className="quiz-form">
                <Form.Group className='quiz-label'>
                    <Form.Label className='quiz-label'>ID</Form.Label>
                    <FormControl type="text" id="ID" name="ID" value={formData.ID} onChange={handleChange} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Question</Form.Label>
                    <FormControl type="text" id="question" name="question" value={formData.question} onChange={handleChange} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Réponses</Form.Label>
                    {formData.reponses.map((reponse, index) => (
                        <FormControl
                            key={index}
                            type="text"
                            id={`reponse${index}`}
                            name={`reponse${index}`}
                            value={reponse}
                            onChange={handleChange}
                        />
                    ))}
                </Form.Group>
                <Form.Group>
                    <Form.Label>Réponse Correcte</Form.Label>
                    <FormControl type="text" id="reponse_correcte" name="reponse_correcte" value={formData.reponse_correcte} onChange={handleChange} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Chapitre</Form.Label>
                    <FormControl type="text" id="chapitre" name="chapitre" value={formData.chapitre} onChange={handleChange} />
                </Form.Group>
                <div className="button-group">
                    <Button type="submit">Submit ✔️</Button>
                    <Button type="reset">Cancel ❌</Button>
                </div>
            </Form>
        </Container>
    );
};

export default QuizEdit;
