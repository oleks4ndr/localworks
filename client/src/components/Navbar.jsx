import { useState } from 'react';
import { Link } from "react-router-dom";
import './Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-brand">
          <Link to="/">LocalWorks</Link>
        </div>

        {/* Hamburger menu for mobile */}
        <button 
          className="navbar-toggle" 
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Nav links */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-links">
            <li><Link to="/">Home</Link></li>
            {/* <li><Link to="/browse">Browse Professionals</Link></li> */}
            <li><Link to="/">About</Link></li>
          </ul>
          
          {/* Auth buttons */}
          <div className="navbar-auth">
            <Link to="/login" className="btn btn-link">Log In</Link>
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
