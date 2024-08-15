import React, { useState, useEffect } from 'react';
import './profile.css';
import profilePicture from '../assets/images/user/avatar-1.jpg';

const Profile = () => {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    try {
      const response = await fetch('http://localhost:600/Apprenants');
      if (!response.ok) {
        throw new Error('Error fetching student');
      }
      const data = await response.json();
     
      setStudent(data[0]);
    } catch (error) {
      console.error('Error fetching student:', error);
    }
  };

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile">
      <div className="profile-card">
        <div className="profile-header">
          <h2>Profile</h2>
         
          <img src={profilePicture} alt="Profile" className="profile-picture" />
        </div>
        <div className="profile-info">
          <div className="info-row">
            <label>First Name:</label>
            <span>{student.username}</span>
          </div>
          <div className="info-row">
            <label>Last Name:</label>
            <span>{student.lastName}</span>
          </div>
          <div className="info-row">
            <label>Birthday:</label>
            <span>{student.birthday}</span>
          </div>
          <div className="info-row">
            <label>Gender:</label>
            <span>{student.gender}</span>
          </div>
          <div className="info-row">
            <label>Email:</label>
            <span>{student.email}</span>
          </div>
          <div className="info-row">
            <label>Phone:</label>
            <span>{student.phone}</span>
          </div>
          <div className="info-row">
            <label>Address:</label>
            <span>{student.address}</span>
          </div>
          <div className="info-row">
            <label>Street Number:</label>
            <span>{student.streetNumber}</span>
          </div>
          <div className="info-row">
            <label>City:</label>
            <span>{student.city}</span>
          </div>
          <div className="info-row">
            <label>State:</label>
            <span>{student.state}</span>
          </div>
          <div className="info-row">
            <label>Zip Code:</label>
            <span>{student.zipCode}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;