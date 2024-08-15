import React, { useState } from 'react';
import avatar1 from '../../../../assets/images/user/avatar-1.jpg';
import './lock.css';

const LockScreen = () => {
  const [password, setPassword] = useState('');
  const [isLocked, setIsLocked] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleUnlock = () => {
    if (password === '123') { // Replace with your desired password validation logic
      setIsLocked(false);
      setErrorMessage('');
      navigateToHomePage(); // Navigate to the home page
    } else {
      setErrorMessage('Invalid password. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsLocked(true);
    setPassword('');
    setErrorMessage('');
  };

  const navigateToHomePage = () => {
    window.location.href = '/home'; // Replace with the actual URL of your home page
  };

  return (
    <div className="lock-screen">
      {isLocked ? (
        <>
          <h2>Locked</h2>
          <img src={avatar1} alt="Profile" className="profile-picture" />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleUnlock}>Unlock</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </>
      ) : (
        <>
          <h2>Welcome back!</h2>
          <img src={avatar1} alt="Profile" className="profile-picture" />
          <p>You are now logged in.</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </div>
  );
};

export default LockScreen;