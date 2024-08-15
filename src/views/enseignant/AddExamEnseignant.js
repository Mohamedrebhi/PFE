import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './ExamAdd.css';

const AddExamFromQuiz = ({ ProfessorID }) => {
    const [courses, setCourses] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [filteredChapters, setFilteredChapters] = useState([]);
    const [selectedChapters, setSelectedChapters] = useState([]);
    const [selectedQuizzes, setSelectedQuizzes] = useState([]);
    const [additionalQuestions, setAdditionalQuestions] = useState([]);
    const [examenDate, setExamenDate] = useState('');
    const [maxScore, setMaxScore] = useState('');
    const [examName, setExamName] = useState('');
    const [subject, setSubject] = useState('');
    const [duration, setDuration] = useState('');
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [recommendedExams, setRecommendedExams] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('http://localhost:400/Cours');
                if (response.ok) {
                    const data = await response.json();
                    setCourses(data);
                } else {
                    console.error(`Error fetching courses: ${response.statusText}`);
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourses();
    }, []);

    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const response = await fetch('http://localhost:1000/chapitres');
                if (response.ok) {
                    const data = await response.json();
                    setChapters(data);
                } else {
                    console.error(`Error fetching chapters: ${response.statusText}`);
                }
            } catch (error) {
                console.error('Error fetching chapters:', error);
            }
        };
        fetchChapters();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            const fetchCourseDetails = async () => {
                try {
                    const response = await fetch(`http://localhost:400/Cours/${selectedCourse}`);
                    if (response.ok) {
                        const course = await response.json();
                        const chapterIds = course.Reponses;
                        const filtered = chapters.filter(chapter =>
                            chapterIds.includes(chapter.ChapterID.toString())
                        );
                        setFilteredChapters(filtered);
                    } else {
                        console.error(`Error fetching course details: ${response.statusText}`);
                    }
                } catch (error) {
                    console.error('Error fetching course details:', error);
                }
            };
            fetchCourseDetails();
        } else {
            setFilteredChapters([]);
        }
    }, [selectedCourse, chapters]);

    const handleCheckboxChange = (chapterID) => {
        if (selectedChapters.includes(chapterID)) {
            setSelectedChapters(prev => prev.filter(id => id !== chapterID));
        } else {
            setSelectedChapters(prev => [...prev, chapterID]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:800/examens', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ProfessorID,
                    name: examName,
                    subject,
                    duration,
                    content: '',
                    selectedQuizzes,
                    additionalQuestions,
                    examenDate,
                    maxScore,
                }),
            });
            if (response.ok) {
                setExamName('');
                setSubject('');
                setDuration('');
                setExamenDate('');
                setMaxScore('');
                setSelectedQuizzes([]);
                setAdditionalQuestions([]);
                setError(null);
                alert('Exam added successfully.');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Error adding exam');
            }
        } catch (error) {
            setError('Failed to connect to the server. Please try again later.');
            console.error('Error adding exam:', error);
        }
    };

    const handleAddQuestion = () => {
        setAdditionalQuestions([...additionalQuestions, { question: '', responses: [], correct: '' }]);
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...additionalQuestions];
        updatedQuestions[index][field] = value;
        setAdditionalQuestions(updatedQuestions);
    };

    const handleResponseChange = (questionIndex, responseIndex, value) => {
        const updatedQuestions = [...additionalQuestions];
        updatedQuestions[questionIndex].responses[responseIndex] = value;
        setAdditionalQuestions(updatedQuestions);
    };

    const handleRecommendExam = async () => {
        try {
            const chapterNames = filteredChapters
                .filter(chapter => selectedChapters.includes(chapter.ChapterID))
                .map(chapter => chapter.Name);
    
            if (chapterNames.length === 0) {
                alert('Please select at least one chapter.');
                return;
            }
    
            const response = await fetch('http://localhost:800/generate-exam', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chapterNames }),
            });
    
            if (response.ok) {
                const data = await response.json();
                setRecommendedExams(data.quizzes);
                setShowCourseModal(true);
            } else {
                const errorData = await response.json();
                console.error('Error fetching recommended exams:', errorData);
                alert('Failed to generate exam.');
            }
        } catch (error) {
            console.error('Error fetching recommended exams:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    return (
        <div>
            <h2>Add Exam</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Exam Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter exam name"
                        value={examName}
                        onChange={(e) => setExamName(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formBasicSubject">
                    <Form.Label>Subject</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formBasicDuration">
                    <Form.Label>Duration (minutes)</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formBasicExamenDate">
                    <Form.Label>Examen Date</Form.Label>
                    <Form.Control
                        type="date"
                        value={examenDate}
                        onChange={(e) => setExamenDate(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formBasicMaxScore">
                    <Form.Label>Max Score</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter max score"
                        value={maxScore}
                        onChange={(e) => setMaxScore(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formBasicCourse">
                    <Form.Label>Select Course</Form.Label>
                    <Form.Control
                        as="select"
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        required
                    >
                        <option value="">Select a course</option>
                        {courses.map(course => (
                            <option key={course._id} value={course._id}>{course.Name}</option>
                        ))}
                    </Form.Control>
                </Form.Group>

                {filteredChapters.length > 0 && (
                    <Form.Group controlId="formBasicChapters">
                        <Form.Label>Select Chapters</Form.Label>
                        {filteredChapters.map(chapter => (
                            <Form.Check
                                key={chapter._id}
                                type="checkbox"
                                label={chapter.Name}
                                value={chapter.ChapterID}
                                onChange={() => handleCheckboxChange(chapter.ChapterID)}
                            />
                        ))}
                    </Form.Group>
                )}

{additionalQuestions.map((question, index) => (
                    <div key={index} className="question-form">
                        <Form.Group controlId={`formQuestion${index}`}>
                            <Form.Label>Question {index + 1}</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter the question"
                                value={question.question}
                                onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                                required
                            />
                        </Form.Group>

                        {question.responses.map((response, responseIndex) => (
                            <Form.Group key={responseIndex} controlId={`formResponse${index}-${responseIndex}`}>
                                <Form.Label>Response {responseIndex + 1}</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter a response"
                                    value={response}
                                    onChange={(e) => handleResponseChange(index, responseIndex, e.target.value)}
                                    required
                                />
                            </Form.Group>
                        ))}

                        <Button
                            variant="primary"
                            onClick={() => setAdditionalQuestions(prev => {
                                const newQuestions = [...prev];
                                newQuestions[index].responses.push('');
                                return newQuestions;
                            })}
                        >
                            Add Response
                        </Button>

                        <Form.Group controlId={`formCorrectAnswer${index}`}>
                            <Form.Label>Correct Response Index</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter the index of the correct response"
                                value={question.correct}
                                onChange={(e) => handleQuestionChange(index, 'correct', e.target.value)}
                                required
                            />
                        </Form.Group>
                    </div>
                ))}

                <Button
                    variant="primary"
                    onClick={handleAddQuestion}
                >
                    Add Question
                </Button>

                <Button
                    variant="success"
                    type="submit"
                >
                    Submit
                </Button>

                <Button
                    variant="info"
                    onClick={handleRecommendExam}
                >
                    Recommend Exam
                </Button>

                {error && <p className="text-danger">{error}</p>}
            </Form>

            <Modal show={showCourseModal} onHide={() => setShowCourseModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Recommended Exam</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Question</th>
                                <th>Responses</th>
                                <th>Correct Answer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recommendedExams.map((exam, index) => (
                                <tr key={index}>
                                    <td>{exam.question}</td>
                                    <td>
                                        {exam.responses.join(', ')}
                                    </td>
                                    <td>{exam.correct}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCourseModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

AddExamFromQuiz.propTypes = {
    ProfessorID: PropTypes.string.isRequired,
};

export default AddExamFromQuiz;

