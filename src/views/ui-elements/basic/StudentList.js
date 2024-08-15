import React, { useState, useEffect } from 'react';
import { Col, Card, Table } from 'react-bootstrap';
import avatar22 from '../../../assets/images/user/avatar-22.jpg';
import './List.css';

function StudentList() {
  const [apprenants, setApprenants] = useState([]);
  const [courses, setCourses] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [apprenantIdToDelete, setApprenantIdToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);

  // Fetch the list of apprenants
  useEffect(() => {
    const fetchApprenants = async () => {
      try {
        const response = await fetch('http://localhost:600/Apprenants');
        if (!response.ok) {
          throw new Error('Failed to fetch apprenants');
        }
        const jsonApprenants = await response.json();
        setApprenants(jsonApprenants);
        setFilteredStudents(jsonApprenants); // Set filteredStudents to the full list initially

        // Fetch courses for each apprenant
        const newCourses = {};
        for (const apprenant of jsonApprenants) {
          const studentID = apprenant.StudentID;
          const courseResponse = await fetch(`http://localhost:600/Cours/${studentID}`);
          if (courseResponse.ok) {
            const studentCourses = await courseResponse.json();
            newCourses[studentID] = studentCourses;
          }
        }
        setCourses(newCourses);
      } catch (error) {
        console.error(`Error fetching apprenants or courses:`, error);
        setError(`An error occurred: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApprenants();
  }, []);

  // Handle deletion confirmation
  const handleDelete = (studentID) => {
    setApprenantIdToDelete(studentID);
    setShowConfirmation(true);
  };

  // Handle actual deletion
  const handleConfirmDelete = async () => {
    setShowConfirmation(false);

    try {
      const response = await fetch(`http://localhost:600/Apprenants/${apprenantIdToDelete}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setShowSuccess(true);
        fetchApprenants(); // Reload the apprenants
      } else {
        console.error('Failed to delete apprenant:', response.statusText);
      }
    } catch (error) {
      console.error('Error during deletion:', error.message);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleSearch = () => {
    const searchTermLowerCase = searchTerm.toLowerCase();
    const filteredResults = apprenants.filter(student => {
      const fullName = student.Name.toLowerCase();
      const level = student.Level.toLowerCase();
      return fullName.includes(searchTermLowerCase) || level.includes(searchTermLowerCase);
    });
    setFilteredStudents(filteredResults);
  };

  return (
    <div className="student-list-container">
      {showConfirmation && (
        <div className="confirmation-message-container">
          <p>Êtes-vous sûr de vouloir supprimer cet étudiant ?</p>
          <button onClick={handleConfirmDelete}>Oui</button>
          <button onClick={() => setShowConfirmation(false)}>Non</button>
        </div>
      )}

      {showSuccess && (
        <div className="success-message-container">
          <p>Étudiant supprimé avec succès</p>
          <button onClick={() => setShowSuccess(false)}>OK</button>
        </div>
      )}

      <Col xs={12}>
        <Card className="user-list">
          <Card.Header>
            <Card.Title as="h5">Student List</Card.Title>
          </Card.Header>
          <br></br>
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button" onClick={handleSearch}>Search 🔍</button>
          </div>
          <Card.Body className="p-0">
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Profil</th>
                  <th>ID étudiant</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Niveau</th>
                  <th>Cours</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((apprenant) => (
                  <tr key={apprenant.StudentID}>
                    <td>
                      <img
                        src={avatar22}
                        className="img-radius"
                        alt="Profil"
                        style={{ width: '60px', height: '60px' }}
                      />
                    </td>
                    <td>{apprenant.StudentID}</td>
                    <td>{apprenant.Name}</td>
                    <td>{apprenant.email}</td>
                    <td>{apprenant.PhoneNumber}</td>
                    <td>{apprenant.Level}</td>
                    <td>
                      {courses[apprenant.StudentID] ? (
                        <ul>
                          {courses[apprenant.StudentID].map((course) => (
                            <li key={course._id}>{course.Name}</li>
                          ))}
                        </ul>
                      ) : (
                        'Aucun cours'
                      )}
                    </td>
                    <td>
                      <button onClick={() => handleDelete(apprenant.StudentID)}>
                        <span role="img" aria-label="Delete">🗑️</span>
                      </button>
                      <button onClick={() => console.log(`Edit ${apprenant.StudentID}`)}>
                        <span role="img" aria-label="Edit">✏️</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
    </div>
  );
}

export default StudentList;