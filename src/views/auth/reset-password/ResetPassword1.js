import React, { useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

const ResetPassword1 = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [resetStatus, setResetStatus] = useState(null);

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    setEmailError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputEmail)) {
      setEmailError('Please enter a valid email address.');
    }
  };

  const handleSubmit = async () => {
    if (!email || emailError) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:900/api/reset-password', { email });
      setResetStatus('Password reset email sent!');
      console.log(response.data);  // Log success response
    } catch (error) {
      setResetStatus('Error resetting password. Please try again later.');
      console.error('Error response:', error.response);  // Log detailed error response
      if (error.response && error.response.data && error.response.data.error) {
        setResetStatus(`Error: ${error.response.data.error}`);
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-content">
        <Card className="borderless">
          <Row className="align-items-center text-center">
            <Col>
              <Card.Body className="card-body">
                <div className="mb-4">
                  <i className="feather icon-mail auth-icon" />
                </div>
                <h3 className="mb-3 f-w-400">Reset Password</h3>
                <div className="input-group mb-4">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email address"
                    value={email}
                    onChange={handleEmailChange}
                  />
                </div>
                {emailError && <p className="text-danger">{emailError}</p>}
                <button className="btn btn-primary mb-4" onClick={handleSubmit} disabled={!email || emailError}>
                  Reset password
                </button>
                {resetStatus && <p className={`mb-0 ${resetStatus.includes('Error') ? 'text-danger' : 'text-success'}`}>{resetStatus}</p>}
                <p className="mb-0 text-muted">
                  Don't have an account?{' '}
                  <NavLink to="/auth/signup-1" className="f-w-400">
                    Signup
                  </NavLink>
                </p>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword1;