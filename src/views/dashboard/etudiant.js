import React, { useEffect, useState } from 'react';
import { Button, Badge, Card, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import avatar22 from '../../assets/images/user/avatar-22.jpg'; // Importer l'image correctement
import logo from '../../assets/images/log.PNG'; // Assurez-vous que le chemin est correct
import '../../views/enseignant/chapter.css';

const ChapitreAdd = () => {
  const [chapitre, setChapitre] = useState('chap1'); // Nom de chapitre par défaut
  const [recommendation, setRecommendation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    handleGetDefaultReformulation();
  }, []);

  const handleGetDefaultReformulation = async () => {
    try {
      const response = await fetch('http://localhost:4002/get_reformulation', {
        method: 'GET'
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendation(data.reformulated_text);
        setErrorMessage('');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error);
        setRecommendation('');
      }
    } catch (error) {
      setErrorMessage('Error getting default reformulation: ' + error.message);
      setRecommendation('');
      console.error('Error getting default reformulation:', error);
    }
  };

  const handleChapitreChange = (e) => {
    setChapitre(e.target.value);
    handleGetDefaultReformulation(); // Fetch recommendation when chapter changes
  };

  return (
    <div className="container">
      <h4>Recommandation de Chapitre</h4>
      <hr />
      <div className="form-group">
        <label htmlFor="chapitre">Nom du Chapitre</label>
        <input type="text" id="chapitre" value={chapitre} onChange={handleChapitreChange} />
      </div>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <div className="form-group">
        <label htmlFor="recommendation">Recommandation</label>
        <textarea
          id="recommendation"
          value={recommendation}
          readOnly
          style={{ width: '100%', height: '200px', resize: 'vertical' }}
        />
      </div>
    </div>
  );
};

const Component = () => {
  const [cours, setCours] = useState([]);
  const [error, setError] = useState(null);
  const [exams, setExamens] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setError(null);
      try {
        const response = await fetch('http://localhost:400/Cours');
        if (!response.ok) {
          if (response.status === 404) {
            setError('Aucun cours trouvé pour cet étudiant.');
          } else {
            setError(`Erreur ${response.status}: ${response.statusText}`);
          }
        } else {
          const data = await response.json();
          setCours(data);
        }
      } catch (err) {
        setError(`Une erreur s'est produite: ${err.message}`);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchExamens = async () => {
      setError(null);
      try {
        const response = await fetch('http://localhost:800/examens');
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched examens:", data);
        setExamens(data);
      } catch (err) {
        console.error('Error fetching examens:', err);
        setError(`No Exam found`);
      }
    };

    fetchExamens();
  }, []);

  const handleViewExam = (exam) => {
    setSelectedExam(exam);
    setShowModal(true);
  };

  return (
    <>
      <header className="d-flex align-items-center justify-content-between px-4 bg-dark text-white" style={{ height: '74px' }}>
        <div className="d-flex align-items-center gap-3">
        <img src={logo} alt="" style={{ width: '110px', height: '70px' }}></img>
          <nav className="d-none d-md-flex gap-3">
            <a className="text-white" href="#cours">
              Courses
            </a>
            <a className="text-white" href="#examens">
              Exams
            </a>
            <a className="text-white" href="#quiz">
              Quiz
            </a>
            <a className="text-white" href="/etudiant/profilel">
              Profil
            </a>
          </nav>
        </div>
        <Button className="d-md-none" size="sm" variant="outline-light">
          <span className="sr-only">Basculer la navigation</span>
        </Button>
      </header>
      <main className="flex-1 p-4">
        {error ? (
          <div className="alert alert-danger" role="alert">
            Erreur: {error}
          </div>
        ) : (
          <>
            <section id="cours" className="mb-4">
              <h2 className="h4 mb-3">Courses</h2>
              <div className="row">
                {cours.map(cours => (
                  <div className="col-sm-6 col-lg-4 mb-3" key={cours._id}>
                    <Card>
                      <Card.Body>
                        <h3 className="h5">{cours.Name}</h3>
                        <p className="text-muted"></p>
                        <div className="d-flex justify-content-between align-items-center">
                          <Button variant="link">View course</Button>
                          <Badge bg="primary">In progress</Badge>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
            </section>
            <section id="examens" className="mb-4">
              <h2 className="h4 mb-3">Exams</h2>
              {exams.map(exam => (
                <div key={exam._id} className="mb-3">
                  <Card>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h3 className="h5">{exam.nom}</h3>
                        <Badge bg="secondary">Rendu</Badge>
                      </div>
                      <p className="text-muted mb-3">
                        Date exam: {new Date(exam.date).toLocaleDateString()}<br />
                        Score maximum: {exam.maxScore}
                      </p>
                      <Button variant="outline-primary" onClick={() => handleViewExam(exam)}>
                        View détails
                      </Button>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </section>
            <section id="quiz" className="mb-4">
              <h2 className="h4 mb-3">Quiz</h2>
              <Card>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h3 className="h5"></h3>
                    <Badge bg="secondary"></Badge>
                  </div>
                  <p className="text-muted mb-3"></p>
                  <Button href='/etudiant/etudiant/quiz' variant="outline-primary">Passer quiz</Button>
                </Card.Body>
              </Card>
            </section>
          </>
        )}
        <section id="quiz" className="mb-4">
          <ChapitreAdd /> {/* Ajouter la composante ChapitreAdd */}
        </section>
        <section id="profil">
          <h2 className="h4 mb-3">Profil</h2>
          <div className="row align-items-center">
            <div className="col-auto">
              <img src={avatar22} alt="Avatar" className="rounded-circle" width="64" height="64" />
            </div>
            <div className="col">
              <h3 className="h5 mb-0">Mohamed Rebhi</h3>
              <p className="text-muted"></p>
              <Button href='/etudiant/etudiant/profile' className="text-white mb-1">Edit profil</Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-dark text-white text-center py-3">
        &copy; {new Date().getFullYear()} SmartLearn.
      </footer>
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Détails de l'examen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedExam && (
            <div>
              <h4>{selectedExam.nom}</h4>
              <p>Date: {new Date(selectedExam.date).toLocaleDateString()}</p>
              <p>Score maximum: {selectedExam.maxScore}</p>
              <p>Description: {selectedExam.description}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Component;
