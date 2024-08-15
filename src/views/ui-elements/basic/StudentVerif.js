import React, { useState, useEffect } from 'react';
import {Col, Card, Table } from 'react-bootstrap';
//import { Link } from 'react-router-dom';

//import './AdminPage.css';

function AdminPage () {
  const [apprenants, setApprenants] = useState([]);
  useEffect(() => {
    fetchApprenants();
}, []);

const fetchApprenants = async () => {
    try {
        const response = await fetch('http://localhost:600/Apprenants');
        console.log(apprenants);
        if (!response.ok) {
            throw new Error('Failed to fetch apprenants');
        }
        const jsonApprenants = await response.json();
        setApprenants(jsonApprenants);
    } catch (error) {
        console.log('Error fetching apprenants:', error);
    }
};
  // Fonction pour accepter une demande
  const acceptRequest = async (_id) => {
    try {
      const response = await fetch(`http://localhost:600/users/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ state: 'accepter' }) // Adjust the body as needed
      });
      if (!response.ok) {
        throw new Error('Failed to accept request');
      }
      setApprenants(prevApprenants => prevApprenants.filter(apprenant => apprenant._id !== _id));
      // Update the UI or fetch the pending requests again
      // based on your application's logic
    } catch (error) {
      console.log('Error accepting request:', error);
    }
  };

  // Fonction pour refuser une demande
  const rejectRequest = async (_id) => { // Change id to _id here
    try {
      const response = await fetch(`http://localhost:600/users/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ state: 'refuser' }) // Adjust the body as needed
      });
      if (!response.ok) {
        throw new Error('Failed to reject request');
      }
      setApprenants(prevApprenants => prevApprenants.filter(apprenant => apprenant._id !== _id));
      // Update the UI or fetch the pending requests again
      // based on your application's logic
    } catch (error) {
      console.log('Error rejecting request:', error);
    }
  };

  return (
    <Col xs={12}>
      <Card className="Recent-Users">
            <Card.Header>
              <Card.Title as="h5">Student List</Card.Title>
            </Card.Header>
            <Card.Body className="px-0 py-2">
              <Table responsive hover className="recent-users">
                  <thead>
                    <tr>
                      <th>StudentID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>PhoneNumber</th>
                      <th>Level</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                <tbody>
                  {apprenants.map(request => (
                    <tr key={request._id}>
                      <td>{request.StudentID}</td>
                      <td>{request.Name}</td>
                      <td>{request.email}</td>
                      <td>{request.PhoneNumber}</td>
                      <td>{request.Level}</td>
                      <td>
                        <button className="label theme-bg2 text-white f-12" onClick={() => acceptRequest(request._id)}>Accepter</button>
                        <button className="label theme-bg text-white f-12"  onClick={() => rejectRequest(request._id)}>Refuser</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              </Card.Body>
          </Card>
        </Col>
  );
}

export default AdminPage;
