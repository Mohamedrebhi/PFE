/* eslint-disable */

import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';

function Header() {
  const TOP_OFFSET = 80;
  const [changeNav, setChangeNav] = useState(false);
  const [toggleMenu, SetToggleMenu] = useState(false);

  // toggle the menu for small screen
  const handleToggle = () => {
    SetToggleMenu(!toggleMenu);
  };
  // change the styling of the fixed nav when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      console.log(window.scrollY);
      if (window.scrollY >= TOP_OFFSET) {
        setChangeNav(true);
      } else {
        setChangeNav(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      id="site-header"
      className={`${styles['fixed-top']} ${changeNav ? styles['nav-fixed'] : ''} ${toggleMenu ? styles['active'] : ''}`}
    >
      <div className={`${styles.container}`}>
        <nav className={`${styles.navbar} ${styles['navbar-expand-lg']} ${styles['navbar-dark']} ${styles.stroke}`}>
          <h1>
            <a className={`${styles['navbar-brand']}`} href="/">
              {/* <img alt="" className={`${styles.logo}`} src={require('../../assets/images/brandlogo.png')} />{' '} */}
              {/* <span className={`${styles.logo}`}></span> */}
            </a>
          </h1>

          {/* <!-- if logo is image enable this    */}
          <a className={`${styles['navbar-brand']}`} href="/">
            <img src={require('../../assets/images/log.PNG')} alt="Your logo" title="Your logo" className={`${styles.logo}`} />
          </a>

          <button
            className={`${styles['navbar-toggler']} ${styles.collapsed} ${styles['bg-gradient']} `}
            type="button"
            data-toggle="collapse"
            data-target="#navbarTogglerDemo02"
            aria-controls="navbarTogglerDemo02"
            aria-expanded="true"
            aria-label="Toggle navigation"
            onClick={handleToggle}
          >
            <span className={`${styles['navbar-toggler-icon']} ${styles.fa} ${styles['icon-expand']} ${styles['fa-bars']}`}></span>
            <span className={`${styles['navbar-toggler-icon']} ${styles.fa} ${styles['icon-close']} ${styles['fa-times']}`}></span>
            <span />
          </button>

          <div className={`${styles.collapse} ${styles['navbar-collapse']} ${toggleMenu ? styles.show : ''}`} id="navbarTogglerDemo02">
            <ul className={`${styles['navbar-nav']} ${styles['mx-lg-auto']}`}>
              <li className={`${styles['nav-item']} ${styles.active}`}>
                <a className={`${styles['nav-link']}`} href="/">
                  Home <span className={`${styles['sr-only']}`}>(current)</span>
                </a>
              </li>
              <li className={`${styles['nav-item']} ${styles['@@about__active']}`}>
                <a className={`${styles['nav-link']}`} href="/about">
                  About
                </a>
              </li>
              <li className={`${styles['nav-item']} ${styles['@@courses__active']}`}>
                <a className={`${styles['nav-link']}`} href="/courses">
                  Courses
                </a>
              </li>
              <li className={`${styles['nav-item']} ${styles['@@contact__active']}`}>
                <a className={`${styles['nav-link']}`} href="/contact">
                  Contact
                </a>
              </li>
            </ul>
            {/* <!--/shopping-cart--> */}
            <div className="">
              <a href="#cart" title="shopping-cart">
                <span className="" aria-hidden="true">🛒</span>
              </a>
              </div>
              
            {/* <!--/search-right--> */}
            <div className={`${styles['search-right']}`}>
              <a href="#search" title="search">
                <span className={`${styles.fa} ${styles['fa-search']}`} aria-hidden="true"></span>
              </a>
              {/* <!-- search popup --> */}
              <div id="search" className={`${styles['pop-overlay']}`}>
                <div className={`${styles.popup}`}>
                  <form action="#" method="GET" className={`${styles['search-box']}`}>
                    <input type="search" placeholder="Search" name="search" required="required" autofocus="" />
                    <button type="submit" className={`${styles.btn}`}>
                      <span className={`${styles.fa} ${styles['fa-search']}`} aria-hidden="true"></span>
                    </button>
                  </form>
                </div>
                <a className={`${styles.close}`} href="#close">
                  ×
                </a>
              </div>
              {/* <!-- /search popup --> */}
            </div>
            <div className={`${styles['top-quote']} ${styles['mr-lg-2']} ${styles['text-center']}`}>
              <a href="/login" className={`${styles.btn} ${styles.login} ${styles['mr-2']}`}>
                <span className={`${styles.fa} ${styles['fa-user']}`}></span> login
              </a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
