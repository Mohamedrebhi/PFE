import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Row, Col, Button, Alert } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';


const FirebaseLogin = ({ className, ...rest }) => {
  const navigate = useNavigate(); // Utiliser useNavigate pour la navigation
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (values) => {
    try {
      const response = await fetch('http://127.0.0.1:500/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const responseData = await response.json();

      if (response.ok) {
        if (responseData.success) {
          setErrorMessage('');
          // Redirection vers le tableau de bord approprié en fonction du type d'utilisateur
          if (responseData.user_type === 'admin') {
            navigate('/admin/dashboard');
          } else if (responseData.user_type === 'student') {
            navigate('/etudiant/dashboard');}
          else if (responseData.user_type === 'teacher') {
            navigate('/enseignant/dashboard');
          } 
          
        } else {
          setErrorMessage(responseData.message);
        }
      } else {
        throw new Error(responseData.message || 'La connexion a échoué');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Une erreur est survenue lors de la connexion. Veuillez réessayer.');
    }
  };
  return (
    <React.Fragment>
      <Formik
        initialValues={{
          email: '',
          password: '',
          rememberMe: false,
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required(),
          password: Yup.string().max(255).required(),
        })}
        onSubmit={(values, { setSubmitting }) => {
          handleLogin(values);
          setSubmitting(false);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} className={className} {...rest}>
            <div className="form-group mb-3">
              <input
                className="form-control"
                label="Email Address / Username"
                name="email"
                placeholder="Enter email"
                onBlur={handleBlur}
                onChange={handleChange}
                type="email"
                value={values.email}
              />
              {touched.email && errors.email && <small className="text-danger form-text">{errors.email}</small>}
            </div>
            <div className="form-group mb-4">
              <input
                className="form-control"
                label="Password"
                name="password"
                placeholder="Enter password"
                onBlur={handleBlur}
                onChange={handleChange}
                type="password"
                value={values.password}
              />
              {touched.password && errors.password && <small className="text-danger form-text">{errors.password}</small>}
            </div>

            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            <div className="custom-control custom-checkbox text-start mb-4 mt-2">
              <input
                type="checkbox"
                className="custom-control-input"
                id="rememberMe"
                name="rememberMe"
                checked={values.rememberMe}
                onChange={handleChange}
              />
              <label className="custom-control-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>

            <Row>
              <Col mt={2}>
                <Button
                  className="btn-block"
                  color="primary"
                  disabled={isSubmitting}
                  size="large"
                  type="submit"
                  variant="primary"
                >
                  Sign in
                </Button>
              </Col>
            </Row>
          </form>
        )}
      </Formik>
      <hr />
    </React.Fragment>
  );
};

FirebaseLogin.propTypes = {
  className: PropTypes.string,
};

export default FirebaseLogin;