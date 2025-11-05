import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { testAPI } from '../api';
import './Landing.css';

function Landing() {
  const [apiStatus, setApiStatus] = useState('');

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
              <Link to="/login" className="btn btn-large btn-primary">
                Find Professionals
              </Link>
              <Link to="/register" className="btn btn-large btn-secondary">
                Join as a Pro
              </Link>
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
      </main>
    </div>
  );
}

export default Landing;
