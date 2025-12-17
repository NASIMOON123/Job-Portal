import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button 
      onClick={toggleTheme} 
      style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}
      title="Toggle Dark/Light Mode"
    >
      {theme === 'light' ? <FaMoon color="#333"/> : <FaSun color="#FFD700"/>}
    </button>
  );
};

export default ThemeToggle;
