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
    const [etudiantToDelete, setEtudiantToDelete] = useState(null);

    useEffect(() => {
        fetchEtudiant();
    }, []);

    useEffect(() => {
        handleSearch();
    }, [searchTerm]);

    const fetchEtudiant = async () => {
        try {
            const response = await axios.get('http://localhost:600/Apprenants');
            setEtudiant(response.data);
            setFilteredEtudiants(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const handleDeleteConfirmation = (etudiant) => {
        setEtudiantToDelete(etudiant);
        setShowConfirmation(true);
    };

    const handleCancelConfirmation = () => {
        setShowConfirmation(false);
        setEtudiantToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!etudiantToDelete || !etudiantToDelete.StudentID) {
            console.error('No student selected for deletion.');
            return;
        }

        setShowConfirmation(false);

        try {
            const response = await axios.delete(`http://localhost:600/Apprenants/${etudiantToDelete.StudentID}`);
            if (response.status === 200) {
                setEtudiant(prevEtudiants =>
                    prevEtudiants.filter(etudiant => etudiant.StudentID !== etudiantToDelete.StudentID)
                );
                setFilteredEtudiants(prevFiltered =>
                    prevFiltered.filter(etudiant => etudiant.StudentID !== etudiantToDelete.StudentID)
                );
            } else {
                console.error('Failed to delete student:', response.statusText);
            }
        } catch (error) {
            console.error('Error during deletion:', error.message);
        }

        setEtudiantToDelete(null);
    };

    const handleSearch = () => {
        const searchTermLowerCase = searchTerm.toLowerCase();

        const filteredResults = Etudiant.filter((etudiant) => {
            const fullName = etudiant.username?.toLowerCase() || '';
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
                                {filteredEtudiants.map((etudiant) => (
                                    <tr key={etudiant.StudentID}>
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
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelConfirmation}
                />
            )}
        </div>
    );
};

export default StudentList;
        