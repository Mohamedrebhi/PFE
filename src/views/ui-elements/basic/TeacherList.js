import React, { useState, useEffect } from 'react';
import { Col, Card, Table, Modal, Button } from 'react-bootstrap';
import './List.css';
import avatar22 from '../../../assets/images/user/avatar-22.jpg';
import { Link } from 'react-router-dom';

function TeacherList() {
    const [teachers, setTeachers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [exams, setExams] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [enseignantIdToDelete, setEnseignantIdToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTeachers, setFilteredTeachers] = useState([]);
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [showExamsModal, setShowExamsModal] = useState(false);
    const [selectedExams, setSelectedExams] = useState([]);

    useEffect(() => {
        fetchTeachers();
        fetchCourses();
        fetchExams();
    }, []);

    useEffect(() => {
        setFilteredTeachers(teachers);
    }, [teachers]);

    const fetchTeachers = async () => {
        try {
            const response = await fetch('http://localhost:200/enseignants');
            const data = await response.json();
            setTeachers(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des enseignants :', error);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await fetch('http://localhost:400/Cours');
            const data = await response.json();
            setCourses(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const fetchExams = async () => {
        try {
            const response = await fetch('http://localhost:800/examens');
            const data = await response.json();
            setExams(data);
        } catch (error) {
            console.error('Error fetching exams:', error);
        }
    };

    const handleDelete = (enseignantId) => {
        setEnseignantIdToDelete(enseignantId);
        setShowConfirmation(true);
    };

    const handleCancelDelete = () => {
        setShowConfirmation(false);
    };

    const handleConfirmDelete = async () => {
        setShowConfirmation(false);

        try {
            const response = await fetch(`http://localhost:200/enseignants/${enseignantIdToDelete}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setShowSuccess(true);
                fetchTeachers();
            } else {
                console.error('Erreur lors de la suppression de l\'enseignant:', response.statusText);
            }
        } catch (error) {
            console.error('Erreur lors de la tentative de suppression de l\'enseignant:', error.message);
        }
    };

    const resetSuccess = () => {
        setShowSuccess(false);
    };

    const handleSearch = () => {
        const searchTermLowerCase = searchTerm.toLowerCase();
        const filteredResults = teachers.filter(teacher => {
            const fullName = teacher.username.toLowerCase();
            return fullName.includes(searchTermLowerCase);
        });
        setFilteredTeachers(filteredResults);
    };

    const handleViewCourseDetails = async (ProfessorId) => {
        try {
            // Filter courses for the selected professor
            const professorCourses = courses.filter(cours => cours.ProfessorId === ProfessorId);
            if (professorCourses.length > 0) {
                setSelectedCourses(professorCourses);
                setShowCourseModal(true);
            } else {
                console.error('Course not found for the given professor ID');
            }
        } catch (error) {
            console.error('Error while trying to fetch course details:', error);
        }
    };

    const handleViewExamDetails = async (ProfessorID) => {
        console.log('ProfessorID:', ProfessorID); // Add this line to debug
        try {
          const response = await fetch(`http://localhost:800/view-Exams?username=${ProfessorID}`);
          const data = await response.json();
          if (data.length > 0) {
            setSelectedExams(data);
            setShowExamsModal(true);
          } else {
            console.error('Exams not found for the given professor ID');
          }
        } catch (error) {
          console.error('Error while trying to fetch exam details:', error);
        }
      };
      
      
      // Update the button to pass ProfessorID
      
    

    return (
        <div className="teacher-list-container">
            {showConfirmation && (
                <div className="confirmation-message-container">
                    <p>Are you sure you want to delete this teacher?</p>
                    <button onClick={handleConfirmDelete}>Yes</button>
                    <button onClick={handleCancelDelete}>No</button>
                </div>
            )}
            {showSuccess && (
                <div className="success-message-container">
                    <p>Teacher deleted successfully!</p>
                    <button onClick={resetSuccess}>OK</button>
                </div>
            )}
            <div className="teacher-list-container">
                <Col xs={12}>
                    <Card className="user-list">
                        <Card.Header>
                            <Card.Title as="h5">Teacher List</Card.Title>
                        </Card.Header>
                        <br />
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
                                        <th>Profile</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>ID</th>
                                        <th>Course</th>
                                        <th>Quiz</th>
                                        <th>Exams</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {filteredTeachers.map((teacher) => (
  <tr key={teacher.ProfessorId}>
    <td>
      <img src={avatar22} className="img-radius" alt="User Profile" style={{ width: '60px', height: '60px' }} />
    </td>
    <td>{teacher.username}</td>
    <td>{teacher.email}</td>
    <td>{teacher.ProfessorID}</td>
    <td>
      <button className="link-button" onClick={() => handleViewCourseDetails(teacher.ProfessorId)}>View More</button>
    </td>
    <td>
      <Link to={`/admin/Quiz/${teacher.ProfessorID}`} className="link-button">View More</Link>
    </td>
    <td>
      <button onClick={() => handleViewExamDetails(teacher.ProfessorID)}>View More</button>
    </td>
    <td>
      <button onClick={() => handleDelete(teacher._id)}>
        <span role="img" aria-label="Delete">🗑️</span>
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
            <Modal show={showCourseModal} onHide={() => setShowCourseModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Détails des cours</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCourses.length > 0 ? (
                        <Table responsive hover>
                            <thead>
                                <tr>
                                    <th>Course Name</th>
                                    <th>Price</th>
                                    <th>Number of Chapters</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedCourses.map((course, index) => (
                                    <tr key={index}>
                                        <td>{course.Name}</td>
                                        <td>{course.Price}</td>
                                        <td>{course.NumberofChapter}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>No courses found for this teacher.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCourseModal(false)}>Fermer</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showExamsModal} onHide={() => setShowExamsModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Exam Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedExams.length > 0 ? (
                        <Table responsive hover>
                            <thead>
                                <tr>
                                    <th>Exam Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedExams.map((exam, index) => (
                                    <tr key={index}>
                                        <td>{exam.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>No exams found for this teacher.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowExamsModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default TeacherList;
