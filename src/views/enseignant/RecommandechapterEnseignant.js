import React, { useState } from 'react';
import './chapter.css';

const ChapitreAdd = () => {
  const [chapitre, setChapitre] = useState(''); // Default chapter name
  const [recommendation, setRecommendation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleGetReformulation = async () => {
    try {
      const response = await fetch(`http://localhost:4002/get_reformulation/${chapitre}`, {
        method: 'GET',
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

  const handleMakeItEasier = () => {
    handleGetReformulation();
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
      <button className="btn btn-primary" onClick={handleMakeItEasier}>
        Make it Easier
      </button>
    </div>
  );
};

export default ChapitreAdd;
