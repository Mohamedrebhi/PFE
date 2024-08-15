import React, { useState} from 'react';
import { useParams } from 'react-router-dom'; // Importez useParams pour récupérer les paramètres d'URL
import axios from 'axios'; // Import Axios
import './CourAdd.css';

const CourseEdit = () => {
  const { courseId } = useParams();
  const [formData, setFormData] = useState({
    ProfessorID: '',
    NameCourse: '',
    Price: '',
  });
  const [submitMessage, setSubmitMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [idschapter, setaddchapter] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData, idschapter };

      // Récupérer l'identifiant du cours à mettre à jour (à remplacer par votre logique)
      await axios.put(`http://localhost:400/Cours/${courseId}`, dataToSend);

      setSubmitMessage('Course updated successfully');
      setShowPopup(true);
      setFormData({
        ProfessorID: '',
        NameCourse: '',
        Price: '',
      });
      setaddchapter([]);
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };


  const handleReset = () => {
    setFormData({
      ProfessorID: '',
      NameCourse: '',
      Price: '',
    });
    setSubmitMessage('');
  };

  return (
    <div className="container">
      <h4>Course Edit</h4>
      <hr />
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <table>
          <tbody>
            <tr>
              <td className="form-group">
                <label htmlFor="ProfessorID">Professor ID</label>
                <input type="text" id="ProfessorID" name="ProfessorID" value={formData.ProfessorID} onChange={handleChange} required />
              </td>
              <td className="form-group">
                <label htmlFor="NameCourse">Name Course</label>
                <input type="text" id="NameCourse" name="NameCourse" value={formData.NameCourse} onChange={handleChange} required />
              </td>
            </tr>

            <tr>
              <td className="form-group">
                <label htmlFor="Price">Price</label>
                <input type="text" id="Price" name="Price" value={formData.Price} onChange={handleChange} required />
              </td>
              <td className="form-group">
                <label htmlFor="NBchapitre">Nombre de chapitre</label>
                <input type="text" id="NBchapitre" name="NBchapitre" value={formData.NBchapitre} onChange={handleChange} required />
              </td>
            </tr>

            {/* Section pour les chapitres supplémentaires */}
            {/*
  <tr>
    <td className="form-group" colSpan="2">
      <div>
        {idschapter.map((chapter, index) => (
          <div key={index}>
            <input 
              type="text" 
              value={chapter} 
              onChange={(e) => {
                const newchapter = [...idschapter];
                newchapter[index] = e.target.value;
                setaddchapter(newchapter);
              }} 
            />
          </div>
        ))}
        <button type="button" onClick={() => setaddchapter([...idschapter, ''])}>Add chapter</button>
      </div>
    </td>
  </tr>
*/}


          </tbody>
        </table>
        <div className="button-group">
        <button type="submit">Submit ✔️</button>
        <button type="reset">Cancel ❌</button>
        </div>
        {/*submitMessage && <p>{submitMessage}</p>*/}
      </form>
      {showPopup && (
        <div className="popup-container">
          <div className="popup-content">
            <p className="popup-message">{submitMessage}</p>
            <button className="close-button" onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseEdit;
