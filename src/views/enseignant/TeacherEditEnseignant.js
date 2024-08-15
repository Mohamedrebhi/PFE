import React, { useState } from 'react';
//import axios from 'axios';
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
    const initialFormData = {
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
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleReset = () => {
        setFormData(initialFormData); // Réinitialise les données du formulaire à l'état initial
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Vérifier si les mots de passe correspondent
        if (formData.password !== formData.confirmPassword) {
            alert("Les mots de passe ne correspondent pas !");
            return; // Arrêter la soumission du formulaire si les mots de passe ne correspondent pas
        }
       

        try {
            // Envoyer les données du formulaire à l'API Flask
           // await axios.put('http://127.0.0.1:5000/enseignants/${formData.id}', formData);
           await fetch(`http://127.0.0.1:5000/enseignants/${formData.ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
            console.log("Enseignant mis à jour avec succès.");
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
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'enseignant :", error);
        }   
    };
    

    return (
        <div className="teacher-form-container">
            <h4>Basic info</h4>
            <hr/>
            <form onSubmit={handleSubmit} onReset={handleReset}>
                <table>
                    <tbody>
                        <tr>
                            <td className="form-group">
                                <label htmlFor="firstName">First Name</label>
                                <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange}/>
                            </td>
                            <td className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange}  />
                            </td>
                        </tr>
                            <tr>
                            <td className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}  />
                            </td>
                            <td className="form-group">
                                <label htmlFor="joiningDate">Joining Date</label>
                                <input type="date" id="joiningDate" name="joiningDate" value={formData.joiningDate} onChange={handleChange}  />
                            </td>
                            </tr>
                            <tr>
                            <td className="form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
                            </td>
                            <td className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}/>
                            </td>
                        </tr>
                       
                        
                       
                            <tr>
                            <td className="form-group">
                                <label htmlFor="mobileNumber">Mobile Number</label>
                                <input type="tel" id="mobileNumber" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
                            </td>
                            <td className="form-group">
                                <label htmlFor="gender">Gender</label>
                                <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
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
                                <input type="text" id="department" name="department" value={formData.department} onChange={handleChange} />
                            </td>
                            </tr>
                            <tr>
                            <td className="form-group">
                                <label htmlFor="dateOfBirth">Date of Birth</label>
                                <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
                            </td>
                            <td className="form-group">
                                <label htmlFor="education">Education</label>
                                <input type="text" id="education" name="education" value={formData.education} onChange={handleChange} />
                            </td>
                            </tr>
                       
                    </tbody>
                </table>
                <button type="submit">Submit </button>
                <button type="reset">Cancel </button>
            </form>
            
        </div>
    );
};

export default TeacherEdit;
