// import React, { useState, useEffect } from 'react';
// import { Row, Col, Card, Table } from 'react-bootstrap';

// const DashEnseignant = () => {
//   // États locaux pour les données du tableau de bord
//   const [totalStudents, setTotalStudents] = useState(0);
//   const [newStudents, setNewStudents] = useState(0);
//   const [totalCourses, setTotalCourses] = useState(0);
//   const [newStudentsList, setNewStudentsList] = useState([]);

//   // Effet pour charger les données du tableau de bord
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const responseTotalStudents = await fetch('/total_students');
//         if (responseTotalStudents.ok) {
//           const data = await responseTotalStudents.json();
//           setTotalStudents(data.total_students);
//         }

//         const responseNewStudents = await fetch('/new_students');
//         if (responseNewStudents.ok) {
//           const data = await responseNewStudents.json();
//           setNewStudents(data.new_students);
//         }

//         const responseTotalCourses = await fetch('/total_courses');
//         if (responseTotalCourses.ok) {
//           const data = await responseTotalCourses.json();
//           setTotalCourses(data.total_courses);
//         }

//         const responseNewStudentsList = await fetch('/new_students_list');
//         if (responseNewStudentsList.ok) {
//           const data = await responseNewStudentsList.json();
//           setNewStudentsList(data.new_students_list);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <React.Fragment>
//       <Row>
//         <Col xl={6} xxl={4}>
//           <Card>
//             <Card.Body>
//               <h6 className="mb-4">Total Students</h6>
//               <div className="row d-flex align-items-center">
//                 <div className="col-9">
//                   <h3 className="f-w-300 d-flex align-items-center m-b-0">
//                     <i className="f-30 m-r-5" /> {totalStudents}
//                   </h3>
//                 </div>
//                 <div className="col-3 text-end">
//                   <p className="m-b-0">100%</p>
//                 </div>
//               </div>
//               <div className="progress m-t-30" style={{ height: '4px' }}>
//                 <div
//                   className="progress-bar progress-c-theme"
//                   role="progressbar"
//                   style={{ width: '50%' }}
//                   aria-valuenow={50}
//                   aria-valuemin="0"
//                   aria-valuemax="100"
//                 />
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col xl={6} xxl={4}>
//           <Card>
//             <Card.Body>
//               <h6 className="mb-4">New Students</h6>
//               <div className="row d-flex align-items-center">
//                 <div className="col-9">
//                   <h3 className="f-w-300 d-flex align-items-center m-b-0">
//                     <i className="f-30 m-r-5" /> {newStudents}
//                   </h3>
//                 </div>
//                 <div className="col-3 text-end">
//                   <p className="m-b-0">100%</p>
//                 </div>
//               </div>
//               <div className="progress m-t-30" style={{ height: '4px' }}>
//                 <div
//                   className="progress-bar progress-c-theme2"
//                   role="progressbar"
//                   style={{ width: '36%' }}
//                   aria-valuenow={36}
//                   aria-valuemin="0"
//                   aria-valuemax="100"
//                 />
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col xl={6} xxl={4}>
//           <Card>
//             <Card.Body>
//               <h6 className="mb-4">Total Courses</h6>
//               <div className="row d-flex align-items-center">
//                 <div className="col-9">
//                   <h3 className="f-w-300 d-flex align-items-center m-b-0">
//                     <i className="f-30 m-r-5" /> {totalCourses}
//                   </h3>
//                 </div>
//                 <div className="col-3 text-end">
//                   <p className="m-b-0">100%</p>
//                 </div>
//               </div>
//               <div className="progress m-t-30" style={{ height: '4px' }}>
//                 <div
//                   className="progress-bar progress-c-theme"
//                   role="progressbar"
//                   style={{ width: '70%' }}
//                   aria-valuenow={70}
//                   aria-valuemin="0"
//                   aria-valuemax="100"
//                 />
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//       <Row>
//         <Col xs={12}>
//           <Card className="user-list">
//             <Card.Header>
//               <Card.Title as="h5">New Student List</Card.Title>
//             </Card.Header>
//             <Card.Body className="p-0">
//               <Table responsive hover>
//                 <thead>
//                   <tr>
//                     <th>Student ID</th>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Password</th>
//                     <th>Phone Number</th>
//                     <th>Level</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {newStudentsList.map((student, index) => (
//                     <tr key={index}>
//                       <td>{student.StudentID}</td>
//                       <td>{student.Name}</td>
//                       <td>{student.Email}</td>
//                       <td>{student.Password}</td>
//                       <td>{student.PhoneNumber}</td>
//                       <td>{student.Level}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </React.Fragment>
//   );
// };

// export default DashEnseignant;
///////////////////////////////////
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';

const DashDefault = () => {
  const [dashboardData, setDashboardData] = useState({
    total_students: 0,
    new_students: 0,
    total_courses: 0
  });

  const [newStudents, setNewStudents] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:200/stats');
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

    fetchDashboardData();
    fetchNewStudents();
  }, []);

  // Calculer le pourcentage de nouveaux étudiants
  const newStudentPercentage = dashboardData.total_students > 0
    ? (dashboardData.new_students / dashboardData.total_students) * 100
    : 0;

  const dashSalesData = [
    { title: 'Total Students', Number: dashboardData.total_students },
    { title: 'New Students', Number: dashboardData.new_students, value: newStudentPercentage.toFixed(0)+'%' , class: 'progress-c-theme2' },
    { title: 'Total Courses', Number: dashboardData.total_courses }
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
                     <div className="col-3 text-end">
                      <p className="m-b-0">{data.value}</p>
                    </div> 
                  </div>
                  <div className="progress m-t-30" style={{ height: '4px' }}>
                    <div
                      className={`progress-bar ${data.class}`}
                      role="progressbar"
                      style={{ width: `${data.value}` }}
                      aria-valuenow={data.value}
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
      </Row>
    </React.Fragment>
  );
};

const StudentList = ({ newStudents }) => {
  return (
    <Col xs={12}>
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
                <th>Level</th>
              </tr>
            </thead>
            <tbody>
              {newStudents.map((student, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{student.username}</td>
                  <td>{student.email}</td>
                  <td>{student.PhoneNumber}</td>
                  <td>{student.Level}</td>
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
      Name: PropTypes.string.isRequired,
      Email: PropTypes.string.isRequired,
      PhoneNumber: PropTypes.string.isRequired,
      Level: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default DashDefault;

// import React, { useState, useEffect } from 'react';
// import { Row, Col, Card, Table } from 'react-bootstrap';
// import PropTypes from 'prop-types';

// const DashDefault = () => {
//   const [dashboardData, setDashboardData] = useState({
//     total_students: 0,
//     new_students: 0,
//     total_courses: 0
//   });

//   const [newStudents, setNewStudents] = useState([]);
//   const [reformulatedText, setReformulatedText] = useState('');

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const response = await fetch('http://localhost:200/dashboard_data');
//         const data = await response.json();
//         setDashboardData(data);
//       } catch (error) {
//         console.error('Erreur lors de la récupération des données du tableau de bord :', error);
//       }
//     };

//     const fetchNewStudents = async () => {
//       try {
//         const response = await fetch('http://localhost:300/Apprenants'); // Mettez l'URL correcte de votre backend
//         const data = await response.json();
//         setNewStudents(data);
//       } catch (error) {
//         console.error('Erreur lors de la récupération des nouveaux étudiants :', error);
//       }
//     };

//     const fetchReformulatedText = async () => {
//       try {
//         const response = await fetch('http://localhost:4002/reformtext', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ chapitre: '' }), // Assuming no chapter name is needed
//         });
//         const data = await response.json();
//         setReformulatedText(data.reformulated_text);
//       } catch (error) {
//         console.error('Erreur lors de la reformulation du texte :', error);
//       }
//     };

//     fetchDashboardData();
//     fetchNewStudents();
//     fetchReformulatedText();
//   }, []);

//   // Calculer le pourcentage de nouveaux étudiants
//   const newStudentPercentage = dashboardData.total_students > 0
//     ? (dashboardData.new_students / dashboardData.total_students) * 100
//     : 0;

//   const dashSalesData = [
//     { title: 'Total Students', Number: dashboardData.total_students },
//     { title: 'New Students', Number: dashboardData.new_students, value: newStudentPercentage.toFixed(0) + '%', class: 'progress-c-theme2' },
//     { title: 'Total Course', Number: dashboardData.total_courses }
//   ];

//   return (
//     <React.Fragment>
//       <Row>
//         {dashSalesData.map((data, index) => {
//           return (
//             <Col key={index} xl={6} xxl={4}>
//               <Card>
//                 <Card.Body>
//                   <h6 className="mb-4">{data.title}</h6>
//                   <div className="row d-flex align-items-center">
//                     <div className="col-9">
//                       <h3 className="f-w-300 d-flex align-items-center m-b-0">
//                         <i className="f-30 m-r-5" /> {data.Number}
//                       </h3>
//                     </div>
//                     <div className="col-3 text-end">
//                       <p className="m-b-0">{data.value}</p>
//                     </div>
//                   </div>
//                   <div className="progress m-t-30" style={{ height: '4px' }}>
//                     <div
//                       className={`progress-bar ${data.class}`}
//                       role="progressbar"
//                       style={{ width: `${data.value}` }}
//                       aria-valuenow={data.value}
//                       aria-valuemin="0"
//                       aria-valuemax="100"
//                     />
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>
//           );
//         })}
//         <Col xl={8}>
//           <StudentList newStudents={newStudents} />
//         </Col>
//         <Col xl={4}>
//           <Card>
//             <Card.Header>
//               <Card.Title as="h5">Reformulated Text</Card.Title>
//             </Card.Header>
//             <Card.Body>
//               <p>{reformulatedText}</p>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </React.Fragment>
//   );
// };

// const StudentList = ({ newStudents }) => {
//   return (
//     <Card className="user-list">
//       <Card.Header>
//         <Card.Title as="h5">Student List</Card.Title>
//       </Card.Header>
//       <Card.Body className="p-0">
//         <Table responsive hover>
//           <thead>
//             <tr>
//               <th>No</th>
//               <th>Name</th>
//               <th>Email</th>
//               <th>PhoneNumber</th>
//               <th>Level</th>
//             </tr>
//           </thead>
//           <tbody>
//             {newStudents.map((student, index) => (
//               <tr key={index}>
//                 <td>{index + 1}</td>
//                 <td>{student.Name}</td>
//                 <td>{student.email}</td>
//                 <td>{student.PhoneNumber}</td>
//                 <td>{student.Level}</td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </Card.Body>
//     </Card>
//   );
// };

// StudentList.propTypes = {
//   newStudents: PropTypes.arrayOf(
//     PropTypes.shape({
//       Name: PropTypes.string.isRequired,
//       Email: PropTypes.string.isRequired,
//       PhoneNumber: PropTypes.string.isRequired,
//       Level: PropTypes.string.isRequired,
//     })
//   ).isRequired,
// };

// export default DashDefault;
