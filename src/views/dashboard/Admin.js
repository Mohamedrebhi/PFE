import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';

const DashDefault = () => {
 

  const [newStudents, setNewStudents] = useState([]);
  const [enseignants, setEnseignants] = useState([]); // Nouvel état pour les enseignants

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:200/dashboard_data');
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données du tableau de bord :', error);
      }
    };

    const fetchNewStudents = async () => {
      try {
        const response = await fetch('http://localhost:600/Apprenants'); // Mettez l'URL correcte de votre backend
        const data = await response.json();
        setNewStudents(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des nouveaux étudiants :', error);
      }
    };

    const fetchEnseignants = async () => { // Fonction pour récupérer les enseignants
      try {
        const response = await fetch('http://localhost:200/enseignants'); // Mettez l'URL correcte de votre backend
        const data = await response.json();
        setEnseignants(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des enseignants :', error);
      }
    };

    fetchDashboardData();
    fetchNewStudents();
    fetchEnseignants(); // Appel à la récupération des enseignants
  }, []);

  // Calculer le pourcentage de nouveaux étudiants
  /*const newStudentPercentage = dashboardData.total_students > 0
    ? (dashboardData.new_students / dashboardData.total_students) * 100
    : 0;*/

  const dashSalesData = [
    { title: 'Total Students', Number: 2 },
    { title: 'Total Teachers', Number: 2 }, // Remplacer New Students par Total Teachers
    { title: 'Total Course', Number: 3 },
  ];

  return (
    <React.Fragment>
      <Row>
        {dashSalesData.map((data, index) => {
          return (
            <Col key={index} xl={6} xxl={4}>
              <Card>
                <Card.Body>
                  <h6 className="mb-4">{data.title}</h6>
                  <div className="row d-flex align-items-center">
                    <div className="col-9">
                      <h3 className="f-w-300 d-flex align-items-center m-b-0">
                        <i className="f-30 m-r-5" /> {data.Number}
                      </h3>
                    </div>
                  </div>
                  <div className="progress m-t-30" style={{ height: '4px' }}>
                    <div
                      className={`progress-bar ${data.class}`}
                      role="progressbar"
                      style={{ width: `${data.value || 0}%` }}
                      aria-valuenow={data.value || 0}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
        <StudentList newStudents={newStudents} />
        <EnseignantList enseignants={enseignants} /> {/* Ajout du composant EnseignantList */}
      </Row>
    </React.Fragment>
  );
};



const EnseignantList = ({ enseignants }) => { // Nouveau composant pour afficher la liste des enseignants
  return (
    <Col xs={12} md={6}> {/* Mise à jour pour diviser en deux colonnes */}
      <Card className="user-list">
        <Card.Header>
          <Card.Title as="h5">Enseignant List</Card.Title>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover>
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {enseignants.map((enseignant, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{enseignant.username}</td>
                  <td>{enseignant.email}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Col>
  );
};
const StudentList = ({ newStudents }) => {
  return (
    <Col xs={12} md={6}> {/* Mise à jour pour diviser en deux colonnes */}
      <Card className="user-list">
        <Card.Header>
          <Card.Title as="h5">Student List</Card.Title>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover>
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Email</th>
                <th>PhoneNumber</th>
              
              </tr>
            </thead>
            <tbody>
              {newStudents.map((student, index) => (
                <tr key={index=0}>
                  <td>{index + 1}</td>
                  <td>{student.username}</td>
                  <td>{student.email}</td>
                  <td>{student.PhoneNumber}</td>
               
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Col>
  );
};

StudentList.propTypes = {
  newStudents: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    
    })
  ).isRequired,
};

EnseignantList.propTypes = {
  enseignants: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
   
    })
  ).isRequired,
};

export default DashDefault;