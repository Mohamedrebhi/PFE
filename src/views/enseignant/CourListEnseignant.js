import React, { useState, useEffect } from 'react';
import { Col, Card, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './List.css';

const ConfirmationModal = ({ message, onConfirm, onCancel }) => (
    <div className="confirmation-modal">
        <div className="confirmation-content">
            <p>{message}</p>
            <div className="button-group">
                <button onClick={onConfirm}>Confirm</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        </div>
    </div>
);

ConfirmationModal.propTypes = {
    message: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

const CourList = () => {
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        // Filter courses whenever the searchTerm changes
        handleSearch();
    }, [searchTerm, courses]);

    const fetchCourses = async () => {
        try {
            const response = await fetch('http://localhost:400/Cours');
            const data = await response.json();
            setCourses(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleDeleteCourse = async () => {
        if (!courseToDelete) return;
        
        try {
            const response = await fetch(`http://localhost:400/Cours/${courseToDelete._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error(`Error deleting course: ${response.statusText}`);
            }
    
            // Remove the deleted course from the local state
            setCourses(courses.filter(course => course._id !== courseToDelete._id));
            setShowConfirmation(false);
            setCourseToDelete(null);
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    const handleDeleteConfirmation = (course) => {
        setCourseToDelete(course);
        setShowConfirmation(true);
    };

    const handleCancelConfirmation = () => {
        setShowConfirmation(false);
        setCourseToDelete(null);
    };

    const handleEdit = (course) => {
        console.log("Edit course:", course);
    };

    const handleSearch = () => {
        const searchTermLowerCase = searchTerm.toLowerCase();
        
        const filteredResults = courses.filter(course => {
            const courseName = typeof course.Name === 'string' ? course.Name.toLowerCase() : '';
            return courseName.includes(searchTermLowerCase);
        });

        setFilteredCourses(filteredResults);
    };

    return (
        <div className="courses-list-container">
            <Col xs={12}>
                <Card className="courses-list">
                    <Card.Header>
                        <Card.Title as="h5">Courses List</Card.Title>
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
                    </div>
                    <Card.Body className="p-0">
                        <Table responsive hover>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Number of Chapters</th> {/* Nouvelle colonne pour afficher le fichier */}
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(searchTerm === '' ? courses : filteredCourses).map(course => (
                                    <tr key={course._id}>
                                        <td>{course.Name}</td>
                                        <td>{course.Price}</td>
                                        <td>{course.Reponses ? course.Reponses.length : 0}</td> {/* Display the number of chapter IDs */}
                                        <td>
                                            <a href="EditCourEnseignant" onClick={() => handleEdit(course)}>
                                                <button>
                                                    <span role="img" aria-label="Edit">✏️</span>
                                                </button>
                                            </a>
                                            <button onClick={() => handleDeleteConfirmation(course)}>
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
            {showConfirmation && (
                <ConfirmationModal
                    message="Are you sure you want to delete this course?"
                    onConfirm={handleDeleteCourse}
                    onCancel={handleCancelConfirmation}
                />
            )}
        </div>
    );
};

export default CourList;
