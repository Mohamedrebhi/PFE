import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './form.css'; 

const AddDepartment = ({ onAdd }) => {
  const [departmentName, setDepartmentName] = useState('');
  const [headOfDept, setHeadOfDept] = useState('');
  const [startDate, setStartDate] = useState('');
  const [details, setDetails] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newDepartment = {
      name: departmentName,
      head: headOfDept,
      date: startDate,
      details: details
    };
    try {
      const response = await fetch('http://localhost:5000/Departments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newDepartment)
      });
      if (response.ok) {
        // Reset fields after successful submission
        setDepartmentName('');
        setHeadOfDept('');
        setStartDate('');
        setDetails('');
        // Show success message
        setSuccessMessage('Department added successfully!');
        // Call the onAdd function provided by the parent component
        onAdd();
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        throw new Error('Failed to add department');
      }
    } catch (error) {
      console.error('Error adding department:', error);
      // Handle error or display error message to the user
    }
  };

  return (
    <div className="department-form-container">
      <h4>Add a Department</h4>
      <form onSubmit={handleSubmit} className="department-form">
        <div>
          <label>Department Name:</label>
          <input type="text" value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} required />
        </div>
        <div>
          <label>Head of Department:</label>
          <input type="text" value={headOfDept} onChange={(e) => setHeadOfDept(e.target.value)} required />
        </div>
        <div>
          <label>Start Date:</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </div>
        <div>
          <label>Department Details:</label>
          <textarea value={details} onChange={(e) => setDetails(e.target.value)} required />
        </div>
        <button type="submit">Add Department</button>
      </form>
      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
};

// Validation des types de props
AddDepartment.propTypes = {
  onAdd: PropTypes.func.isRequired,
};

export default AddDepartment;
