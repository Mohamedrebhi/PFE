import React, { useState, useEffect } from 'react';
import { Col, Card, Table } from 'react-bootstrap';
//import './AdminPage.css';

function AdminPage() {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await fetch('http://localhost:200/enseignants');
      if (!response.ok) {
        throw new Error('Failed to fetch enseignants');
      }
      const jsonTeachers = await response.json();
      setTeachers(jsonTeachers);
    } catch (error) {
      console.error('Error fetching enseignants:', error);
    }
  };

  const acceptRequest = async (username) => {
    try {
      const response = await fetch(`http://localhost:200/enseignants/action`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, action: 'accept' }) // Use 'accept' action with username
      });
      if (!response.ok) {
        throw new Error('Failed to accept request');
      }
      // Update the state by filtering out the accepted teacher by username
      setTeachers((prevTeachers) =>
        prevTeachers.filter((teacher) => teacher.username !== username)
      );
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };
  
  const rejectRequest = async (username) => {
    try {
      const response = await fetch(`http://localhost:200/enseignants/action`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, action: 'delete' }) // Use 'delete' action with username
      });
      if (!response.ok) {
        throw new Error('Failed to reject request');
      }
      // Update the state by filtering out the rejected teacher by username
      setTeachers((prevTeachers) =>
        prevTeachers.filter((teacher) => teacher.username !== username)
      );
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };
  
  
  

  return (
    <Col xs={12}>
      <Card className="Recent-Users">
        <Card.Header>
          <Card.Title as="h5">Teacher List</Card.Title>
        </Card.Header>
        <Card.Body className="px-0 py-2">
          <Table responsive hover className="recent-users">
            <thead>
              <tr>
                <th>ProfessorID</th>
                <th>Name</th>
                <th>Email</th>
              
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher._id}>
                  <td>{teacher.ProfessorID}</td>
                  <td>{teacher.username}</td>
                  <td>{teacher.email}</td>
                
                  <td>
                  <button className="label theme-bg2 text-white f-12" onClick={() => acceptRequest(teacher.username)}>Accepter</button>
                  <button className="label theme-bg text-white f-12" onClick={() => rejectRequest(teacher.username)}>Refuser</button>
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
