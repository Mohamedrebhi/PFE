import React from 'react';
import styles from './Home.module.css';

function Footer() {
  return (
    <div>
      <section className={`${styles['w3l-footer-29-main']}`}>
        <div className={`${styles['footer-29']} ${styles['py-5']}`}>
          <div className={`${styles.container} ${styles['py-md-4']}`}>
            <div className={`${styles.row} ${styles['footer-top-29']}`}>
              <div
                className={`${styles['col-lg-4']} ${styles['col-md-6']} ${styles['col-sm-7']} ${styles['footer-list-29']} ${styles['footer-1']} ${styles['pr-lg-5']}`}
              >
                <h6 className={`${styles['footer-title-29']}`}>Contact Info </h6>
                <p>
                  Address : <a href="">Rue de Nevers 8050 Hammamet, Tunisie.</a>
                </p>
                <p className={`${styles['my-2']}`}>
                  Phone : <a href="tel:+1(21) 234 4567">+(216) 72 280 087</a>
                </p>
                <p>
                  Email : <a href="mailto:info@example.com">Elite.Council.Consulting@gmail.com</a>
                </p>
                <div className={`${styles['main-social-footer-29']} ${styles['mt-4']}`}>
                  <a href="https://www.facebook.com/Elite.Council.Consulting/" className={`${styles.facebook}`}>
                    <span className={`${styles.fa} ${styles['fa-facebook']}`}></span>
                  </a>
                  <a href="#twitter" className={`${styles.twitter}`}>
                    <span className={`${styles.fa} ${styles['fa-twitter']}`}></span>
                  </a>
                  <a href="https://www.instagram.com/elite.council.entourage/" className={`${styles.instagram}`}>
                    <span className={`${styles.fa} ${styles['fa-instagram']}`}></span>
                  </a>
                  <a href="https://www.linkedin.com/company/elitecouncil-entourage/" className={`${styles.linkedin}`}>
                    <span className={`${styles.fa} ${styles['fa-linkedin']}`}></span>
                  </a>
                </div>
              </div>
              <div
                className={`${styles['col-lg-3']} ${styles['col-md-6']} ${styles['col-sm-5']} ${styles['col-6']} ${styles['footer-list-29']} ${styles['footer-2']} ${styles['mt-sm-0']} ${styles['mt-5']}`}
              >
                <ul>
                  <h6 className={`${styles['footer-title-29']}`}>Company</h6>
                  <li>
                    <a href="/about">About company</a>
                  </li>
                  <li>
                    <a href="#blog"> Latest Blog posts</a>
                  </li>
                  <li>
                    <a href="#teacher"> Became a teacher </a>
                  </li>
                  <li>
                    <a href="/courses">Online Courses</a>
                  </li>
                  <li>
                    <a href="/contact">Get in touch</a>
                  </li>
                </ul>
              </div>
              <div
                className={`${styles['col-lg-2']} ${styles['col-md-6']} ${styles['col-sm-5']} ${styles['col-6']} ${styles['footer-list-29']} ${styles['footer-3']} ${styles['mt-lg-0']} ${styles['mt-5']}`}
              >
                <h6 className={`${styles['footer-title-29']}`}>Programs</h6>
                <ul>
                  <li>
                    <a href="#traning">Training Center</a>
                  </li>
                  <li>
                    <a href="#documentation">Documentation</a>
                  </li>
                  <li>
                    <a href="#release">Release Status</a>
                  </li>
                  <li>
                    <a href="#customers"> Customers</a>
                  </li>
                  <li>
                    <a href="#helpcenter"> Help Center</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Footer;
