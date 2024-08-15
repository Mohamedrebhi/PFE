import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Col, Card, Table } from 'react-bootstrap';

const ExamDetail = () => {
    const { ProfessorID } = useParams(); // Récupération de l'identifiant du professeur
    const [examens, setExamens] = useState([]); // État pour stocker les examens
    const [error, setError] = useState(null); // État pour les erreurs
    const [isLoading, setIsLoading] = useState(true); // État pour indiquer le chargement

    useEffect(() => {
        const fetchExamens = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`http://localhost:600/Examens`);
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();

                console.log("Fetched examens:", data);

                setExamens(data); // Correctement assigner les données aux examens
            } catch (err) {
                console.error('Error fetching examens:', err);
                setError(`No Exam found`);
            }

            setIsLoading(false);
        };

        fetchExamens();
    }, [ProfessorID]); // Dépendance pour l'exécution de l'effet

    return (
        <div className="teacher-list-container">
            <Col xs={12}>
                <Card className="user-list">
                    <Card.Header>
                        <Card.Title as="h5">Exam List</Card.Title>
                    </Card.Header>
                    <Card.Body className="p-0">
                        <Table responsive hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Subject</th>
                                    <th>Date</th>
                                    <th>Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="4">Loading...</td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan="4">{error}</td>
                                    </tr>
                                ) : examens.length > 0 ? (
                                    examens.map((examen) => (
                                        <tr key={examen._id}> {/* Clé unique */}
                                            <td>{examen.id}</td>
                                            <td>{examen.nom}</td>
                                            <td>{examen.sujet}</td>
                                            <td>{examen.date}</td>
                                            <td>{examen.durée}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">No exams found</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Col>
        </div>
    );
};

export default ExamDetail;
