import React, { useState, useEffect } from 'react';
import DepartmentEdit from './DepartmentEdit';
import './List.css';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://localhost:5000/Departments');
      if (!response.ok) {
        throw new Error('Failed to fetch departments');
      }
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/Departments/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        // Mettez à jour la liste des départements après la suppression
        fetchDepartments();
      } else {
        throw new Error('Failed to delete department');
      }
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  const handleEdit = () => {
    setShowEditForm(true);
  };  

  return (
    <div className="Department-list-container">
        <h4>List of Departments</h4>
        {showEditForm ? (
      <DepartmentEdit />
    ) : (
        <table className="Department-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Department</th>
                    <th>Head of dept</th>
                    <th>Date</th>
                    <th>Details</th>
                    <th>Actions</th> {/* Nouvelle colonne pour les actions */}
                </tr>
            </thead>
            <tbody>
                {departments.map((department) => (
                    <tr key={department.id}>
                        <td>{department.id}</td>
                        <td>{department.name}</td>
                        <td>{department.head}</td>
                        <td>{department.date}</td>
                        <td>{department.details}</td>
                        <td>
                            <button onClick={() => handleDelete(department.id)}><span role="img" aria-label="Delete">&#128465;</span></button>{/* Bouton pour supprimer */}
                            <button onClick={() => handleEdit(department.id)}><span role="img" aria-label="Edit">&#9998;</span></button>{/* Bouton pour modifier */}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )}
    </div>
);
};

export default DepartmentList;
