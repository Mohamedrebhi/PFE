/* eslint-disable */

import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import styles from './Home.module.css';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import c1 from '../../assets/images/c1.jpg';
import c2 from '../../assets/images/c2.jpg';
import c3 from '../../assets/images/c3.jpg';
import c4 from '../../assets/images/c4.jpg';
import c5 from '../../assets/images/c5.jpg';
import c6 from '../../assets/images/c6.jpg';

function Home() {
  const owl_one_options = {
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
      0: {
        items: 1
      },
      480: {
        items: 1
      },
      667: {
        items: 1
      },
      1000: {
        items: 1,
        nav: true
      }
    }
  };

  const owl_demo1_options = {
    loop: true,
    margin: 20,
    nav: false,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
        nav: false
      },
      768: {
        items: 2,
        nav: false
      },
      1000: {
        items: 3,
        nav: false,
        loop: false
      }
    }
  };

    const [courses, setCourses] = useState([]); // Stocker la liste des cours
    //const [isLoading, setIsLoading] = useState(true); // Indicateur de chargement
    //const [error, setError] = useState(null); // Gérer les erreurs

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await fetch('http://localhost:400/Cours');
            const data = await response.json();
            setCourses(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const images = [c1, c2, c3, c4, c5, c6];

    const getRandomImage = () => {
        return images[Math.floor(Math.random() * images.length)];
    };

  return (
    <div>
      <Header />
      {/* main-slider */}
      <section className={`${styles['w3l-main-slider']}`} id="home">
        <div className={`${styles['companies20-content']}`}>
          <OwlCarousel className={`${styles['owl-one']} ${styles['owl-carousel']} ${styles['owl-theme']}`} {...owl_one_options}>
            <div className={`${styles.item}`}>
              <li>
                <div className={`${styles['slider-info']} ${styles['banner-view']} ${styles.bg} ${styles.bg2}`}>
                  <div className={`${styles['banner-info']}`}>
                    <div className={`${styles.container}`}>
                      <div className={`${styles['banner-info-bg']}`}>
                        <h5>50% Discount on all Popular Courses</h5>
                        <p className={`${styles['mt-4']} ${styles['pr-lg-4']}`}>Take the first step to your journey to success with us</p>
                        <a
                          className={`${styles.btn} ${styles['btn-style']} ${styles['btn-primary']} ${styles['mt-sm-5']} ${styles['mt-4']} ${styles['mr-2']}`}
                          href="/login"
                        >
                          {' '}
                          Ready to get started?
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </div>
            <div className={`${styles.item}`}>
              <li>
                <div className={`${styles['slider-info']} ${styles['banner-view']} ${styles['banner-top1']} ${styles.bg} ${styles.bg2}`}>
                  <div className={`${styles['banner-info']}`}>
                    <div className={`${styles.container}`}>
                      <div className={`${styles['banner-info-bg']}`}>
                        <h5 class="test-text">Learn and Improve Yourself in Less Time </h5>
                        <p className={`${styles['mt-4']} ${styles['pr-lg-4']}`}>Our self improvement courses is very effective </p>
                        <a
                          className={`${styles.btn} ${styles['btn-style']} ${styles['btn-primary']} ${styles['mt-sm-5']} ${styles['mt-4']} ${styles['mr-2']}`}
                          href="/login"
                        >
                          {' '}
                          Ready to get started?
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </div>
            <div className={`${styles.item}`}>
              <li>
                <div className={`${styles['slider-info']} ${styles['banner-view']} ${styles['banner-top2']} ${styles.bg} ${styles.bg2}`}>
                  <div className={`${styles['banner-info']}`}>
                    <div className={`${styles.container}`}>
                      <div className={`${styles['banner-info-bg']}`}>
                        <h5>Be More Productive to Be More Successful</h5>
                        <p className={`${styles['mt-4']} ${styles['pr-lg-4']}`}>Don't waste your time, check out our productive courses</p>
                        <a
                          className={`${styles.btn} ${styles['btn-style']} ${styles['btn-primary']} ${styles['mt-sm-5']} ${styles['mt-4']} ${styles['mr-2']}`}
                          href="/login"
                        >
                          {' '}
                          Ready to get started?
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </div>
            <div className={`${styles.item}`}>
              <li>
                <div className={`${styles['slider-info']} ${styles['banner-view']} ${styles['banner-top3']} ${styles.bg} ${styles.bg2}`}>
                  <div className={`${styles['banner-info']}`}>
                    <div className={`${styles.container}`}>
                      <div className={`${styles['banner-info-bg']}`}>
                        <h5>Enhance your skills with best online courses</h5>
                        <p className={`${styles['mt-4']} ${styles['pr-lg-4']}`}>Take the first step to your journey to success with us</p>
                        <a
                          className={`${styles.btn} ${styles['btn-style']} ${styles['btn-primary']} ${styles['mt-sm-5']} ${styles['mt-4']} ${styles['mr-2']}`}
                          href="/login"
                        >
                          {' '}
                          Ready to get started?
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </div>
          </OwlCarousel>
        </div>
        <div className={`${styles.waveWrapper} ${styles.waveAnimation}`}>
          <svg viewBox="0 0 500 150" preserveAspectRatio="none">
            <path d="M-5.07,73.52 C149.99,150.00 299.66,-102.13 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" style={{ stroke: 'none' }} />
          </svg>
        </div>
      </section>
      {/* /main-slider */}
      <section className={`${styles['w3l-courses']}`}>
        <div className={`${styles.blog} ${styles['pb-5']}`} id="courses">
          <div className={`${styles.container} ${styles['py-lg-5']} ${styles['py-md-4']} ${styles['py-2']}`}>
            <h5 className={`${styles['title-small']} ${styles['text-center']} ${styles['mb-1']}`}>Join our learn Courses</h5>
            <h3 className={`${styles['title-big']} ${styles['text-center']} ${styles['mb-sm-5']} ${styles['mb-4']}`}>
              Featured Online <span>Courses</span>
            </h3>
            <div className={`${styles.row}`}>
            {courses.map(course => (
              <div className={`${styles['col-lg-4']} ${styles['col-md-6']} ${styles.item}`} key={course._id}>
                <div className={`${styles.card}`}>
                  <div className={`${styles['card-header']} ${styles['p-0']} ${styles['position-relative']}`}>
                    <a href="/login" className={`${styles.zoom} ${styles['d-block']}`}>
                      <img
                        className={`${styles['card-img-bottom']} ${styles['d-block']}`}
                        src={getRandomImage()}
                        alt="Card image cap"
                      />
                    </a>
                    <div className={`${styles['post-pos']}`}>
                      <a href="#reciepe" className={`${styles.receipe} ${styles.blue}`}>
                        debutant
                      </a>
                    </div>
                  </div>
                  <div className={`${styles['card-body']} ${styles['course-details']}`}>
                    <div
                      className={`${styles['price-review']} ${styles['d-flex']} ${styles['justify-content-between']} ${styles['mb-1align-items-center']}`}
                    >
                      <p></p>
                      <ul className={`${styles['rating-star']}`}>
                        <li>
                          <span className={`${styles.fa} ${styles['fa-star']}`} />
                        </li>
                        <li>
                          <span className={`${styles.fa} ${styles['fa-star']}`} />
                        </li>
                        <li>
                          <span className={`${styles.fa} ${styles['fa-star']}`} />
                        </li>
                        <li>
                          <span className={`${styles.fa} ${styles['fa-star']}`} />
                        </li>
                        <li>
                          <span className={`${styles.fa} ${styles['fa-star-o']}`} />
                        </li>
                      </ul>
                    </div>
                    <a href="#course-single" className={`${styles['course-desc']}`}>
                    <p>{course.Name}</p>
                    </a>
                    <div className={`${styles['course-meta']} ${styles['mt-4']}`}>
                      <div className={`${styles['meta-item']} ${styles['course-lesson']}`}>
                        {/*<span className={`${styles.fa} ${styles['fa-clock-o']}`} />
                        <span className={`${styles['meta-value']}`}> 20 hrs </span>*/}
                      </div>
                      {/*<div className={`${styles['meta-item']} ${styles['course-']}`}>
                        <span className={`${styles.fa} ${styles['fa-user-o']}`} />
                        <span className={`${styles['meta-value']}`}> 50 </span>
                      </div>*/}
                    </div>
                  </div>
                  <div className={`${styles['card-footer']}`}>
                    <div className={`${styles.author} ${styles['align-items-center']}`}>
                      <img
                        src={require('../../assets/images/user/avatar-22.jpg')}
                        alt=""
                        className={`${styles['img-fluid']} ${styles['rounded-circle']}`}
                      />
                      <ul className={`${styles['blog-meta']}`}>
                        <li>
                          <span className={`${styles['meta-value']} ${styles['mx-1']}`}>by</span> <a href="#author">{course.Professor_Name}</a>
                        </li>
                        <li>
                          <span className={`${styles['meta-value']} ${styles['mx-1']}`}>in</span> <a href="#author">{course.Name}</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              ))}
          </div>
            <div className={`${styles['mt-5']} ${styles['text-more']}`}>
              <p className={`${styles['pt-md-3']} ${styles.sample} ${styles['text-center']}`}>
                Control your personal preference settings to get notified about appropriate courses
                <a href="/courses">
                  View All Courses <span className={`${styles['pl-2']} ${styles.fa} ${styles['fa-long-arrow-right']}`} />
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className={`${styles['w3l-features']} ${styles['py-5']}`} id="facilities">
        <div className={`${styles['call-w3']} ${styles['py-lg-5']} ${styles['py-md-4']} ${styles['py-2']}`}>
          <div className={`${styles.container}`}>
            <div className={`${styles.row} ${styles['main-cont-wthree-2']}`}>
              <div className={`${styles['col-lg-5']} ${styles['feature-grid-left']}`}>
                <h5 className={`${styles['title-small']} ${styles['mb-1']}`}>Study and graduate</h5>
                <h3 className={`${styles['title-big']} ${styles['mb-4']}`}>Our Facilities </h3>
                <p className={`${styles['text-para']}`}>
                  Welcome to our virtual classrooms, where studying and graduation become seamless realities. Our state-of-the-art
                  facilities are designed to provide you with an immersive and enriching learning experience. With advanced technology and
                  interactive tools at your fingertips, you can engage with course materials, connect with instructors, and collaborate with
                  fellow students effortlessly.{' '}
                </p>
                <p className={`${styles['mt-3']}`}>
                  Whether you're pursuing further education, upskilling for your career, or simply expanding your knowledge, our virtual
                  classrooms offer the perfect environment for your academic journey. Join us and embark on the path to success, where
                  learning knows no bounds.
                </p>
                <a
                  href="#url"
                  className={`${styles.btn} ${styles['btn-primary']} ${styles['btn-style']} ${styles['mt-md-5']} ${styles['mt-4']}`}
                >
                  Discover More
                </a>
              </div>
              <div className={`${styles['col-lg-7']} ${styles['feature-grid-right']} ${styles['mt-lg-0']} ${styles['mt-5']}`}>
                <div className={`${styles['call-grids-w3']} ${styles['d-grid']}`}>
                  <div className={`${styles['grids-1']} ${styles['box-wrap']}`}>
                    <a href="#more" className={`${styles.icon}`}>
                      <span className={`${styles.fa} ${styles['fa-certificate']}`} />
                    </a>
                    <h4>
                      <a href="#feature" className={`${styles['title-head']}`}>
                        Global Certificate
                      </a>
                    </h4>
                    <p>Earn your Global Certificate today!</p>
                  </div>
                  <div className={`${styles['grids-1']} ${styles['box-wrap']}`}>
                    <a href="#more" className={`${styles.icon}`}>
                      <span className={`${styles.fa} ${styles['fa-book']}`} />
                    </a>
                    <h4>
                      <a href="#feature" className={`${styles['title-head']}`}>
                        Books &amp; Library
                      </a>
                    </h4>
                    <p>Explore our virtual library of knowledge!</p>
                  </div>
                  <div className={`${styles['grids-1']} ${styles['box-wrap']}`}>
                    <a href="#more" className={`${styles.icon}`}>
                      <span className={`${styles.fa} ${styles['fa-trophy']}`} />
                    </a>
                    <h4>
                      <a href="#feature" className={`${styles['title-head']}`}>
                        Scholarship
                      </a>
                    </h4>
                    <p>Unlock your future with our scholarships.</p>
                  </div>
                  <div className={`${styles['grids-1']} ${styles['box-wrap']}`}>
                    <a href="#more" className={`${styles.icon}`}>
                      <span className={`${styles.fa} ${styles['fa-graduation-cap']}`} />
                    </a>
                    <h4>
                      <a href="#feature" className={`${styles['title-head']}`}>
                        Alumni Support
                      </a>
                    </h4>
                    <p>Your Success, Our Commitment.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className={`${styles['w3l-homeblock3']} ${styles['py-5']}`}>
        <div className={`${styles.container} ${styles['py-lg-5']} ${styles['py-md-4']} ${styles['py-2']}`}>
          <h5 className={`${styles['title-small']} ${styles['text-center']} ${styles['mb-1']}`}>From the news</h5>
          <h3 className={`${styles['title-big']} ${styles['text-center']} ${styles['mb-sm-5']} ${styles['mb-4']}`}>
            Latest <span>News</span>
          </h3>
          <div className={`${styles.row} ${styles['top-pics']}`}>
            <div className={`${styles['col-md-6']}`}>
              <div className={`${styles['top-pic1']}`}>
                <div className={`${styles['card-body']} ${styles['blog-details']}`}>
                  <a href="#blog-single" className={`${styles['blog-desc']}`}>
                    Enhance your educational skills and also experience with best online courses
                  </a>
                  <div className={`${styles.author} ${styles['align-items-center']}`}>
                    <img
                      src={require('../../assets/images/team1.jpg')}
                      alt=""
                      className={`${styles['img-fluid']} ${styles['rounded-circle']}`}
                    />
                    <ul className={`${styles['blog-meta']}`}>
                      <li>
                        <a href="#author">Noura Azdin</a>
                      </li>
                      <li className={`${styles['meta-item']} ${styles['blog-lesson']}`}>
                        <span className={`${styles['meta-value']}`}> Nov 19, 2020 </span>.{' '}
                        <span className={`${styles['meta-value']} ${styles['ml-2']}`}>
                          <span className={`${styles.fa} ${styles['fa-clock-o']}`} /> 1 min
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${styles['col-md-6']} ${styles['mt-md-0']} ${styles['mt-4']}`}>
              <div className={`${styles['top-pic2']}`}>
                <div className={`${styles['card-body']} ${styles['blog-details']}`}>
                  <a href="#blog-single" className={`${styles['blog-desc']}`}>
                    Be more productive to be more Successful. Take your first jouney
                  </a>
                  <div className={`${styles.author} ${styles['align-items-center']}`}>
                    <img
                      src={require('../../assets/images/team2.jpg')}
                      alt=""
                      className={`${styles['img-fluid']} ${styles['rounded-circle']}`}
                    />
                    <ul className={`${styles['blog-meta']}`}>
                      <li>
                        <a href="#author">Nadia Dkhili</a>
                      </li>
                      <li className={`${styles['meta-item']} ${styles['blog-lesson']}`}>
                        <span className={`${styles['meta-value']}`}> Nov 19, 2020 </span>.{' '}
                        <span className={`${styles['meta-value']} ${styles['ml-2']}`}>
                          <span className={`${styles.fa} ${styles['fa-clock-o']}`} /> 1 min
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className={`${styles['mt-4']}`}>
                <div className={`${styles['top-pic3']}`}>
                  <div className={`${styles['card-body']} ${styles['blog-details']}`}>
                    <a href="#blog-single" className={`${styles['blog-desc']}`}>
                      {' '}
                      Our self improvement courses are more effective. Start leaarning online
                    </a>
                    <div className={`${styles.author} ${styles['align-items-center']}`}>
                      <img
                        src={require('../../assets/images/team3.jpg')}
                        alt=""
                        className={`${styles['img-fluid']} ${styles['rounded-circle']}`}
                      />
                      <ul className={`${styles['blog-meta']}`}>
                        <li>
                          <a href="#author">Wided Trabelsi</a>
                        </li>
                        <li className={`${styles['meta-item']} ${styles['blog-lesson']}`}>
                          <span className={`${styles['meta-value']}`}> Nov 19, 2020 </span>.{' '}
                          <span className={`${styles['meta-value']} ${styles['ml-2']}`}>
                            <span className={`${styles.fa} ${styles['fa-clock-o']}`} /> 1 min
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles['mt-md-5']} ${styles['mt-4']} ${styles['text-more']} ${styles['text-center']}`}>
            {/*<a href="blog.html">
              View All Posts <span className={`${styles['pl-2']} ${styles.fa} ${styles['fa-long-arrow-right']}`} />
            </a>*/}
          </div>
        </div>
      </div>
      {/* middle */}
      <div className={`${styles.middle} ${styles['py-5']}`}>
        <div className={`${styles.container} ${styles['py-lg-5']} ${styles['py-md-4']} ${styles['py-2']}`}>
          <div className={`${styles['welcome-left']} ${styles['text-center']} ${styles['py-lg-4']}`}>
            <h5 className={`${styles['title-small']} ${styles['mb-1']}`}>Start learning online</h5>
            <h3 className={`${styles['title-big']}`}>Enhance your skills with best online courses</h3>
            <a
              href="/login"
              className={`${styles.btn} ${styles['btn-style']} ${styles['btn-outline-light']} ${styles['mt-sm-5']} ${styles['mt-4']} ${styles['mr-2']}`}
            >
              Get started now
            </a>
            <a
              href="/contact"
              className={`${styles.btn} ${styles['btn-style']} ${styles['btn-primary']} ${styles['mt-sm-5']} ${styles['mt-4']}`}
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
      {/* //middle */}
      <section className={`${styles['w3l-team']} ${styles['py-5']}`} id="team">
        <div className={`${styles['call-w3']} ${styles['py-lg-5']} ${styles['py-md-4']}`}>
          <div className={`${styles.container}`}>
            <div className={`${styles.row} ${styles['main-cont-wthree-2']}`}>
              <div className={`${styles['col-lg-5']} ${styles['feature-grid-left']}`}>
                <h5 className={`${styles['title-small']} ${styles['mb-1']}`}>Experienced professionals</h5>
                <h3 className={`${styles['title-big']} ${styles['mb-4']}`}>Meet our teachers</h3>
                <p className={`${styles['text-para']}`}>
                SmartLearn platform sought to attract the finest qualified professors and teachers from all over the Republic
                  to accompany your children on their journey towards success.{' '}
                </p>
                <p className={`${styles['mt-3']}`}>High-quality content prepared by the finest professors in Tunisia.</p>
                <a
                  href="/about"
                  className={`${styles.btn} ${styles['btn-primary']} ${styles['btn-style']} ${styles['mt-md-5']} ${styles['mt-4']}`}
                >
                  Discover More
                </a>
              </div>
              <div className={`${styles['col-lg-7']} ${styles['feature-grid-right']} ${styles['mt-lg-0']} ${styles['mt-5']}`}>
                <div className={`${styles.row}`}>
                  <div className={`${styles['col-sm-6']}`}>
                    <div className={`${styles.box16}`}>
                      <a href="#url">
                        <img
                          src={require('../../assets/images/abie.jpg')}
                          alt=""
                          className={`${styles['img-fluid']} ${styles['radius-image']}`}
                        />
                      </a>
                      <div className={`${styles['box-content']}`}>
                        <h3 className={`${styles.title}`}>
                          <a href="#url">Aymen</a>
                        </h3>
                        <span className={`${styles.post}`}>Director</span>
                        <ul className={`${styles.social}`}>
                          <li>
                            <a href="#" className={`${styles.facebook}`}>
                              <span className={`${styles.fa} ${styles['fa-facebook-f']}`} />
                            </a>
                          </li>
                          <li>
                            <a href="#" className={`${styles.twitter}`}>
                              <span className={`${styles.fa} ${styles['fa-twitter']}`} />
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className={`${styles['col-sm-6']} ${styles['mt-sm-0']} ${styles['mt-3']}`}>
                    <div className={`${styles.box16}`}>
                      <a href="#url">
                        <img
                          src={require('../../assets/images/team2.jpg')}
                          alt=""
                          className={`${styles['img-fluid']} ${styles['radius-image']}`}
                        />
                      </a>
                      <div className={`${styles['box-content']}`}>
                        <h3 className={`${styles.title}`}>
                          <a href="#url">Nour</a>
                        </h3>
                        <span className={`${styles.post}`}>Managing Director</span>
                        <ul className={`${styles.social}`}>
                          <li>
                            <a href="#" className={`${styles.facebook}`}>
                              <span className={`${styles.fa} ${styles['fa-facebook-f']}`} />
                            </a>
                          </li>
                          <li>
                            <a href="#" className={`${styles.twitter}`}>
                              <span className={`${styles.fa} ${styles['fa-twitter']}`} />
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className={`${styles['col-sm-6']} ${styles['mt-lg-4']} ${styles['mt-3']}`}>
                    <div className={`${styles.box16}`}>
                      <a href="#url">
                        <img
                          src={require('../../assets/images/team3.jpg')}
                          alt=""
                          className={`${styles['img-fluid']} ${styles['radius-image']}`}
                        />
                      </a>
                      <div className={`${styles['box-content']}`}>
                        <h3 className={`${styles.title}`}>
                          <a href="#url">Wided</a>
                        </h3>
                        <span className={`${styles.post}`}>Teacher</span>
                        <ul className={`${styles.social}`}>
                          <li>
                            <a href="#" className={`${styles.facebook}`}>
                              <span className={`${styles.fa} ${styles['fa-facebook-f']}`} />
                            </a>
                          </li>
                          <li>
                            <a href="#" className={`${styles.twitter}`}>
                              <span className={`${styles.fa} ${styles['fa-twitter']}`} />
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className={`${styles['col-sm-6']} ${styles['mt-lg-4']} ${styles['mt-3']}`}>
                    <div className={`${styles.box16}`}>
                      <a href="#url">
                        <img
                          src={require('../../assets/images/team4.jpg')}
                          alt=""
                          className={`${styles['img-fluid']} ${styles['radius-image']}`}
                        />
                      </a>
                      <div className={`${styles['box-content']}`}>
                        <h3 className={`${styles.title}`}>
                          <a href="#url">Yosra</a>
                        </h3>
                        <span className={`${styles.post}`}>Teacher</span>
                        <ul className={`${styles.social}`}>
                          <li>
                            <a href="#" className={`${styles.facebook}`}>
                              <span className={`${styles.fa} ${styles['fa-facebook-f']}`} />
                            </a>
                          </li>
                          <li>
                            <a href="#" className={`${styles.twitter}`}>
                              <span className={`${styles.fa} ${styles['fa-twitter']}`} />
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* testimonials */}
      <section className={`${styles['w3l-testimonials']}`} id="clients">
        {/* /grids */}
        <div className={`${styles['cusrtomer-layout']} ${styles['py-5']}`}>
          <div className={`${styles.container} ${styles['py-lg-4']} ${styles['py-md-3']} ${styles['pb-lg-0']}`}>
            <h5 className={`${styles['title-small']} ${styles['text-center']} ${styles['mb-1']}`}>Testimonials</h5>
            <h3 className={`${styles['title-big']} ${styles['text-center']} ${styles['mb-sm-5']} ${styles['mb-4']}`}>
              Happy Clients &amp; Feedbacks
            </h3>
            {/* /grids */}
            <div className={`${styles['testimonial-width']}`}>
              <OwlCarousel
                id="owl-demo1"
                className={`${styles['owl-two']} ${styles['owl-carousel']} ${styles['owl-theme']}`}
                {...owl_demo1_options}
              >
                <div className={`${styles.item}`}>
                  <div className={`${styles['testimonial-content']}`}>
                    <div className={`${styles.testimonial}`}>
                      <blockquote>
                        <q>
                          One of the best decisions I made in the year was to participate in the platform and avoid the classic methods of
                          review. Because Rasha won me time and made me walk with the rhythm that helps me Special thanks to the professors,
                          especially the middle level professors. We recommend it to any student who likes to read and deliver.
                        </q>
                      </blockquote>
                      <div className={`${styles['testi-des']}`}>
                        <div className={`${styles['test-img']}`}>
                          <img src={require('../../assets/images/team1.jpg')} className={`${styles['img-fluid']}`} alt="client-img" />
                        </div>
                        <div className={`${styles.peopl} ${styles['align-self']}`}>
                          <h3>Mounira Akter</h3>
                          <p className={`${styles.indentity}`}>Mother of a student</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`${styles.item}`}>
                  <div className={`${styles['testimonial-content']}`}>
                    <div className={`${styles.testimonial}`}>
                      <blockquote>
                        <q>
                        Praise be to God for the success of my eldest daughter and the apple of my eyes Farah Chebbi baccalaureate science
                          experimental rate 17.84.Praise be to God again and here I thank the professors of LMS for their glory and for
                          their solidarity and assistance to the students to reach the goal of distinctive . May Allah reward you .
                        </q>
                      </blockquote>
                      <div className={`${styles['testi-des']}`}>
                        <div className={`${styles['test-img']}`}>
                          <img src={require('../../assets/images/team2.jpg')} className={`${styles['img-fluid']}`} alt="client-img" />
                        </div>
                        <div className={`${styles.peopl} ${styles['align-self']}`}>
                          <h3>Julia sakura</h3>
                          <p className={`${styles.indentity}`}>Student</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`${styles.item}`}>
                  <div className={`${styles['testimonial-content']}`}>
                    <div className={`${styles.testimonial}`}>
                      <blockquote>
                        <q>
                          UVT, it is not just a platform... UVT family. We describe the sweetness of the experience with UVT, thank you for
                          the efforts made by the professors and the administration.we love you with the right to do anything to make us
                          happy and satisfy us, and they seek our success more than us ❤️thank you very much ❤️ .
                        </q>
                      </blockquote>
                      <div className={`${styles['testi-des']}`}>
                        <div className={`${styles['test-img']}`}>
                          <img src={require('../../assets/images/team3.jpg')} className={`${styles['img-fluid']}`} alt="client-img" />
                        </div>
                        <div className={`${styles.peopl} ${styles['align-self']}`}>
                          <h3>Roy Linderson</h3>
                          <p className={`${styles.indentity}`}>Student</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`${styles.item}`}>
                  <div className={`${styles['testimonial-content']}`}>
                    <div className={`${styles.testimonial}`}>
                      <blockquote>
                        <q>
                          Lorem ipsum dolor sit amet elit. Velit beatae laudantium voluptate rem ullam dolore nisi voluptatibus esse quasi,
                          doloribus tempora. Dolores molestias adipisci dolo amet!.
                        </q>
                      </blockquote>
                      <div className={`${styles['testi-des']}`}>
                        <div className={`${styles['test-img']}`}>
                          <img src={require('../../assets/images/team4.jpg')} className={`${styles['img-fluid']}`} alt="client-img" />
                        </div>
                        <div className={`${styles.peopl} ${styles['align-self']}`}>
                          <h3>Mike Thyson</h3>
                          <p className={`${styles.indentity}`}>Student</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`${styles.item}`}>
                  <div className={`${styles['testimonial-content']}`}>
                    <div className={`${styles.testimonial}`}>
                      <blockquote>
                        <q>
                          Lorem ipsum dolor sit amet elit. Velit beatae laudantium voluptate rem ullam dolore nisi voluptatibus esse quasi,
                          doloribus tempora. Dolores molestias adipisci dolo amet!.
                        </q>
                      </blockquote>
                      <div className={`${styles['testi-des']}`}>
                        <div className={`${styles['test-img']}`}>
                          <img src={require('../../assets/images/team2.jpg')} className={`${styles['img-fluid']}`} alt="client-img" />
                        </div>
                        <div className={`${styles.peopl} ${styles['align-self']}`}>
                          <h3>Laura gill</h3>
                          <p className={`${styles.indentity}`}>Student</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`${styles.item}`}>
                  <div className={`${styles['testimonial-content']}`}>
                    <div className={`${styles.testimonial}`}>
                      <blockquote>
                        <q>
                          Lorem ipsum dolor sit amet elit. Velit beatae laudantium voluptate rem ullam dolore nisi voluptatibus esse quasi,
                          doloribus tempora. Dolores molestias adipisci dolo amet!.
                        </q>
                      </blockquote>
                      <div className={`${styles['testi-des']}`}>
                        <div className={`${styles['test-img']}`}>
                          <img src={require('../../assets/images/team3.jpg')} className={`${styles['img-fluid']}`} alt="client-img" />
                        </div>
                        <div className={`${styles.peopl} ${styles['align-self']}`}>
                          <h3>Smith Johnson</h3>
                          <p className={`${styles.indentity}`}>Student</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`${styles.item}`}>
                  <div className={`${styles['testimonial-content']}`}>
                    <div className={`${styles.testimonial}`}>
                      <blockquote>
                        <q>
                          Lorem ipsum dolor sit amet elit. Velit beatae laudantium voluptate rem ullam dolore nisi voluptatibus esse quasi,
                          doloribus tempora. Dolores molestias adipisci dolo amet!.
                        </q>
                      </blockquote>
                      <div className={`${styles['testi-des']}`}>
                        <div className={`${styles['test-img']}`}>
                          <img src={require('../../assets/images/team2.jpg')} className={`${styles['img-fluid']}`} alt="client-img" />
                        </div>
                        <div className={`${styles.peopl} ${styles['align-self']}`}>
                          <h3>Laura gill</h3>
                          <p className={`${styles.indentity}`}>Student</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`${styles.item}`}>
                  <div className={`${styles['testimonial-content']}`}>
                    <div className={`${styles.testimonial}`}>
                      <blockquote>
                        <q>
                          Lorem ipsum dolor sit amet elit. Velit beatae laudantium voluptate rem ullam dolore nisi voluptatibus esse quasi,
                          doloribus tempora. Dolores molestias adipisci dolo amet!.
                        </q>
                      </blockquote>
                      <div className={`${styles['testi-des']}`}>
                        <div className={`${styles['test-img']}`}>
                          <img src={require('../../assets/images/team3.jpg')} className={`${styles['img-fluid']}`} alt="client-img" />
                        </div>
                        <div className={`${styles.peopl} ${styles['align-self']}`}>
                          <h3>Smith Johnson</h3>
                          <p className={`${styles.indentity}`}>Student</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </OwlCarousel>
            </div>
          </div>
          {/* /grids */}
        </div>
        {/* //grids */}
      </section>
      {/* //testimonials */}
      <Footer />
    </div>
  );
}

export default Home;
