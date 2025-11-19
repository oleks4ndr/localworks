import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { getUnreadMessageCount } from '../api';
import './Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { currentUser, userRole } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Fetch unread message count for tradespeople
  useEffect(() => {
    let intervalId;

    const fetchUnreadCount = async () => {
      if (currentUser && userRole === 'tradesperson') {
        try {
          const count = await getUnreadMessageCount();
          setUnreadCount(count);
        } catch (error) {
          console.error('Failed to fetch unread count:', error);
        }
      }
    };

    // Initial fetch
    fetchUnreadCount();

    // Poll every 60 seconds
    if (currentUser && userRole === 'tradesperson') {
      intervalId = setInterval(fetchUnreadCount, 60000);
    }

    // Cleanup
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [currentUser, userRole]);

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
            <li><Link to="/">About</Link></li>
            {currentUser && (
              <li><Link to="/dashboard">Dashboard</Link></li>
            )}
            {currentUser && userRole === 'tradesperson' && (
              <li className="nav-messages-item">
                <Link to="/trades-messages">
                  My Messages
                  {unreadCount > 0 && (
                    <span className="unread-badge">{unreadCount}</span>
                  )}
                </Link>
              </li>
            )}
          </ul>
          
          {/* Auth buttons */}
          <div className="navbar-auth">
            {currentUser ? (
              <Link to="/profile" className="btn btn-primary">
                {currentUser.displayName || currentUser.email?.split('@')[0] || 'Profile'}
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-link">Log In</Link>
                <Link to="/register" className="btn btn-primary">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
