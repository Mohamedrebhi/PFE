import React, { useState } from 'react';
import { Card, Row, Col, Alert } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb/indexAdmin';
import * as Yup from 'yup';
import { Formik } from 'formik';

const SignUp1 = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (formData) => {
    try {
      const response = await fetch('http://127.0.0.1:500/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const responseData = await response.json();

      if (response.ok) {
        if (responseData.success) {
          setErrorMessage('');
          setSuccess(true);
        } else {
          setErrorMessage(responseData.message);
        }
      } else {
        throw new Error(responseData.message || 'Network response was not ok');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      setErrorMessage('An error occurred while signing up. Please try again.');
    }
  };

  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-bg">
            <span className="r" />
            <span className="r s" />
            <span className="r s" />
            <span className="r" />
          </div>
          <Card className="borderless">
            <Row className="align-items-center">
              <Col>
                <Card.Body className="text-center">
                  <div className="mb-4">
                    <i className="feather icon-user-plus auth-icon" />
                  </div>
                  <h3 className="mb-4">Sign up</h3>
                  <Formik
                    initialValues={{
                      username: '',
                      email: '',
                      password: '',
                      userType: 'student',
                      PhoneNumber: '',
                      specialty: '',
                      level: ''
                    }}
                    validationSchema={Yup.object().shape({
                      username: Yup.string().required('Username is required'),
                      email: Yup.string().email('Invalid email').required('Email is required'),
                      password: Yup.string().required('Password is required'),
                      userType: Yup.string().required('User type is required'),
                      PhoneNumber: Yup.string().required('PhoneNumber is required'),
                      specialty: Yup.string().test('specialty-required', 'Specialty is required for teachers', function (value) {
                        return this.parent.userType !== 'teacher' || value !== '';
                      }),
                      level: Yup.string().test('level-required', 'Level is required for students', function (value) {
                        return this.parent.userType !== 'student' || value !== '';
                      })
                    })}
                    onSubmit={(values, { setSubmitting }) => {
                      handleSignUp(values);
                      setSubmitting(false);
                    }}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting
                    }) => (
                      <form onSubmit={handleSubmit}>
                        <div className="input-group mb-3">
                          <input
                            type="text"
                            name="username"
                            value={values.username}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="form-control"
                            placeholder="Username"
                          />
                          {touched.username && errors.username && <small className="text-danger form-text">{errors.username}</small>}
                        </div>
                        <div className="input-group mb-3">
                          <input
                            type="email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="form-control"
                            placeholder="Email address"
                          />
                          {touched.email && errors.email && <small className="text-danger form-text">{errors.email}</small>}
                        </div>
                        <div className="input-group mb-4">
                          <input
                            type="password"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="form-control"
                            placeholder="Password"
                          />
                          {touched.password && errors.password && <small className="text-danger form-text">{errors.password}</small>}
                        </div>

                        <div className="input-group mb-4">
                          <input
                            type="text"
                            name="PhoneNumber"
                            value={values.PhoneNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="form-control"
                            placeholder="PhoneNumber"
                          />
                          {touched.PhoneNumber && errors.PhoneNumber && <small className="text-danger form-text">{errors.PhoneNumber}</small>}
                        </div>

                        {values.userType === 'teacher' && (
                          <div className="input-group mb-4">
                            <input
                              type="text"
                              name="specialty"
                              value={values.specialty}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="form-control"
                              placeholder="Specialty"
                            />
                            {touched.specialty && errors.specialty && <small className="text-danger form-text">{errors.specialty}</small>}
                          </div>
                        )}

                        {values.userType === 'student' && (
                          <div className="input-group mb-4">
                            <input
                              type="text"
                              name="level"
                              value={values.level}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="form-control"
                              placeholder="Level"
                            />
                            {touched.level && errors.level && <small className="text-danger form-text">{errors.level}</small>}
                          </div>
                        )}

                        <div className="form-group">
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="userType"
                              id="student"
                              value="student"
                              checked={values.userType === 'student'}
                              onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor="student">Étudiant</label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="userType"
                              id="teacher"
                              value="teacher"
                              checked={values.userType === 'teacher'}
                              onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor="teacher">Enseignant</label>
                          </div>
                          {touched.userType && errors.userType && <small className="text-danger form-text">{errors.userType}</small>}
                        </div>
                        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                        {success && (
                          <Alert variant="success">
                            User added successfully! Please press on the login button to sign in
                          </Alert>
                        )}
                        <button
                          className="btn btn-primary mb-4"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          Sign up
                        </button>
                      </form>
                    )}
                  </Formik>
                  <p className="mb-2">
                    Already have an account?{' '}
                    <NavLink to="/auth/signin-1" className="f-w-400">
                      Login
                    </NavLink>
                  </p>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SignUp1;
