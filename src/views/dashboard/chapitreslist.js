import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ChapterListPage = () => {
  const [chapters, setChapters] = useState([]);
  const [loadingError, setLoadingError] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const courseName = queryParams.get('course_name');

  useEffect(() => {
    if (!courseName) return;

    const fetchChapters = async () => {
      try {
        const response = await axios.get('http://localhost:1000/chapitres', {
          params: { courseName }
        });
        setChapters(response.data);
        setLoading(false);
      } catch (error) {
        setLoadingError('Failed to load chapters');
        setLoading(false);
      }
    };

    fetchChapters();
  }, [courseName]);

  return (
    <div>
      <h1>Chapters for {courseName}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : loadingError ? (
        <p>{loadingError}</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Chapter ID</th>
              <th>Chapter Name</th>
              <th>Content</th>
            </tr>
          </thead>
          <tbody>
            {chapters.map(chapter => (
              <tr key={chapter._id}>
                <td>{chapter.ChapterID}</td>
                <td>{chapter.Name}</td>
                <td>
                  <Button href={`http://localhost:400/cours${chapter.Name}`} target="_blank">
                    View File
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ChapterListPage;
