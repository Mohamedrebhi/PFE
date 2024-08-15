import React, { useState } from 'react';
import { Card, ListGroup, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';

import ChatList from './ChatList';


import avatar1 from '../../../../assets/images/user/avatar-1.jpg';
import avatar22 from '../../../../assets/images/user/avatar-22.jpg';
import avatar3 from '../../../../assets/images/user/avatar-3.jpg';
import avatar4 from '../../../../assets/images/user/avatar-4.jpg';

const initialNotiData = [
  {
    id: 1,
    name: 'Joseph William',
    image: avatar22,
    details: 'Purchase New Theme and make payment',
    activity: '30 min',
    isRead: false, // Pour indiquer si la notification est lue
  },
  {
    id: 2,
    name: 'Sara Soudein',
    image: avatar3,
    details: 'Currently logged in',
    activity: '30 min',
    isRead: false,
  },
  {
    id: 3,
    name: 'Suzen',
    image: avatar4,
    details: 'Purchase New Theme and make payment',
    activity: 'Yesterday',
    isRead: false,
  },
];
const NavRight = () => {
  const [listOpen, setListOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotiData);

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isRead: true, // Marquer comme lue
      }))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]); // Effacer toutes les notifications
  };

  const notiData = [
    {
      name: 'Joseph William',
      image: avatar22,
      details: 'Purchase New Theme and make payment',
      activity: '30 min'
    },
    {
      name: 'Sara Soudein',
      image: avatar3,
      details: 'currently login',
      activity: '30 min'
    },
    {
      name: 'Suzen',
      image: avatar4,
      details: 'Purchase New Theme and make payment',
      activity: 'yesterday'
    }
  ];


  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav ml-auto" id="navbar-right">
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown align="start">
            <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
              <i className="feather icon-bell icon" />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="notification notification-scroll">
              <div className="noti-head">
                <h6 className="d-inline-block m-b-0">Notifications</h6>
                <div className="float-end">
                  <Link to="#" onClick={markAllAsRead} className="me-2">
                    mark as read
                  </Link>
                  <Link to="#" onClick={clearAllNotifications}>clear all</Link>
                </div>
              </div>
              <PerfectScrollbar>
                <ListGroup as="ul" bsPrefix=" " variant="flush" className="noti-body">
                  <ListGroup.Item as="li" bsPrefix=" " className="n-title">
                    <p className="m-b-0">NEW</p>
                  </ListGroup.Item>
                    {notifications.map((notification) => (
                    <ListGroup.Item
                      key={notification.id}
                      as="li"
                      className={`notification ${notification.isRead ? 'read' : ''}`}
                    >{<ListGroup.Item as="li" bsPrefix=" " className="notification">
                       <Card
                         className="d-flex align-items-center shadow-none mb-0 p-0"
                         style={{ flexDirection: 'row', backgroundColor: 'unset' }}
                       ><img className="img-radius" src={avatar1} alt="Generic placeholder" />
                         <Card.Body className="p-0">
                           <p>
                             <strong>John Doe</strong>
                             <span className="n-time text-muted">
                               <i className="icon feather icon-clock me-2" />
                               30 min
                             </span>
                           </p>
                           <p>New ticket Added</p>
                         </Card.Body>
                       </Card>
                     </ListGroup.Item>}
                    </ListGroup.Item>
                  ))}
                  <ListGroup.Item as="li" bsPrefix=" " className="n-title">
                    <p className="m-b-0">EARLIER</p>
                  </ListGroup.Item>
                  {notiData.map((data, index) => {
                    return (
                      <ListGroup.Item key={index} as="li" bsPrefix=" " className="notification">
                        <Card
                          className="d-flex align-items-center shadow-none mb-0 p-0"
                          style={{ flexDirection: 'row', backgroundColor: 'unset' }}
                        >
                          <img className="img-radius" src={data.image} alt="Generic placeholder" />
                          <Card.Body className="p-0">
                            <p>
                              <strong>{data.name}</strong>
                              <span className="n-time text-muted">
                                <i className="icon feather icon-clock me-2" />
                                {data.activity}
                              </span>
                            </p>
                            <p>{data.details}</p>
                          </Card.Body>
                        </Card>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </PerfectScrollbar>
              <div className="noti-footer">
                <Link to="#">show all</Link>
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown>
            <Dropdown.Toggle as={Link} variant="link" to="#" className="displayChatbox" onClick={() => setListOpen(true)}>
              <i className="icon feather icon-mail" />
            </Dropdown.Toggle>
          </Dropdown>
        </ListGroup.Item>
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown align="start" className="drp-user">
            <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
              <i className="icon feather icon-settings" />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="profile-notification">
              <div className="pro-head">
                <img src={avatar1} className="img-radius" alt="User Profile" />
                <span>John Doe</span>
                <Link to="#" className="dud-logout" title="Logout">
                  <i className="feather icon-log-out" />
                </Link>
              </div>
              <ListGroup as="ul" bsPrefix=" " variant="flush" className="pro-body">
                <ListGroup.Item as="li" bsPrefix=" ">
                  <a href="/setting.js" className="dropdown-item">
                    <i className="feather icon-settings" /> Settings
                  </a>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="/admin/admin/profile" className="dropdown-item">
                    <i className="feather icon-user" /> Profile
                   </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="/darkmode.js" className="dropdown-item">
                    <i className="feather icon-moon" /> Dark mode
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="/admin/admin/Lock" className="dropdown-item">
                    <i className="feather icon-lock" /> Lock Screen
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i className="feather icon-log-out" /> Logout
                  </Link>
                </ListGroup.Item>
              </ListGroup>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
      </ListGroup>
      <ChatList listOpen={listOpen} closed={() => setListOpen(false)} />
    </React.Fragment>
  );
};

export default NavRight;
