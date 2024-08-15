import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

const StudentList = () => {
    const [Etudiant, setEtudiant] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEtudiants, setFilteredEtudiants] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [etudiantToDelete, setStudentToDelete] = useState(null);

    useEffect(() => {
        fetchEtudiant();
    }, []);

    useEffect(() => {
        handleSearch(); // Perform search when searchTerm changes
    }, [searchTerm]);

    const fetchEtudiant = async () => {
        try {
            const response = await axios.get('http://localhost:600/Apprenants');
            setEtudiant(response.data);
            setFilteredEtudiants(response.data); // Initialize filtered students with all students
        } catch (error) {
            console.error('Error fetching Etudiant:', error);
        }
    };

    const handleDeleteEtudiant = async () => {
        if (!etudiantToDelete) return;
    
        try {
            const response = await fetch(`http://localhost:5000/Apprenants/${etudiantToDelete._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error(`Error deleting student: ${response.statusText}`);
            }
    
            // If successful, update the state of students
            setEtudiant(Etudiant.filter(etudiant => etudiant.StudentID !== etudiantToDelete.StudentID));
            setShowConfirmation(false);
            setStudentToDelete(null);
        } catch (error) {
            console.error('Error deleting etudiant:', error);
        }
    };

    const handleDeleteConfirmation = (etudiant) => {
        setStudentToDelete(etudiant);
        setShowConfirmation(true);
    };

    const handleCancelConfirmation = () => {
        setShowConfirmation(false);
        setStudentToDelete(null);
    };

    const handleSearch = () => {
        const searchTermLowerCase = searchTerm.toLowerCase();
        
        const filteredResults = Etudiant.filter(etudiant => {
            const fullName = typeof etudiant.username === 'string' ? etudiant.username.toLowerCase() : '';
            return fullName.includes(searchTermLowerCase);
        });
    
        setFilteredEtudiants(filteredResults);
    };

    return (
        <div className="Etudiant-list-container">
            <Col xs={12}>
                <Card className="courses-list">
                    <Card.Header>
                        <Card.Title as="h5">List of Students</Card.Title>
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
                                    <th>Student ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th>Level</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEtudiants.map(etudiant => (
                                    <tr key={etudiant.id}>
                                        <td>{etudiant.StudentID}</td>
                                        <td>{etudiant.username}</td>
                                        <td>{etudiant.email}</td>
                                        <td>{etudiant.PhoneNumber}</td>
                                        <td>{etudiant.Level}</td>
                                        <td>
                                            <button onClick={() => handleDeleteConfirmation(etudiant)}>
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
                    message="Are you sure you want to delete this student?"
                    onConfirm={handleDeleteEtudiant}
                    onCancel={handleCancelConfirmation}
                />
            )}
        </div>
    );
};

export default StudentList;
