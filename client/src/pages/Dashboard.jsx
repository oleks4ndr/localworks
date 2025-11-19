import Navbar from '../components/Navbar';
import ProfileCard from '../components/ProfileCard';
import { useAuth } from '../contexts/AuthContext';
import { getTradeProfiles } from '../api.js'
import './Dashboard.css';
import { useEffect, useState } from 'react';

function Dashboard() {
  const { currentUser } = useAuth();
  const [allProfiles, setAllProfiles] = useState([]);
  const [displayedProfiles, setDisplayedProfiles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const profilesPerPage = 3;

  // Fetch data for profile cards
  useEffect(() => {
    const loadProfiles = async () => {
      try {
        setLoading(true);
        const data = await getTradeProfiles();
        setAllProfiles(data || []);
        setDisplayedProfiles((data || []).slice(0, profilesPerPage));
        setError('');
      } catch (error) {
        console.error('API Error:', error);
        setError('Failed to fetch profiles');
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, []);

  // Handle show more button
  const handleShowMore = () => {
    const newCount = visibleCount + profilesPerPage;
    setVisibleCount(newCount);
    setDisplayedProfiles(allProfiles.slice(0, newCount));
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Find Professionals</h1>
          <p>Hello, {currentUser?.displayName || currentUser?.email}!</p>
        </div>

        <div className="dashboard-content">
          {loading ? (
            <div className="dashboard-loading">
              <div className="spinner"></div>
              <p>Loading profiles...</p>
            </div>
          ) : error ? (
            <div className="dashboard-error">
              <p>❌ {error}</p>
              <button onClick={() => window.location.reload()} className="btn btn-primary">
                Try Again
              </button>
            </div>
          ) : allProfiles.length === 0 ? (
            <div className="dashboard-empty">
              <h2>No profiles yet</h2>
              <p>Check back later for available professionals!</p>
            </div>
          ) : (
            <>
              <div className="profiles-grid">
                {displayedProfiles.map((profile) => (
                  <ProfileCard key={profile._id} data={profile} />
                ))}
              </div>
              
              {displayedProfiles.length < allProfiles.length && (
                <div className="show-more-container">
                  <button onClick={handleShowMore} className="btn btn-show-more">
                    Show More ({allProfiles.length - displayedProfiles.length} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
