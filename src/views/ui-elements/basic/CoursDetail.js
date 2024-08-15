import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Spinner, Alert, Table } from 'react-bootstrap'; // Components for style and functionality

const CoursDetail = () => {
  const { ProfessorID } = useParams(); // Retrieve the ProfessorID from the URL
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCourseID, setCurrentCourseID] = useState(null); // Track the expanded course
  const [modules, setModules] = useState([]); // Store the list of modules

  // Fetch courses for the professor
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      setError(null); // Reset errors

      try {
        const response = await fetch(`http://localhost:600/Cours/Professor/${ProfessorID}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Courses not found for this professor.');
          } else {
            setError(`Error ${response.status}: ${response.statusText}`);
          }
        } else {
          const data = await response.json();
          setCourses(data); // Update the list of courses
        }
      } catch (err) {
        setError(`An error occurred: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [ProfessorID]); // React when ProfessorID changes

  // Handle the click event to toggle course expansion
  const handleCourseClick = async (course) => {
    const isCourseExpanded = currentCourseID === course.CourseID;
    setCurrentCourseID(isCourseExpanded ? null : course.CourseID); // Toggle course ID
    setModules([]); // Reset modules when collapsing

    if (!isCourseExpanded) {
      // Fetch modules only if the course is not expanded
      try {
        const response = await fetch(`http://localhost:600/Modules/${course.CourseID}`);
        if (response.ok) {
          const data = await response.json();
          setModules(data); // Update the list of modules
        } else {
          setError('Could not fetch modules');
        }
      } catch (err) {
        setError(`An error occurred while fetching modules: ${err.message}`);
      }
    }
  };

  return (
    <div className="course-detail">
      {isLoading ? (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : courses.length > 0 ? (
        <Table responsive hover>
          <thead>
            <tr>
              <th>Course Name</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <React.Fragment key={course._id}>
                <tr>
                  <td>
                    <Link to="#" onClick={() => handleCourseClick(course)}>
                      {course.Name}
                    </Link>
                  </td>
                </tr>
                {currentCourseID === course.CourseID && (
                  <tr>
                    <td colSpan="2">
                      {modules.length > 0 ? (
                        <div>
                          {modules.map((module) => (
                            <div key={module._id}>
                              <h3>{module.ModuleName}</h3>
                              <ul>
                                {(module.Chapters || []).map((chapter, index) => (
                                  <li key={index}><Link to={'#'}  >{chapter}</Link></li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>No modules found for this course.</p>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No courses found for this professor.</p>
      )}
    </div>
  );
};

export default CoursDetail;
