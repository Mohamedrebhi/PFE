import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Col, Card, Table } from 'react-bootstrap';
import './List.css';

const AllChapter = () => {
    const [chapitre, setChapitre] = useState([]);
    const [loadingError, setLoadingError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredChapters, setFilteredChapters] = useState([]);

    useEffect(() => {
        fetchChapitre();
    }, []);

    const fetchChapitre = async () => {
        try {
            const response = await fetch('http://localhost:1000/chapitres');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setChapitre(data);
            setFilteredChapters(data);
            setLoadingError(null);
        } catch (error) {
            console.error('Error fetching chapitre:', error);
            setLoadingError('Error fetching chapitre: ' + error.message);
        }
    };

    const handleDeleteChapitre = async (id) => {
        try {
            const response = await fetch(`http://localhost:1000/chapitre/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const updatedChapters = chapitre.filter(chap => chap._id !== id);
            setChapitre(updatedChapters);
            setFilteredChapters(updatedChapters);
        } catch (error) {
            console.error('Error deleting chapitre:', error);
        }
    };

    const handleViewFile = async (id) => {
        try {
            const response = await fetch(`http://localhost:1000/chapitre/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const blob = await response.blob();
            const fileURL = URL.createObjectURL(blob);
            window.open(fileURL); // Open PDF in a new window/tab
        } catch (error) {
            console.error('Error viewing file:', error);
        }
    };

    const handleSearch = (event) => {
        const searchTermLowerCase = event.target.value.toLowerCase();
        setSearchTerm(event.target.value);
    
        const filteredResults = chapitre.filter(chapter => {
            const fullName = typeof chapter.Name === 'string' ? chapter.Name.toLowerCase() : '';
            const courseID = chapter.CourseID !== undefined ? String(chapter.CourseID) : '';
    
            // Debugging: Log values to see what's happening
            console.log(`Chapter Name: ${fullName}, Course ID: ${courseID}`);
    
            return fullName.includes(searchTermLowerCase) || courseID.includes(searchTermLowerCase);
        });
        setFilteredChapters(filteredResults);
    };
    

    return (
        <div className="Chapter-list-container">
            <Col xs={12}>
            {loadingError && <p>{loadingError}</p>}
            <Card className="courses-list">
            <Card.Header>
                <Card.Title as="h5">List of chapters</Card.Title>
            </Card.Header><br></br>
            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearch} // Trigger handleSearch on change
                />
            </div>
            <Card.Body className="p-0">
            <Table responsive hover>
                <thead>
                    <tr>
                        <th>NameChapter</th>
                        <th>File</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredChapters.map(chap => (
                        <tr key={chap._id}>
                            <td>{chap.Name}</td>
                            <td>
                                <a href="#" onClick={() => handleViewFile(chap._id)}>View File</a>
                            </td>
                            <td>
                                <button onClick={() => handleDeleteChapitre(chap._id)}>
                                    <span role="img" aria-label="Delete">🗑️</span>
                                </button>
                                <Link to={`#`}>
                                    <button>
                                        <span role="img" aria-label="Edit">✏️</span>
                                    </button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
                </Table>
          </Card.Body>
        </Card>
      </Col>
    </div>
    );
};

export default AllChapter;
