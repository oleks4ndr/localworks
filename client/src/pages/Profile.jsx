import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getMyProfile, updateUserRole } from '../api';
import Navbar from '../components/Navbar';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const { currentUser, logout, updateUserProfile, userRole, getUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [hasProfile, setHasProfile] = useState(false);
  const [switchingRole, setSwitchingRole] = useState(false);

  // Check if user has a trades profile
  useEffect(() => {
    const checkProfile = async () => {
      if (userRole === 'tradesperson') {
        try {
          const profile = await getMyProfile();
          setHasProfile(!!profile);
        } catch (err) {
          setHasProfile(false);
        }
      }
    };

    checkProfile();
  }, [userRole]);

  const handleSwitchToTradesperson = async () => {
    setError('');
    setSuccess('');
    setSwitchingRole(true);

    try {
      await updateUserRole(currentUser.uid);
      const userData = await getUserData(); // Refresh user data to update role
      if (userData) {
        setSuccess('Account switched to tradesperson! You can now create your trades profile.');
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      }
    } catch (err) {
      console.error('Switch role error:', err);
      setError(err.response?.data?.error || 'Failed to switch account type. Please try again.');
    } finally {
      setSwitchingRole(false);
    }
  };

  const handleLogout = async () => {
    setError('');
    setLoading(true);
    
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to log out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate display name
    if (!displayName.trim()) {
      setError('Display name cannot be empty');
      return;
    }

    if (displayName.trim() === currentUser?.displayName) {
      setError('No changes to save');
      return;
    }

    setLoading(true);
    
    try {
      await updateUserProfile(displayName.trim());
      setSuccess('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <Navbar />
      
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt="Profile" />
              ) : (
                <div className="avatar-placeholder">
                  {currentUser?.displayName?.charAt(0)?.toUpperCase() || 
                   currentUser?.email?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <h1>{currentUser?.displayName || 'User Profile'}</h1>
            <p className="profile-email">{currentUser?.email}</p>
          </div>

          <div className="profile-content">
            <h2>Account Settings</h2>
            
            <form onSubmit={handleSaveChanges} className="profile-form">
              <div className="form-group">
                <label htmlFor="displayName">Display Name</label>
                <input
                  type="text"
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your display name"
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={currentUser?.email || ''}
                  disabled
                  className="input-disabled"
                />
                <p className="input-help">Email cannot be changed</p>
              </div>

              {success && (
                <div className="success-message">
                  {success}
                </div>
              )}
              
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <button 
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>

            {/* Tradesperson Profile Section */}
            {userRole === 'tradesperson' && (
              <div className="trades-profile-section">
                <h2>Trades Profile</h2>
                <p>Manage your professional profile that customers see on the dashboard.</p>
                <button
                  onClick={() => navigate('/create-trades-profile')}
                  className="btn btn-primary btn-full"
                  disabled={loading}
                >
                  {hasProfile ? 'Edit Trades-Profile' : 'Create Trades-Profile'}
                </button>
              </div>
            )}

            {/* Switch to Tradesperson Section */}
            {userRole === 'user' && (
              <div className="switch-role-section">
                <h2>Are you a tradesperson?</h2>
                <p>Switch your account to create a professional profile and connect with customers.</p>
                <button
                  onClick={handleSwitchToTradesperson}
                  className="btn btn-secondary btn-full"
                  disabled={switchingRole || loading}
                >
                  {switchingRole ? 'Switching...' : 'Switch to Tradesperson Account'}
                </button>
              </div>
            )}

            <div className="profile-actions">
              <button 
                onClick={handleLogout}
                className="btn btn-logout btn-full"
                disabled={loading}
              >
                {loading ? 'Logging out...' : 'Log Out'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
