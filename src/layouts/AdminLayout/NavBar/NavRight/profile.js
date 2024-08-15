import React, { useState, useEffect } from 'react';
import { Formik, Field } from 'formik';
import avatar1 from '../../../../assets/images/user/avatar-1.jpg';
import { BsPerson, BsEnvelope, BsLock, BsUpload, BsShieldLockFill } from 'react-icons/bs';

const adminId = "1";

const ProfilePage = () => {
  const [adminInfo, setAdminInfo] = useState({
    Name: '',
    Email: '',
  });

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const response = await fetch(`http://localhost:300/Admins/${adminId}`);
        if (response.ok) {
          const data = await response.json();
          // console.log('admin info:', data);
          setAdminInfo({
            Name: data.Name,
            Email: data.Email,
          });
        } else {
          throw new Error("Failed to fetch admin information");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchAdminInfo();
  }, []);

  const handleSubmitUserForm = async (values) => {
    console.log('User form submitted with values:', values);

    try {
      const response = await fetch(`http://localhost:300/Admins/${adminId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        console.log('User data submitted successfully!');
        // Add additional logic here if needed
      } else {
        console.error('Error submitting user data:', response.statusText);
        // Handle errors if necessary
      }
    } catch (error) {
      console.error('Error attempting to submit user data:', error.message);
      // Handle errors if necessary
    }
  };

  const handleSubmitPasswordForm = async (values) => {
    console.log('Password form submitted with values:', values);
    try {
      const response = await fetch(`http://localhost:600/Admins/${adminId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });
  
      if (response.ok) {
        console.log('User data submitted successfully!');
        // Add additional logic here if needed
      } else {
        console.error('Error submitting user data:', response.statusText);
        // Handle errors if necessary
      }
    } catch (error) {
      console.error('Error attempting to submit user data:', error.message);
      // Handle errors if necessary
    }
  };  

  const handleCancel = (formik) => {
    formik.resetForm(); // Reset the form to its initial values
  };

  const handleUpload = () => {
    const fileInput = document.getElementById('fileInput');
    fileInput.click(); // Déclenche le clic sur l'input de type file

    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0]; // Récupère le fichier sélectionné
      const formData = new FormData(); // Crée un nouvel objet FormData

      // Ajoute le fichier sélectionné à l'objet FormData
      formData.append('file', file);

      // Envoie le FormData vers le serveur (vous devez implémenter la logique côté serveur pour gérer le téléchargement)
      fetch('URL_DU_ENDPOINT_DE_TÉLÉCHARGEMENT', {
        method: 'POST',
        body: formData,
      })
        .then(response => {
          if (response.ok) {
            console.log('Téléchargement réussi');
            // Effectuer des actions supplémentaires si nécessaire
          } else {
            console.error('Échec du téléchargement');
            // Gérer les erreurs si nécessaire
          }
        })
        .catch(error => {
          console.error('Erreur lors de la tentative de téléchargement:', error);
          // Gérer les erreurs si nécessaire
        });
    });
  };

  return (
    <div className="row">
      <div className="col-md-12 mb-4">
        <h3><BsPerson/>Profile</h3>
        <div className="card">
          <div className="card-body">
            <div className="text-center mb-4">
              <img src={avatar1} alt="Avatar" className="profile-picture" style={{ width: '200px', height: '200px' }} /><br />
              <div><br />
                <h5>Avatar</h5>
                <button className="btn btn-primary" onClick={handleUpload}><BsUpload /> Upload </button>
                <input type="file" id="fileInput" style={{ display: 'none' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <Formik
              initialValues={adminInfo}
              onSubmit={handleSubmitUserForm}
            >
              {({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="Name"><BsPerson /> Name</label>
                    <Field type="text" name="Name" value={adminInfo.Name} className="form-control" style={{ fontFamily: 'Arial, sans-serif' }} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="Email"><BsEnvelope /> Email</label>
                    <Field type="email" name="Email" value={adminInfo.Email} className="form-control" style={{ fontFamily: 'Arial, sans-serif' }} required />
                  </div><br />
                  <button type="submit" className="btn btn-primary">Submit</button>
                  <button type="button" className="btn btn-secondary ml-2" onClick={() => handleCancel()}>Cancel</button>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <Formik
              initialValues={{
                currentPassword: '',
                newPassword: '',
                newPasswordConfirmation: '',
              }}
              onSubmit={handleSubmitPasswordForm}
            >
              {({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="currentPassword"><BsShieldLockFill /> Current Password</label>
                    <Field type="password" name="currentPassword" className="form-control" style={{ fontFamily: 'Arial, sans-serif' }} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="Password"><BsLock /> New Password</label>
                    <Field type="Password" name="Password" className="form-control" style={{ fontFamily: 'Arial, sans-serif' }} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="PasswordConfirmation"><BsLock /> Confirm New Password</label>
                    <Field type="Password" name="PasswordConfirmation" className="form-control" style={{ fontFamily: 'Arial, sans-serif' }} required />
                  </div><br />
                  <button type="submit" className="btn btn-primary">Submit</button>
                  <button type="button" className="btn btn-secondary ml-2" onClick={() => handleCancel()}>Cancel</button>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
