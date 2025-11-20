import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { testAPI } from '../api';
import './Landing.css';

function Landing() {
  const [apiStatus, setApiStatus] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    // Temporary to check that api is working
    const checkAPI = async () => {
      try {
        const data = await testAPI();
        setApiStatus(data.message);
        console.log('API Connected:', data.message);
      } catch (error) {
        console.error('API Error:', error);
        setApiStatus('Not connected');
      }
    };

    checkAPI();
  }, []);

  return (
    <div className="landing">
      <Navbar />
      
      <main className="landing-content">
        <section className="hero">
          <div className="hero-container">
            <h1 className="hero-title">
              Wake up to solutions,<br />
              <span className="highlight">not problems.</span>
            </h1>
            <p className="hero-subtitle">
              Connect with trusted local professionals ready to help — from plumbers 
              and electricians to handymen and more.
            </p>
            <div className="hero-buttons">
              {currentUser ? (
                <Link to="/dashboard" className="btn btn-large btn-primary">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn btn-large btn-primary">
                    Find Professionals
                  </Link>
                  <Link to="/register" className="btn btn-large btn-secondary">
                    Register as a Pro
                  </Link>
                </>
              )}
            </div>
            
            {/* Check api status (for development) */}
            {apiStatus && (
              <p className="api-status">
                API: {apiStatus}
              </p>
            )}
          </div>
        </section>
        
        {/* Features section */}
        <section className="features">
          <div className="features-container">
            <h2>How It Works</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🔍</div>
                <h3>Search</h3>
                <p>Find skilled professionals in your area</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💬</div>
                <h3>Connect</h3>
                <p>Message directly for quotes and details</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">✅</div>
                <h3>Get It Done</h3>
                <p>Hire trusted experts for your job</p>
              </div>
            </div>
          </div>
        </section>
        {/* About section */}
        <section className="about" id="about">
          <div className="about-container">
            <h2>About LocalWorks</h2>
            <div className="about-grid">
              <div className="about-card">
                <div className="about-icon">⁉️</div>
                <h3>What We Do</h3>
                <p>LocalWorks is a professional platform connecting homeowners and property managers with verified local tradespeople and service professionals.</p>
              </div>
              <div className="about-card">
                <div className="about-icon">🤔</div>
                <h3>Why Choose Us</h3>
                <p>We simplify the process of finding qualified professionals by providing detailed profiles, credentials, and direct communication channels.</p>
              </div>
              <div className="about-card">
                <div className="about-icon">📍</div>
                <h3>Our Location</h3>
                <p>Based in New York City, serving local communities with trusted professional connections.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Landing;
