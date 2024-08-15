import React, { useState, useEffect } from 'react';
import './chapter.css';

const ChapitreAdd = () => {
  const [chapitre, setChapitre] = useState('chap1'); // Nom de chapitre par défaut
  const [recommendation, setRecommendation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (chapitre) {
      handleCheckConditions();
    }
  }, [chapitre]);

  const handleCheckConditions = async () => {
    try {
      const response = await fetch('http://localhost:4002/check_conditions', {
        method: 'POST',
        body: JSON.stringify({ chapitre }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.should_reformulate) {
          handleGetReformulation();
        } else {
          setErrorMessage('Conditions not met for reformulation');
          setRecommendation('');
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error);
        setRecommendation('');
      }
    } catch (error) {
      setErrorMessage('Error checking conditions: ' + error.message);
      setRecommendation('');
      console.error('Error checking conditions:', error);
    }
  };

  const handleGetReformulation = async () => {
    try {
      const response = await fetch('http://localhost:4002/get_reformulation', {
        method: 'GET'
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendation(data.reformulated_text);
        setErrorMessage('');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error);
        setRecommendation('');
      }
    } catch (error) {
      setErrorMessage('Error getting reformulation: ' + error.message);
      setRecommendation('');
      console.error('Error getting reformulation:', error);
    }
  };

  const handleChapitreChange = (e) => {
    setChapitre(e.target.value);
    setRecommendation('');
    setErrorMessage('');
  };

  return (
    <div className="container">
      <h4>Recommandation de Chapitre</h4>
      <hr />
      <div className="form-group">
        <label htmlFor="chapitre">Nom du Chapitre</label>
        <input type="text" id="chapitre" value={chapitre} onChange={handleChapitreChange} />
      </div>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <div className="form-group">
        <label htmlFor="recommendation">Recommandation</label>
        <textarea
          id="recommendation"
          value={recommendation}
          readOnly
          style={{ width: '100%', height: '200px', resize: 'vertical' }}
        />
      </div>
    </div>
  );
};

export default ChapitreAdd;