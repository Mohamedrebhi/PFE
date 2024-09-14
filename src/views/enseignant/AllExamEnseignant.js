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
                const response = await axios.get('http://localhost:800/examens'); // Make sure this URL is correct
                setExamens(response.data);
                setFilteredExams(response.data);
            } catch (error) {
                console.error('Error fetching examens:', error);
            }
        };

        fetchExamens();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            setFilteredExams(
                examens.filter((examen) =>
                    examen.Name.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        } else {
            setFilteredExams(examens);
        }
    }, [searchTerm, examens]);

    const handleDelete = (examId) => {
        setExamToDelete(examId);
        setShowConfirmation(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:800/examens/${examToDelete}`);
            setExamens(examens.filter((examen) => examen._id !== examToDelete));
            setFilteredExams(filteredExams.filter((examen) => examen._id !== examToDelete));
        } catch (error) {
            console.error('Error deleting examen:', error);
        } finally {
            setShowConfirmation(false);
            setExamToDelete(null);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <Col>
            <Card className="shadow-sm">
                <Card.Body>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search by exam name"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Exam Name</th>
                                <th>Exam Date</th>
                                <th>Subject</th>
                                <th>Max Score</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExams.map((examen) => (
                                <tr key={examen._id}>
                                    <td>{examen.Name}</td>
                                    <td>{new Date(examen.examenDate).toLocaleDateString()}</td>
                                    <td>{examen.subject}</td>
                                    <td>{examen.maxScore}</td>
                                    <td>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => window.open(`http://localhost:800/examens/content/${examen.Name}`, '_blank')}
                                        >
                                            View Exam
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDelete(examen._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    {showConfirmation && (
                        <ConfirmationModal
                            message="Are you sure you want to delete this examen?"
                            onConfirm={confirmDelete}
                            onCancel={() => setShowConfirmation(false)}
                        />
                    )}
                </Card.Body>
            </Card>
        </Col>
    );
};

export default ExamDetail;
