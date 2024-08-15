import {useState, useEffect} from 'react';
import avatar1 from '../../../../assets/images/user/avatar-1.jpg';
import "./setting.css"

const adminId = "1";
const Profile = () => {
  const [adminInfo, setAdminInfo] = useState({
    Name: '',
    Email: '',
  });

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const response = await fetch(`http://localhost:5000/Admins/${adminId}`);
        if (response.ok) {
          const data = await response.json();
           console.log('admin info:', data);
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

  return (
    <div className="profile">
      <div className="profile-header">
        <h2>Profile</h2>
        <img src={avatar1} alt="Profile" className="profile-picture" />
      </div>
      <div className="profile-info">
        <div className="info-row">
          <label>Name:</label>
          <span>{adminInfo.Name}</span>
        </div>
        <div className="info-row">
          <label>Email:</label>
          <span>{adminInfo.Email}</span>
        </div>
    </div>
    </div>
  );
};

export default Profile;