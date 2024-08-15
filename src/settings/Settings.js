import React, { useState , useEffect } from 'react';
import './editprofile.css';
import defaultProfilePic from './pp.png'; 
import axios from 'axios';

const EditProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  useEffect(() => {
    if (profilePicture) {
      saveProfile();
    }
  }, [profilePicture]);

  const saveProfile = async () => {
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('birthday', birthday);
    formData.append('gender', gender);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('address', address);
    formData.append('streetNumber', streetNumber);
    formData.append('city', city);
    formData.append('state', state);
    formData.append('zipCode', zipCode);
    formData.append('profilePicture', profilePicture);
    try {
      await axios.post('/edit-profile', formData);
      console.log('Profile saved successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };
  
  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleBirthdayChange = (event) => {
    setBirthday(event.target.value);
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleStreetNumberChange = (event) => {
    setStreetNumber(event.target.value);
  };

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleStateChange = (event) => {
    setState(event.target.value);
  };

  const handleZipCodeChange = (event) => {
    setZipCode(event.target.value);
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setProfilePicture(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    setProfilePicture(defaultProfilePic);
  }, []);

  const handleProfilePictureModification = () => {
    document.getElementById('profile-picture-input').click();
  };
  const stateOptions = [
    'Tunis Governorate',
    'Sfax Governorate',
    'Sousse Governorate',
    'Gabes Governorate',
    'Bizerte Governorate',
    'Ariana Governorate',
    'Kairouan Governorate',
    'Gafsa Governorate',
    'Monastir Governorate',
    'Ben Arous Governorate',
  ];
  const cityOptions = [
    'Tunis',
    'Sfax',
    'Sousse',
    'Gabes',
    'Bizerte',
    'Ariana',
    'Kairouan',
    'Gafsa',
    'Monastir',
    'La Marsa',
    // Add more cities as needed
  ];
  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform form submission logic here
    // e.g., send data to the server
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Birthday:', birthday);
    console.log('Gender:', gender);
    console.log('Email:', email);
    console.log('Phone:', phone);
    console.log('Address:', address);
    console.log('Street Number:', streetNumber);
    console.log('City:', city);
    console.log('State:', state);
    console.log('Zip Code:', zipCode);
    console.log('Profile Picture:', profilePicture);
  };

  return (
    <div className="edit-profile">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
      <div className="form-row">
          <div className="form-group">
            <label htmlFor="profile-picture">Profile Picture:</label>
            <input
              type="file"
              id="profile-picture-input"
              accept="image/*"
              onChange={handleProfilePictureChange}
              style={{ display: 'none' }}
            />
            <button
              className="profile-picture-preview"
              onClick={handleProfilePictureModification}
            >
              {profilePicture ? (
                <img src={profilePicture} alt="Profile" className="profile-image" />
              ) : (
                <div className="icon-container">
                  <i className="fas fa-pencil-alt"></i>
                </div>
              )}
            </button>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="first-name">First Name:</label>
            <input
            placeholder='mme'
              type="text"
              id="first-name"
              value={firstName}
              onChange={handleFirstNameChange}
              required />
          </div>
          <div className="form-group">
            <label htmlFor="last-name">Last Name:</label>
            <input
              type="text"
              id="last-name"
              value={lastName}
              onChange={handleLastNameChange}
              required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="birthday">Birthday:</label>
            <input
              type="date"
              id="birthday"
              value={birthday}
              onChange={handleBirthdayChange}
              required />
          </div>
          <div className="form-group">
            <label htmlFor="gender">Gender:</label>
            <select id="gender" value={gender} onChange={handleGenderChange} required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>

            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone:</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={handleAddressChange}
              required />
          </div>
          <div className="form-group">
            <label htmlFor="street-number">Street Number:</label>
            <input
              type="text"
              id="street-number"
              value={streetNumber}
              onChange={handleStreetNumberChange}
              required />
          </div>
        </div>
        <div className="form-group">
          
          <label htmlFor="state">State:</label>
            <select
              id="state"
              value={state}
              onChange={handleStateChange}
              required
            >
              <option value="">Select a state</option>
              {stateOptions.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City:</label>
            <select
              id="city"
              value={city}
              onChange={handleCityChange}
              required
            >
              <option value="">Select a city</option>
              {cityOptions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
        
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="zip-code">Zip Code:</label>
          <input
            type="text"
            id="zip-code"
            value={zipCode}
            onChange={handleZipCodeChange}
            required />
        </div>
      </div><div className="form-row">
        <button type="submit">Save</button>
      </div>
      </form>
    </div>
  );
};

export default EditProfile;