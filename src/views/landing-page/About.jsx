/* eslint-disable */

import React from 'react';
import {ProgressBar, Container} from 'react-bootstrap'; // Utilisation de Bootstrap pour les composants
import styles from './Home.module.css';
import 'owl.carousel/dist/assets/owl.carousel.css';
import Footer from './Footer';
import Header from './Header';
//import 'owl.carousel/dist/assets.owl.theme.default.css';

const ProgressInfo = ({ title, progress }) => (
  <div className={styles['progress-info']}>
    <h6 className={styles['progress-tittle']}>
      {title} <span>{progress}%</span>
    </h6>
    <ProgressBar now={progress} striped variant="info" />
  </div>
);

const StatsCounter = ({ number, unit, description }) => (
  <div className={styles['stats_info']}>
    <p className={styles['counter']}>
      {number} {unit}
    </p>
    <h3>{description}</h3>
  </div>
);

// Option de configuration pour Owl Carousel

const About = () => {
  const OwlOptions = {
    loop: true,
    margin: 0,
    nav: false,
    dots: false,
    responsiveClass: true,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplaySpeed: 1000,
    autoplayHoverPause: false,
    responsive: {
      0: { items: 1 },
      480: { items: 1 },
      667: { items: 1 },
      1000: { items: 1, nav: true },
    },
  };

  return(
    <div>
    <Header/>
    <div className={styles['about-container']}>
      <section className={styles['breadcrumb']} id="about">
        <Container>
          <h2 className={styles['title']}>About Company</h2>
        </Container>
      </section><br></br><br></br><br></br><br></br><br></br><br></br>

    {/* Section Services */}
    <section className={`${styles['home-services']}`} id="services">
      <Container>
      <div className={`${styles.container}`}>
        <div className={`${styles.row}`}>
          {/* Mission */}
          <div className={`${styles['col-lg-4']}`} key="mission">
            <div className={`${styles['box-wrap']}`}>
              <div className={`${styles['box-wrap-grid']}`}>
                <div className={`${styles.icon}`}>
                  <span className={`${styles.fa} ${styles['fa-graduation-cap']}`} />
                </div>
                <div className={`${styles.info}`}>
                  <p>Our Mission</p>
                  <h4>
                    <a href="#url">Mission</a>
                  </h4>
                </div>
              </div>
              <p className={`${styles['mt-4']}`}>Supervising students and following up on their level.</p>
            </div>
          </div>

          {/* Vision */}
          <div className={`${styles['col-lg-4']}`} key="vision">
            <div className={`${styles['box-wrap']}`}>
              <div className={`${styles['box-wrap-grid']}`}>
                <div className={`${styles.icon}`}>
                  <span className={`${styles.fa} ${styles['fa-book']}`} />
                </div>
                <div className={`${styles.info}`}>
                  <p>Our Vision</p>
                  <h4>
                    <a href="#url">Vision</a>
                  </h4>
                </div>
              </div>
              <p className={`${styles['mt-4']}`}>If you are looking for high-quality and reliable online courses.</p>
            </div>
          </div>

          {/* Goal */}
          <div className={`${styles['col-lg-4']}`} key="goal">
          <div className={`${styles['box-wrap']}`}>
              <div className={`${styles['box-wrap-grid']}`}>
                <div className={`${styles.icon}`}>
                  <span className={`${styles.fa} ${styles['fa-trophy']}`} />
                </div>
                <div className={`${styles.info}`}>
                  <p>Our Goal</p>
                  <h4>
                    <a href="#url">Goal</a>
                  </h4>
                </div>
              </div>
              <p className={`${styles['mt-4']}`}>Provide the best for our students to develop their academic level.</p>
            </div>
          </div>
        </div>
      </div>
      </Container>
    </section>

    {/* Section About */}
    <section className={`${styles['w3l-aboutblock1']} ${styles['py-5']}`} id="about">
      <div className={`${styles.container} ${styles['py-lg-5']} ${styles['py-md-4']} ${styles['py-2']}`}>
        <div className={`${styles.row}`}>
          <div className={`${styles['col-lg-6']} ${styles['align-self']}`}>
            <span className={`${styles['title-small']} ${styles['mb-2']}`}>About Us</span>
            <h3 className={`${styles['title-big']}`}>Welcome to SmartLearn</h3>
            <p className={`${styles['mt-lg-4']} ${styles['mt-3']}`}>
              Welcome to SmartLearn, your premier destination for a diverse array of online courses!
            </p>
            <p className={`${styles['mt-3']} ${styles['mb-lg-5']}`}>With our user-friendly interface and expertly curated content, discovering and enrolling in courses has never been simpler.</p>
          </div>
          <div className={`${styles['col-lg-6']} ${styles['left-wthree-img']}`}>
            <img src={require('../../assets/images/about.jpg')} alt="" className={`${styles['img-fluid']} ${styles['img-fluid']}`} />
          </div>
        </div>
      </div>
    </section>

    {/* Section Progress */}
    <section className={`${styles['w3l-servicesblock']} ${styles['w3l-servicesblock1']} ${styles['py-5']}`} id="progress">
      <div className={`${styles.container} ${styles['py-lg-5']} ${styles['py-md-4']} ${styles['py-2']}`}>
        <div className={`${styles.row}`}>
          <div className={`${styles['col-lg-6']} ${styles['pr-lg-4']}`}>
            <h6 className={`${styles['progress-tittle']}`}>Figma illustrations</h6>
            <div className={`${styles.progress}`}>
              <div
                className={`${styles['progress-bar']} ${styles['progress-bar-striped']}`}
                role="progressbar"
                style={{ width: '80%' }}
                aria-valuenow={80}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
          <div className={`${styles['col-lg-6']} ${styles['pl-lg-4']}`}>
            <h3 className={`${styles['title-big']}`}> What you have in our Popular Online Courses</h3>
            <p className={`${styles['mt-md-4']} ${styles['mt-3']}`}>In our Popular Online Courses section, we've implemented dynamic progress bars to provide you with a clear indication of each course's popularity and engagement.</p>
            <a href="/login" className={`${styles['btn']} ${styles['btn-primary']} ${styles['btn-style']} ${styles['mt-md-5']} ${styles['mt-4']}`}>
              Get started now
            </a>
          </div>
        </div>
      </div>
    </section>

    {/* Stats Section */}
    <section className={`${styles['w3l-stats']} ${styles['py-5']}`} id="stats">
      <div className={`${styles['gallery-inner']} ${styles.container} ${styles['py-lg-5']} ${styles['py-md-4']}`}>
        <span className={`${styles['title-small']} ${styles['text-center']} ${styles['mb-1']}`}>Our Achievements</span>
        <h3 className={`${styles['title-big']} ${styles['text-center']} ${styles['mb-5']}`}>Our progress never Ends</h3>
        <div className={`${styles.row} ${styles['stats-con']}`}>
          <div className={`${styles['col-md-3']} ${styles['col-6']} ${styles['stats_info']}`}>
            <p className={`${styles.counter}`}>500 </p>
            <span className={`${styles['plus']}`}>+</span>
            <br />
            <h3>Students Enrolled</h3>
          </div>
          <div className={`${styles['col-md-3']} ${styles['col-6']} ${styles['stats_info']}`}>
            <p className={`${styles.counter}`}>56</p>
            <span className={`${styles['plus']}`}>+</span>
            <br />
            <h3>Courses Uploaded</h3>
          </div>
          {/*<div className={`${styles['col-md-3']} ${styles['col-6']} ${styles['stats_info']}`}>
            <p className={`${styles.counter}`}>130</p>
            <span className={`${styles['plus']}`}>+</span>
            <br />
            <h3>Certified students</h3>
  </div>*/}
          <div className={`${styles['col-md-3']} ${styles['col-6']} ${styles['stats_info']}`}>
            <p className={`${styles.counter}`}>243</p>
            <span className={`${styles['plus']}`}>+</span>
            <br />
            <h3>Global Teachers</h3>
          </div>
        </div>
      </div>
    </section>
    <Footer/>
  </div>
</div>  
 )
};

export default About;
