import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import axios from 'axios';
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
      <p><strong>Correct Answer:</strong> {correctAnswer}</p>
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
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Search for the chapter and fetch its details
  const handleSearch = async () => {
    if (chapterName) {
      setError('');
      setLoading(true);
      try {
        // API call to fetch chapter details
        const response = await axios.post('http://localhost:8501', { chapter_name: chapterName });
        setMessage(response.data.message);

        // Call the API to generate quiz questions
        const quizResponse = await axios.post('http://localhost:5000/generate_quiz', { pdf_name: chapterName });
        setQuizList(quizResponse.data.quiz_items || []);
      } catch (err) {
        setError(err.response?.data?.error || 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle file download
  const handleDownload = async () => {
    try {
      const response = await axios.post('http://localhost:1010/save_quiz', { chapter_name: chapterName, quiz: quizList }, { responseType: 'blob' });
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    } catch (error) {
      console.error('Error downloading the PDF:', error);
    }
  };

  return (
    <div className="quiz-recommendation-page">
      <h1>Quiz Recommendation</h1>
      <input
        type="text"
        value={chapterName}
        onChange={(e) => setChapterName(e.target.value)}
        placeholder="Enter chapter name"
      />
      <Button onClick={handleSearch} disabled={loading}>Generate Quiz</Button>
      {error && <p className="error">{error}</p>}
      {loading && <p>Loading...</p>}
      {message && <p>{message}</p>}
      {quizList.length > 0 && (
        <div>
          {quizList.map((item, index) => (
            <QuizItem
              key={index}
              question={item.question}
              responses={item.options}
              correctAnswer={item.correct_answer}
            />
          ))}
          <Button onClick={handleDownload}>Download PDF</Button>
        </div>
      )}
    </div>
  );
};

export default QuizRecommendationPage;
