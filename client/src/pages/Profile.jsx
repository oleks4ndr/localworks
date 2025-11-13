import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const { currentUser, logout, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');

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
