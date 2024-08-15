import React, { useState } from 'react';
import './CourAdd.css';

const StudentAdd = () => {
  const [formData, setFormData] = useState({
    CourseName: '',
    CourseCode: '',
    CourseDetails: '',
    StartForm: '',
    CourseDuration: '',
    ProfessorName: '',
    ContactNumber: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Envoyer les données du formulaire à l'API ou effectuer d'autres traitements ici
    console.log(formData);
    // Réinitialiser le formulaire après soumission si nécessaire
    setFormData({
      CourseName: '',
      CourseCode: '',
      CourseDetails: '',
      StartForm: '',
      CourseDuration: '',
      ProfessorName: '',
      ContactNumber: ''
    });
  };

  return (
    <div className="container">
      <h4>Courses Details</h4>
      <hr />
      <form onSubmit={handleSubmit} className="course-form">
        <table>
          <tbody>
            <tr>
              <td className="form-group">
                <label htmlFor="CourseName">Course Name</label>
                <input type="text" id="CourseName" name="CourseName" value={formData.CourseName} onChange={handleChange} required />
              </td>
              <td className="form-group">
                <label htmlFor="CourseCode">Course Code</label>
                <input type="text" id="CourseCode" name="CourseCode" value={formData.CourseCode} onChange={handleChange} required />
              </td>
            </tr>
            <tr>
              <td className="form-group">
                <label htmlFor="CourseDetails">Course Details</label>
                <input type="text" id="CourseDetails" name="CourseDetails" value={formData.CourseDetails} onChange={handleChange} required />
              </td>
              <td className="form-group">
                <label htmlFor="StartForm">Start Form</label>
                <input type="date" id="StartForm" name="StartForm" value={formData.StartForm} onChange={handleChange} required />
              </td>
            </tr>
            <tr>
              <td className="form-group">
                <label htmlFor="CourseDuration">Course Duration</label>
                <input type="text" id="CourseDuration" name="CourseDuration" value={formData.CourseDuration} onChange={handleChange} required />
              </td>
              <td className="form-group">
                <label htmlFor="ProfessorName">Professor Name</label>
                <input type="text" id="ProfessorName" name="ProfessorName" value={formData.ProfessorName} onChange={handleChange} required />
              </td>
            </tr>
            <tr>
              <td className="form-group">
                <label htmlFor="ContactNumber">Contact Number</label>
                <input type="text" id="ContactNumber" name="ContactNumber" value={formData.ContactNumber} onChange={handleChange} required />
              </td>
              
            </tr>
          </tbody>
        </table>
        <div className="button-group">
          <button type="submit">Submit</button>
          <button type="reset">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default StudentAdd;
