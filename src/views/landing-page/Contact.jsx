import React from 'react';
import {Container} from 'react-bootstrap'; // Utilisation de Bootstrap pour les composants
import styles from './Home.module.css';
import Header from './Header';
import Footer from './Footer';

function Contact() {
  return (
    <div>
    <Header/>
    <div className={styles['about-container']}>
      <section className={styles['breadcrumb']} id="about">
        <Container>
          <h2 className={styles['title']}>Contact</h2>
        </Container>
      </section>
      {/* about breadcrumb */}
      {/*<section className={`${styles['w3l-breadcrumb']}`}>
        <div className={`${styles['breadcrumb-bg']} ${styles['breadcrumb-bg-about']} ${styles['py-5']}`}>
          <div className={`${styles.container} ${styles['pt-lg-5']} ${styles['pt-3']} ${styles['p-lg-4']} ${styles['pb-3']}`}>
            <h2 className={`${styles['title']} ${styles['mt-5']} ${styles['pt-lg-5']} ${styles['pt-sm-3']}`}>Get in touch</h2>
          </div>
        </div>
  </section>*/}
      {/* //about breadcrumb */}
      {/* contact block */}
      {/* contact1 */}
      <section className={`${styles['w3l-contact-1']} ${styles['pb-5']}`} id="contact">
        <div className={`${styles['contacts-9']} ${styles['py-lg-5']} ${styles['py-md-4']}`}>
          <div className={`${styles.container}`}>
            <div className={`${styles['d-grid']} ${styles['contact-view']}`}>
              <div className={`${styles['cont-details']}`}>
                <h3 className={`${styles['title-big']} ${styles['mb-4']}`}>Feel free to contact us</h3>
                <p className={`${styles['mb-sm-5']} ${styles['mb-4']}`}>
                  Start working with Us, We guarantee that you’ll be able to have any issue resolved within 24 hours.
                </p>
                <div className={`${styles['cont-top']}`}>
                  <div className={`${styles['cont-left']} ${styles['text-center']}`}>
                    <span className={`${styles.fa} ${styles['fa-map-marker']} ${styles['text-primary']}`} />
                  </div>
                  <div className={`${styles['cont-right']}`}>
                    <h6>Our head office address</h6>
                    <p className={`${styles['pr-lg-5']}`}>Rue de Nevers 8050 Hammamet, Tunisie.</p>
                  </div>
                </div><br></br>
                <div className={`${styles['cont-top']}`}>
                  <div className={`${styles['cont-left']} ${styles['text-center']}`}>
                    <span className={`${styles.fa} ${styles['fa-phone']} ${styles['text-primary']}`}/>
                  </div>
                  <div className={`${styles['cont-right']}`}>
                    <h6>Call for help </h6>
                    <p>
                      <a href="tel:+(21) 255 999 8888">+(216) 72 280 087</a>
                    </p>
                  </div>
                </div><br></br>
                <div className={`${styles['cont-top']}`}>
                  <div className={`${styles['cont-left']} ${styles['text-center']}`}>
                    <span className={`${styles.fa} ${styles['fa-envelope-o']} ${styles['text-primary']}`} />
                  </div>
                  <div className={`${styles['cont-right']}`}>
                    <h6>Contact with our support</h6>
                    <p>
                      <a href="Elite.Council.Consulting@gmail.com" className={`${styles['mail']}`}>
                        Elite.Council.Consulting@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </div><br></br>
              <div className={`${styles['map-content-9']}`}>
                <h5 className={`${styles['mb-sm-4']} ${styles['mb-3']}`}>Write to us</h5><br></br>
                <form action="https://sendmail.w3layouts.com/submitForm" method="post">
                  <div className={`${styles['twice-two']}`}>
                    <input type="text" className={`${styles['form-control']}`} name="w3lName" id="w3lName" placeholder="Name" required />
                    <input type="email" className={`${styles['form-control']}`} name="w3lSender" id="w3lSender" placeholder="Email" required />
                  </div>
                  <div className={`${styles['twice']}`}>
                    <input type="text" className={`${styles['form-control']}`} name="w3lSubject" id="w3lSubject" placeholder="Subject" required />
                  </div>
                  <textarea name="w3lMessage" className={`${styles['form-control']}`} id="w3lMessage" placeholder="Message" required defaultValue={''} />
                  <div className={`${styles['text-right']}`}>
                    <button type="submit" className={`${styles['btn']} ${styles['btn-primary']} ${styles['btn-style']} ${styles['mt-4']}`}>
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* /contact1 */}
      <div className={`${styles['map-iframe']}`}>
        <iframe
        title='test'
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3177.1869319292053!2d36.833434!3d10.217283!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5addd52a99!2sRue+de+Nevers%2C+Hammamet%2C+Tunisia!5e0!3m2!1sen!2spl!4v1562654563739!5m2!1sen!2spl"
          width="100%"
          height={400}
          frameBorder={0}
          style={{ border: '0px' }}
          allowFullScreen
        />{' '}
      </div>
      {/* //contact block */}
    </div>
    <Footer/>
  </div>  
  );
}

export default Contact;
