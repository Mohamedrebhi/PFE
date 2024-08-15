import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Spinner, Alert } from 'react-bootstrap';
import './CoursList.css'; // Assurez-vous que ce fichier contient des styles pertinents

const CoursList = () => {
  const { ProfessorID } = useParams(); // Récupérer le ProfessorID de l'URL
  const [cours, setCours] = useState([]); // Stocker la liste des cours
  const [isLoading, setIsLoading] = useState(true); // Indicateur de chargement
  const [error, setError] = useState(null); // Gérer les erreurs

  useEffect(() => {
    const fetchCours = async () => {
      setIsLoading(true); // Commencer le chargement
      setError(null); // Réinitialiser les erreurs

      try {
        const response = await fetch(`http://localhost:5000/Cours/Professor/${ProfessorID}`);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`); // Gérer les erreurs
        }

        const data = await response.json(); // Extraire les données JSON
        setCours(data); // Mettre à jour la liste des cours
      } catch (err) {
        setError(`An error occurred: ${err.message}`); // Définir le message d'erreur
      } finally {
        setIsLoading(false); // Arrêter le chargement
      }
    };

    fetchCours(); // Récupérer les cours au chargement du composant
  }, [ProfessorID]); // Re-réagir au changement de ProfessorID

  return (
    <div className="cours-list-container">
      {isLoading ? ( // Afficher un indicateur de chargement
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      ) : error ? ( // Afficher un message d'erreur si nécessaire
        <Alert variant="danger">{error}</Alert>
      ) : cours.length > 0 ? ( // Afficher les cours dans un tableau
        <Table responsive hover>
          <thead>
            <tr>
              <th>Nom du Cours</th>
              <th>Description</th> {/* Ajouter d'autres colonnes si nécessaire */}
            </tr>
          </thead>
          <tbody>
            {cours.map((cour) => (

              <tr key={cour._id}> {/* Clé unique */}
                <td>{cour.Name}</td> {/* Nom du cours */}
                <td>{cour.Description}</td> {/* Description */}
              </tr>
            ))}
          </tbody>
        </Table>
      ) : ( // Afficher un message si aucun cours n'est trouvé
        <p>Aucun cours trouvé pour ce professeur.</p>
      )}
    </div>
  );
};

export default CoursList;
