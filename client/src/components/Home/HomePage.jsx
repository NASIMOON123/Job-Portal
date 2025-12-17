import React, { useState,useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import './HomePage.css';
import { FaSearch, FaFileAlt, FaLaptopCode, FaSun, FaMoon } from "react-icons/fa";
import AdminLogin from '../Authentication/AdminLogin'; 
import { useNavigate } from 'react-router-dom';
import Login from '../Authentication/Login';
import logo from '../../assets/logo.png';
import carousel1 from '../../assets/carousel1.avif';
import carousel2 from '../../assets/carousel2.avif';
import carousel3 from '../../assets/carousel3.avif';
import service1 from '../../assets/service1.avif';
import service2 from '../../assets/service2.jpeg';
import service3 from '../../assets/service3.jpeg';
import service4 from '../../assets/service4.jpeg';
import { BsGeoAltFill, BsTelephoneFill, BsEnvelopeFill, BsClockFill } from 'react-icons/bs';

const HomePage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [theme, setTheme] = useState('light'); // default theme

  const [loginFormType, setLoginFormType] = useState(null); // 'admin' or 'recruiter'
  const navigate = useNavigate();
 
const toggleTheme = () => {
  const newTheme = theme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  document.documentElement.setAttribute('data-theme', newTheme);
};

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesCount = 3;

// Carousel state


const slides = [
  carousel1,carousel2,carousel3
];

// Functions to move slides
const nextSlide = () => setCurrentSlide((currentSlide + 1) % slides.length);
const prevSlide = () => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length);
const goToSlide = (index) => setCurrentSlide(index);

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlide(prev => (prev + 1) % slidesCount);
  }, 5000); // change slide every 5 seconds

  return () => clearInterval(interval); // cleanup on unmount
}, [slides.length]);

  return (
    <>
      <nav className="navbar">
        {/* <div className="logo">JobSeeker Portal</div> */}
        <div className="logo">
  <img src={logo} alt="JobSeeker Portal Logo" className="logo-img" />
  <span>Job Portal</span>
</div>



        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <a href="#home" onClick={closeMenu} className="an">Home</a>
          <a href="#about" onClick={closeMenu} className="an">About</a>
          <a href="#services" onClick={closeMenu} className="an">Services</a>
          <a href="#contact" onClick={closeMenu} className="an">Contact</a>
          <a
  href="/combined-login"
  className="login-button an"
  onClick={() => {
    setShowLoginOptions(false);
    setLoginFormType(null); // reset any login form selection
    closeMenu();
  }}
>
  Login
</a>

        
<div className="theme-toggle-switch" onClick={toggleTheme}>
  {/* Sun icon (only visible in dark mode) */}
  {theme === "dark" && <FaSun className="sun-icon" />}

  {/* Switch background + circle */}
  <div className={`switch ${theme === "dark" ? "dark" : ""}`}>
    <div className="circle"></div>
  </div>

  {/* Moon icon (only visible in light mode) */}
  {theme === "light" && <FaMoon className="moon-icon" />}
</div>

        </div>

        <div className="menu-icon" onClick={toggleMenu}>
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </div>
      </nav>

      <main className="main-content">
        
      <section id="home" className="home-carousel">
        <div className="inner-section">
  {/* Slides */}
  <div className="carousel-slides">
    {slides.map((img, index) => (
      <div
        key={index}
        className={`slide ${index === currentSlide ? 'active' : ''}`}
        style={{ backgroundImage: `url(${img})` }}
      ></div>
    ))}
  </div>

  {/* Side Arrows */}
  <button className="arrow left" onClick={prevSlide}>&lt;</button>
  <button className="arrow right" onClick={nextSlide}>&gt;</button>

  {/* Dots */}
  <div className="dots">
    {slides.map((_, index) => (
      <span
        key={index}
        className={`dot ${index === currentSlide ? 'active' : ''}`}
        onClick={() => goToSlide(index)}
      ></span>
    ))}
  </div>

  {/* Carousel Text Content */}
  <div className="carousel-content">
    <h1>Welcome to Job Portal</h1>
    <p>Your dream job is just a few clicks away!</p>
  </div>
  </div>
</section>


      
<section id="about" className="section about-section">
<div className="inner-section">
  <div className="about-container">
    <h2>About Us</h2>
    <p className="about-intro">
      At <strong>JobSeeker Portal</strong>, our mission is to connect talented job seekers with top employers. 
      Explore opportunities, showcase your skills, and land your dream job—all in one platform.
    </p>
    
    <div className="about-features">
      <div className="feature">
        <FaSearch className="feature-icon" />
        <h3>Easy Job Search</h3>
        <p>Find jobs that match your skills and preferences with our advanced filters.</p>
      </div>
      <div className="feature">
        <FaFileAlt className="feature-icon" />
        <h3>Resume & Profile Building</h3>
        <p>Create a professional resume and showcase your achievements to attract employers.</p>
      </div>
      <div className="feature">
        <FaLaptopCode className="feature-icon" />
        <h3>Interview Preparation</h3>
        <p>Get guidance, tips, and resources to ace interviews and secure your desired role.</p>
      </div>
    </div>
  </div>
  </div>
</section>


      
       <section className="services-section" id="services">
       <div className="inner-section">
  <div className="container">
    <h2>Our Services</h2>
    <p className="services-intro">
      We provide clean and efficient solutions for your business needs.
    </p>
    <div className="services-grid">
      <div className="service-card">
        <img
          src={service1}
          alt="Web Development"
          className="service-img"
        />
        <h3>Web Development</h3>
        <p>Responsive and high-performance websites tailored to your needs.</p>
      </div>
      <div className="service-card">
        <img
          src={service2}
          alt="Mobile Apps"
          className="service-img"
        />
        <h3>Mobile Apps</h3>
        <p>Custom mobile applications for both Android and iOS platforms.</p>
      </div>
      <div className="service-card">
        <img
          src={service3}
          alt="Cloud Solutions"
          className="service-img"
        />
        <h3>Cloud Solutions</h3>
        <p>Secure and scalable cloud-based infrastructure for your business.</p>
      </div>
      <div className="service-card">
        <img
          src={service4}
          alt="SEO & Marketing"
          className="service-img"
        />
        <h3>SEO & Marketing</h3>
        <p>Optimize your online presence and grow your audience effectively.</p>
      </div>
    </div>
  </div>
  </div>
</section>


    <section id="contact" className="contact-section">
    <div className="inner-section">
  <div className="container">
    <h2>Contact Us</h2>
    <div className="contact-grid">
      {/* About Portal */}
      <div className="contact-card">
        <h3>JobSeeker Portal</h3>
        <p>Your go-to platform for finding the best jobs and connecting with top recruiters.</p>
      </div>

      {/* Contact Info */}
      <div className="contact-card">
        <h3>Contact Info</h3>
        <p><BsGeoAltFill className="icon" /> 123 Career Lane, Job City</p>
        <p><BsTelephoneFill className="icon" /> +91 1234567890</p>
        <p><BsEnvelopeFill className="icon" />jobseekerportal55@gmail.com</p>
        <p><BsClockFill className="icon" /> Mon-Fri: 9am-6pm</p>
      </div>

      {/* Quick Links */}
      <div className="contact-card">
        <h3>Quick Links</h3>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="/combined-login">Login/Register</a></li>
        </ul>
      </div>
    </div>

    <hr />
  
  </div>
  </div>
</section>


        {/* Conditionally show login options below main content */}
        {showLoginOptions && (
          <section className="login-options section">
            <h2>Login Options</h2>
            <div className="login-buttons">
              <button
                className="login-option-btn"
                onClick={() => setLoginFormType('admin')}
              >
                Admin Login
              </button>
              <button
                className="login-option-btn"
                onClick={() => setLoginFormType('recruiter')}
              >
                Recruiter/Employer Login
              </button>
            </div>

            {/* Show the selected login form */}
            {loginFormType === 'admin' && <AdminLogin />}
            {loginFormType === 'recruiter' && <Login />}
          </section>
        )}
      </main>

      <footer className="footer">
        &copy; 2025 Job Portal. All rights reserved.
      </footer>
    </>
  );
};

export default HomePage;
