import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import axios from 'axios'; // Import axios for handling file uploads
import './chapter.css';

// Component to display each quiz item
const QuizItem = ({ question, responses, correctAnswer }) => {
  return (
    <div className="quiz-item">
      <p><strong>Question:</strong> {question}</p>
      <ul>
        {responses.map((response, idx) => (
          <li key={idx}><strong>{String.fromCharCode(65 + idx)}:</strong> {response}</li>
        ))}
      </ul>
      <p><strong>Right answer:</strong> {correctAnswer}</p>
    </div>
  );
};

QuizItem.propTypes = {
  question: PropTypes.string.isRequired,
  responses: PropTypes.arrayOf(PropTypes.string).isRequired,
  correctAnswer: PropTypes.string.isRequired,
};

const QuizRecommendationPage = () => {
  const [chapterName, setChapterName] = useState('');
  const [quizList, setQuizList] = useState([]);
  const [simplifiedContent, setSimplifiedContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch quiz recommendations from Flask API
  const handleRecommend = async () => {
    if (chapterName) {
      setError('');
      setLoading(true);
      try {
        const response = await fetch('http://localhost:4002/generate_quiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ chapterName }),
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}. Details: ${errorText}`);
        }
  
        const data = await response.json();
        console.log('API response:', data);
  
        // Parse and set the quiz and simplified content
        const quizItems = parseQuizContent(data.quiz);
        setQuizList(quizItems);
        setSimplifiedContent(data.simplified_content);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setError(`Error fetching recommendations: ${error.message}`);
        setQuizList([]);
      }
      setLoading(false);
    } else {
      alert('Please fill in the chapter name.');
    }
  };
  
  
  
  

  // Save chapter with quiz to the server
  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('Course', 'course-id'); // Replace with actual course ID
    formData.append('NameChapter', chapterName);
    // Replace `file` with the actual file input if needed

    try {
      const response = await axios.post('http://127.0.0.1:1000/chapitre', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Success:', response.data);
      alert('Chapter saved successfully.');
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving chapter.');
    }
  };

  // Function to parse quiz content from the API response
  const parseQuizContent = (quizContent) => {
    try {
      // Assuming the quizContent is a JSON string or needs parsing
      const parsedContent = JSON.parse(quizContent);
      return parsedContent.map((item, index) => ({
        question: item.question,
        responses: item.responses,
        correctAnswer: item.correctAnswer,
      }));
    } catch (error) {
      console.error('Error parsing quiz content:', error);
      return [];
    }
  };

  return (
    <div className="quiz-recommendation-page">
      <h1>Recommandation de Quiz</h1>
      <div className="input-container">
        <label htmlFor="chapter-input">Nom du Chapitre :</label>
        <input
          type="text"
          id="chapter-input"
          value={chapterName}
          onChange={(e) => setChapterName(e.target.value)}
        />
      </div>
      <br />
      <Button onClick={handleRecommend} disabled={loading}>
        {loading ? 'Generating...' : 'Générer Quiz'}
      </Button>
      <Button onClick={handleSave}>Save</Button>
      {error && <p className="error">{error}</p>}
      <div className="quiz-list">
        {quizList.map((quiz, index) => (
          <QuizItem
            key={index}
            question={quiz.question}
            responses={quiz.responses}
            correctAnswer={quiz.correctAnswer}
          />
        ))}
      </div>
      {simplifiedContent && (
        <div className="simplified-content">
          <h2>Simplified Content:</h2>
          <p>{simplifiedContent}</p>
        </div>
      )}
    </div>
  );
};

export default QuizRecommendationPage;
