import React, { useState } from 'react';
import './form.css'; // Fichier CSS pour le style

const TeacherEdit = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    joiningDate: '',
    password: '',
    confirmPassword: '',
    mobileNumber: '',
    gender: '',
    ID: '',
    department: '',
    dateOfBirth: '',
    education: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Vérifier si les mots de passe correspondent
    if (formData.password !== formData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas !');
      return; // Arrêter la soumission du formulaire si les mots de passe ne correspondent pas
    }

    // Envoyer les données du formulaire à l'API ou effectuer d'autres traitements ici
    console.log(formData);
    // Réinitialiser le formulaire après soumission si nécessaire
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      joiningDate: '',
      password: '',
      confirmPassword: '',
      mobileNumber: '',
      gender: '',
      ID: '',
      department: '',
      dateOfBirth: '',
      education: ''
    });
  };

  return (
    <div className="teacher-form-container">
      <h4>Basic info</h4>
      <hr />
      <form onSubmit={handleSubmit} className="teacher-form">
        <table>
          <tbody>
            <tr>
              <td className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </td>
              <td className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </td>
            </tr>
            <tr>
              <td className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </td>
              <td className="form-group">
                <label htmlFor="joiningDate">Joining Date</label>
                <input type="date" id="joiningDate" name="joiningDate" value={formData.joiningDate} onChange={handleChange} required />
              </td>
            </tr>
            <tr>
              <td className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
              </td>
              <td className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>

            <tr>
              <td className="form-group">
                <label htmlFor="mobileNumber">Mobile Number</label>
                <input type="tel" id="mobileNumber" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required />
              </td>
              <td className="form-group">
                <label htmlFor="gender">Gender</label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="form-group">
                <label htmlFor="ID">ID</label>
                <input type="text" id="ID" name="ID" value={formData.ID} onChange={handleChange} required />
              </td>
              <td className="form-group">
                <label htmlFor="department">Department</label>
                <input type="text" id="department" name="department" value={formData.department} onChange={handleChange} required />
              </td>
            </tr>
            <tr>
              <td className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
              </td>
              <td className="form-group">
                <label htmlFor="education">Education</label>
                <input type="text" id="education" name="education" value={formData.education} onChange={handleChange} required />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <button type="submit">submit </button>
      <button type="reset">cancel </button>
    </div>
  );
};

export default TeacherEdit;
