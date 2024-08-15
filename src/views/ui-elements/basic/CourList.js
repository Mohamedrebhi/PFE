import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './CourList.css';

// Composant Course qui reçoit des props
const Course = () => (
  <div className="course">
    <h3>{Name}</h3>
    <h6>Price:{Price}$</h6>
    <Link to={`/Cours`}> {/* Navigation vers la page avec le paramètre courseId */}
      Accéder au cours
    </Link>
  </div>
);

const CourList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Utilisez useEffect pour récupérer les cours lors du montage du composant
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/Cours'); // Endpoint de votre API
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const coursesData = await response.json();
        setCourses(coursesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses(); // Récupérez les cours
  }, []); // Exécuté une seule fois lors du montage

  if (loading) {
    return <div>Chargement...</div>; // Affiche un message pendant le chargement
  }

  if (error) {
    return <div>Erreur : {error}</div>; // Affiche un message d'erreur en cas de problème
  }

  return (
    <div className="educational-platform">
      <div className="courses-list">
        {courses.map((course) => (
          <Course
            key={course._id} // Utilisation de l'ID unique comme clé
            courseId={course._id} // Passez l'ID pour la navigation
            Name={course.Name} // Passez le nom du cours
            Price={course.Price}
          />
        ))}
      </div>
    </div>
  );
};

export default CourList;
