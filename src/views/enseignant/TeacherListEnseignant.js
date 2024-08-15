import React, { useState, useEffect } from 'react';
import './List.css'; // Fichier CSS pour le style

const TeacherList = () => {
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        // Appeler l'API pour récupérer la liste des enseignants lors du chargement du composant
        fetch('/enseignants')
            .then(response => response.json())
            .then(data => setTeachers(data))
            .catch(error => console.error('Error fetching teachers:', error));
    }, []);

    return (
        <div className="teacher-list-container">
            <h4>List of Teachers</h4>
            <table className="teacher-table">
                <thead>
                    <tr>
                        <th>Profile</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Gender</th>
                        <th>Department</th>
                        <th>Education</th>
                        <th>Mobile Number</th>
                        <th>Joining Date</th>
                    </tr>
                </thead>
                <tbody>
                    {teachers.map((teacher, index) => (
                        <tr key={index}>
                             <td><img className="profile-image" src={teacher.profile} alt={teacher.name} /></td>
                            <td>{teacher.firstName} {teacher.lastName}</td>
                            <td>{teacher.email} </td>
                            <td>{teacher.gender}</td>
                            <td>{teacher.department}</td>
                            <td>{teacher.education}</td>
                            <td>{teacher.mobileNumber}</td>
                            <td>{teacher.joiningDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TeacherList;
