import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Col, Card, Table } from 'react-bootstrap';
import axios from 'axios';
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

const ExamDetail = () => {
    const { ProfessorID } = useParams();
    const [examens, setExamens] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredExams, setFilteredExams] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [examToDelete, setExamToDelete] = useState(null);

    useEffect(() => {
        const fetchExamens = async () => {
            try {
                const response = await axios.get(`http://localhost:800/examens`);
                setExamens(response.data);
                setFilteredExams(response.data); // Initialize filtered exams with all exams
            } catch (err) {
                console.error('Error fetching examens:', err);
            }
        };
        fetchExamens();
    }, [ProfessorID]);

    useEffect(() => {
        handleSearch(); // Perform search when searchTerm changes
    }, [searchTerm]);

    const handleSearch = () => {
        const searchTermLowerCase = searchTerm.toLowerCase();
        const filteredResults = examens.filter(examen => {
            const name = examen.name ? examen.name.toLowerCase() : '';
            const date = examen.examenDate ? new Date(examen.examenDate).toLocaleDateString().toLowerCase() : '';
            const subject = examen.subject ? examen.subject.toLowerCase() : '';
            return (name.includes(searchTermLowerCase) || date.includes(searchTermLowerCase) || subject.includes(searchTermLowerCase));
        });
        setFilteredExams(filteredResults);
    };

    const handleDeleteExamen = async () => {
        if (!examToDelete) return;
    
        try {
            const response = await fetch(`http://localhost:800/examen/${examToDelete._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error(`Error deleting examen: ${response.statusText}`);
            }
    
            // If successful, update the state of exams
            setExamens(examens.filter(examen => examen._id !== examToDelete._id));
            setFilteredExams(filteredExams.filter(examen => examen._id !== examToDelete._id));
            setShowConfirmation(false);
            setExamToDelete(null);
        } catch (error) {
            console.error('Error deleting examen:', error);
        }
    };

    const handleDeleteConfirmation = (examen) => {
        setExamToDelete(examen);
        setShowConfirmation(true);
    };

    const handleCancelConfirmation = () => {
        setShowConfirmation(false);
        setExamToDelete(null);
    };

    const handleEdit = (examen) => {
        console.log("Edit examen:", examen);
    };

    return (
        <div className="exam-list-container">
            <Col xs={12}>
                <Card className="user-list">
                    <Card.Header>
                        <Card.Title as="h5">Exam List</Card.Title>
                    </Card.Header><br />
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
                                    <th>Subject</th>
                                    <th>Date</th>
                                    <th>Duration in minutes</th>
                                    <th>Content</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(searchTerm === '' ? filteredExams : filteredExams).map(examen => (
                                    <tr key={examen._id}>
                                        <td>{examen.Name}</td>
                                        <td>{examen.subject}</td>
                                        <td>{examen.examenDate ? new Date(examen.examenDate).toLocaleDateString() : 'N/A'}</td>
                                        <td>{examen.Duration}</td>
                                        <td>{examen.Contenu}</td>
                                        <td>
                                            <button onClick={() => handleEdit(examen)}>
                                                <span role="img" aria-label="Edit">✏️</span>
                                            </button>
                                            <button onClick={() => handleDeleteConfirmation(examen)}>
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
                    message="Are you sure you want to delete this exam?"
                    onConfirm={handleDeleteExamen}
                    onCancel={handleCancelConfirmation}
                />
            )}
        </div>
    );
};

export default ExamDetail;
