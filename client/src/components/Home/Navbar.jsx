import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleClose = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="logo">JobPortal</div>
      <div className="menu-icon" onClick={handleToggle}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>
      <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
        <li onClick={handleClose}><a href="#home">Home</a></li>
        <li onClick={handleClose}><a href="#jobs">Jobs</a></li>
        <li onClick={handleClose}><a href="#about">About</a></li>
        <li onClick={handleClose}><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
