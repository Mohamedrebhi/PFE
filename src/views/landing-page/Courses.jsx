import { Container } from 'react-bootstrap'; // Utilisation de Bootstrap pour les composants
import styles from './Home.module.css';
import Footer from './Footer';
import Header from './Header';
import React, { useEffect, useState } from 'react';
import c1 from '../../assets/images/c1.jpg';
import c2 from '../../assets/images/c2.jpg';
import c3 from '../../assets/images/c3.jpg';
import c4 from '../../assets/images/c4.jpg';
import c5 from '../../assets/images/c5.jpg';
import c6 from '../../assets/images/c6.jpg';

function Courses() {
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

    /*if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }*/

    return (
        <div>
            <Header />
            <div className={styles['about-container']}>
                <section className={styles['breadcrumb']} id="about">
                    <Container>
                        <h2 className={styles['title']}>Courses</h2>
                    </Container>
                </section>

                <section className={`${styles['w3l-courses']}`}>
                    <div className={`${styles.blog} ${styles['pb-5']}`} id="courses">
                        <div className={`${styles.container} ${styles['py-lg-5']} ${styles['py-md-4']} ${styles['py-2']}`}>
                            <div className={`${styles.row}`}>
                                {courses.map(course => (
                                    <div className={`${styles['col-lg-4']} ${styles['col-md-6']} ${styles.item}`} key={course._id}>
                                        <div className={`${styles.card}`}>
                                            <div className={`${styles['card-header']} ${styles['p-0']} ${styles['position-relative']}`}>
                                                <a href="/login" className={`${styles.zoom} ${styles['d-block']}`}>
                                                    <img className={`${styles['card-img-bottom']} ${styles['d-block']}`} src={getRandomImage()} alt="Course thumbnail" />
                                                </a>
                                                <div className={`${styles['post-pos']}`}>
                                                    <a href="/login" className={`${styles.receipe} ${styles.blue}`}>
                                                        Beginner
                                                    </a>
                                                </div>
                                            </div>
                                            <div className={`${styles['card-body']} ${styles['course-details']}`}>
                                                <div className={`${styles['price-review']} ${styles['d-flex']} ${styles['justify-content-between']} ${styles['mb-1align-items-center']}`}>
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
                                                <a href="/login" className={`${styles['course-desc']}`}>
                                                    <p>{course.Name}</p>
                                                </a>
                                                <div className={`${styles['course-meta']} ${styles['mt-4']}`}>
                                                    <div className={`${styles['meta-item']} ${styles['course-lesson']}`}>
                                                        {/* <span className={`${styles.fa} ${styles['fa-clock-o']}`} />
                                                        <span className={`${styles['meta-value']}`}> 20 hrs </span> */}
                                                    </div>
                                                    {/*<div className={`${styles['meta-item']} ${styles['course-']}`}>
                                                        {/*<span className={`${styles.fa} ${styles['fa-user-o']}`} />
                                                        <span className={`${styles['meta-value']}`}>{course.StudentID ? course.StudentID.length : 'N/A'}</span>*/}
                                                    {/*</div>*/}
                                                </div>
                                            </div>
                                            <div className={`${styles['card-footer']}`}>
                                                <div className={`${styles.author} ${styles['align-items-center']}`}>
                                                    <img src={require('../../assets/images/user/avatar-22.jpg')} alt="" className={`${styles['img-fluid']} ${styles['rounded-circle']}`} />
                                                    <ul className={`${styles['blog-meta']}`}>
                                                        <li>
                                                            <span className={`${styles['meta-value']} ${styles['mx-1']}`}>by</span> <a href="#author"> {course.Professor_Name}</a>
                                                        </li>
                                                        <li>
                                                            <span className={`${styles['meta-value']} ${styles['mx-1']}`}>in</span> <a href="#author"> {course.Name}</a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={`${styles['pagination-wrapper']} ${styles['mt-5']} ${styles['pt-lg-3']} ${styles['text-center']}`}>
                                <ul className={`${styles['page-pagination']}`}>
                                    <li>
                                        <a className={`${styles['next']}`} href="#url">
                                            <span className={`${styles.fa} ${styles['fa-angle-left']}`} /> Prev
                                        </a>
                                    </li>
                                    <li>
                                        <span aria-current="page" className={`${styles['page-numbers']}`}>
                                            1
                                        </span>
                                    </li>
                                    <li>
                                        <a className={`${styles['page-numbers']}`} href="#url">
                                            2
                                        </a>
                                    </li>
                                    <li>
                                        <a className={`${styles['page-numbers']}`} href="#url">
                                            3
                                        </a>
                                    </li>
                                    <li>
                                        <a className={`${styles['page-numbers']}`} href="#url">
                                            ....
                                        </a>
                                    </li>
                                    <li>
                                        <a className={`${styles['next']}`} href="#url">
                                            Next <span className={`${styles.fa} ${styles['fa-angle-right']}`} />
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer />
            </div>
        </div>
    );
}

export default Courses;
