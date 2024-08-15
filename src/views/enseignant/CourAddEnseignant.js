import React, { useState } from 'react';
import axios from 'axios';
import './CourAdd.css';

const CoursAdd = () => {
  const [formData, setFormData] = useState({
    ProfessorID: '',
    NameCourse: '',
    Price: '',
    NumberofChapter: '',
  });
  const [submitMessage, setSubmitMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:400/Cours', {
        ProfessorID: parseInt(formData.ProfessorID),
        Name: formData.NameCourse,
        Price: parseFloat(formData.Price),
        NumberofChapter: parseInt(formData.NumberofChapter),
      });
      setSubmitMessage('Course created successfully');
      setShowPopup(true);
      setFormData({
        ProfessorID: '',
        NameCourse: '',
        Price: '',
        NumberofChapter: '',
      });
    } catch (error) {
      console.error('Error creating course:', error);
      setSubmitMessage('Error creating course');
      setShowPopup(true);
    }
  };

  const handleReset = () => {
    setFormData({
      ProfessorID: '',
      NameCourse: '',
      Price: '',
      NumberofChapter: '',
    });
    setSubmitMessage('');
  };

  return (
    <div className="container">
      <h4>Courses Details</h4>
      <hr />
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <table>
          <tbody>
            <tr>
              <td className="form-group">
                <label htmlFor="ProfessorID">Professor ID</label>
                <input
                  type="text"
                  id="ProfessorID"
                  name="ProfessorID"
                  value={formData.ProfessorID}
                  onChange={handleChange}
                  required
                />
              </td>
              <td className="form-group">
                <label htmlFor="NameCourse">Name Course</label>
                <input
                  type="text"
                  id="NameCourse"
                  name="NameCourse"
                  value={formData.NameCourse}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>

            <tr>
              <td className="form-group">
                <label htmlFor="Price">Price</label>
                <input
                  type="text"
                  id="Price"
                  name="Price"
                  value={formData.Price}
                  onChange={handleChange}
                  required
                />
              </td>
              <td className="form-group">
                <label htmlFor="NumberofChapter">Number of Chapter</label>
                <input
                  type="text"
                  id="NumberofChapter"
                  name="NumberofChapter"
                  value={formData.NumberofChapter}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="button-group">
          <button type="submit" className="submit-button">
            Submit ✔️
          </button>
          <button type="reset" className="cancel-button">
            Cancel ❌
          </button>
        </div>
      </form>
      {showPopup && (
        <div className="popup-container">
          <div className="popup-content">
            <p className="popup-message">{submitMessage}</p>
            <button className="close-button" onClick={() => setShowPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursAdd;
