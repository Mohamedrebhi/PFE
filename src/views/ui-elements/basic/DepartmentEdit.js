import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const EditDepartmentForm = ({ departmentToEdit, onUpdate }) => {
  const [departmentId, setDepartmentId] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [headOfDept, setHeadOfDept] = useState('');
  const [startDate, setStartDate] = useState('');
  const [details, setDetails] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (departmentToEdit) {
      setDepartmentId(departmentToEdit.id);
      setDepartmentName(departmentToEdit.name);
      setHeadOfDept(departmentToEdit.headOfDept);
      setStartDate(departmentToEdit.startDate);
      setDetails(departmentToEdit.details);
    }
  }, [departmentToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedDepartment = {
      id: departmentId,
      name: departmentName,
      head: headOfDept,
      date: startDate,
      details: details
    };
    try {
      const response = await fetch(`http://localhost:5000/Departments/${departmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedDepartment)
      });
      if (response.ok) {
        setSuccessMessage('Department updated successfully.');
        onUpdate();
      } else {
        throw new Error('Failed to update department');
      }
    } catch (error) {
      console.error('Error updating department:', error);
    }
  };

  return (
    <div>
      <h4>Edit Department</h4>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID:</label>
          <input type="text" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} required />
        </div>
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
        <button type="submit">Submit</button>
        <button type="reset">Cancel</button>
        {successMessage && <p>{successMessage}</p>}
      </form>
    </div>
  );
};

EditDepartmentForm.propTypes = {
  departmentToEdit: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default EditDepartmentForm;
