import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const QuizAdd = () => {
  const [formData, setFormData] = useState({
    question: '',
    reponses: ['', '', '', ''],
    reponse_correcte: '',
    chapitre: '',
  });

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    if (name === 'reponses') {
      const updatedReponses = [...formData.reponses];
      updatedReponses[index] = value;
      setFormData({ ...formData, reponses: updatedReponses });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRecommend = async () => {
    if (formData.chapitre) {
      try {
        const response = await fetch('http://localhost:4002/recomand', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ chapitre: formData.chapitre }),
        });

        if (response.ok) {
          const data = await response.json();
          setFormData({
            ...formData,
            question: data.question || '',
            reponses: data.reponses || ['', '', '', ''],
            reponse_correcte: data.reponse_correcte || '',
            chapitre: data.chapitre || formData.chapitre,
          });
        } else {
          console.error('Error fetching recommendations:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    } else {
      alert('Please fill in the chapter name.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:1050/save_quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: formData.question,
          responses: formData.reponses,
          correct_response: formData.reponse_correcte,
          chaptername: formData.chapitre,
        }),
      });

      if (response.ok) {
        alert('Quiz added successfully');
        setFormData({
          question: '',
          reponses: ['', '', '', ''],
          reponse_correcte: '',
          chapitre: '',
        });
      } else {
        console.error('Error adding quiz:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding quiz:', error);
    }
  };

  const handleOpenStreamlit = () => {
    window.open('http://localhost:8501', '_blank');
  };

  return (
    <Container>
      <h4>Question Add</h4>
      <hr />
      <Form onSubmit={handleSubmit} className="quiz-form">
        <Form.Group>
          <Form.Label>Question</Form.Label>
          <Form.Control
            type="text"
            name="question"
            value={formData.question}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Réponses</Form.Label>
          {formData.reponses.map((reponse, index) => (
            <Form.Control
              key={index}
              type="text"
              name="reponses"
              value={reponse} // Corrected from `reponses` to `reponse`
              onChange={(e) => handleChange(e, index)}
              required
            />
          ))}
        </Form.Group>
        <Form.Group>
          <Form.Label>Réponse Correcte</Form.Label>
          <Form.Control
            type="text"
            name="reponse_correcte"
            value={formData.reponse_correcte}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Chapitre</Form.Label>
          <Form.Control
            type="text"
            name="chapitre"
            value={formData.chapitre}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <div className="button-group">
          <Button variant="primary" type="submit">
            Submit ✔️
          </Button>
          <Button
            variant="secondary"
            type="reset"
            onClick={() =>
              setFormData({
                question: '',
                reponses: ['', '', '', ''],
                reponse_correcte: '',
                chapitre: '',
              })
            }
          >
            Cancel ❌
          </Button>

          <Button type="button" className="streamlit-button" onClick={handleOpenStreamlit}>
            Recommendations
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default QuizAdd;
