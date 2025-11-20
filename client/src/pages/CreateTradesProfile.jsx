import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createProfile, updateProfile, getMyProfile } from '../api';
import Navbar from '../components/Navbar';
import './CreateTradesProfile.css';

function CreateTradesProfile() {
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingProfileId, setExistingProfileId] = useState(null);

  // Form state
  const [displayName, setDisplayName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [serviceRadiusKm, setServiceRadiusKm] = useState(25);
  const [rateAmount, setRateAmount] = useState('');
  const [rateUnit, setRateUnit] = useState('hour');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [credentials, setCredentials] = useState([{ label: '', issuer: '', id: '' }]);
  const [photos, setPhotos] = useState(['']);
  const [isPublished, setIsPublished] = useState(false);

  // Check if user is a tradesperson, redirect if not
  useEffect(() => {
    if (userRole && userRole !== 'tradesperson') {
      navigate('/profile');
    }
  }, [userRole, navigate]);

  // Load existing profile if editing
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getMyProfile();
        if (profile) {
          setIsEditMode(true);
          setExistingProfileId(profile._id);
          setDisplayName(profile.displayName || '');
          setHeadline(profile.headline || '');
          setBio(profile.bio || '');
          setCity(profile.location?.city || '');
          setState(profile.location?.state || '');
          setServiceRadiusKm(profile.serviceRadiusKm || 25);
          setRateAmount(profile.rate?.amount || '');
          setRateUnit(profile.rate?.unit || 'hour');
          setSkills(profile.skills || []);
          setCredentials(profile.credentials?.length > 0 ? profile.credentials : [{ label: '', issuer: '', id: '' }]);
          setPhotos(profile.photos?.length > 0 ? profile.photos : ['']);
          setIsPublished(profile.isPublished || false);
        }
      } catch (err) {
        console.log('No existing profile found');
      }
    };

    loadProfile();
  }, []);

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleAddCredential = () => {
    setCredentials([...credentials, { label: '', issuer: '', id: '' }]);
  };

  const handleRemoveCredential = (index) => {
    setCredentials(credentials.filter((_, i) => i !== index));
  };

  const handleCredentialChange = (index, field, value) => {
    const newCredentials = [...credentials];
    newCredentials[index][field] = value;
    setCredentials(newCredentials);
  };

  const handleAddPhoto = () => {
    setPhotos([...photos, '']);
  };

  const handleRemovePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handlePhotoChange = (index, value) => {
    const newPhotos = [...photos];
    newPhotos[index] = value;
    setPhotos(newPhotos);
  };

  const validateForm = () => {
    if (!displayName.trim()) {
      setError('Display name is required');
      return false;
    }

    // Only validate mandatory fields if publishing
    if (isPublished) {
      if (!city.trim()) {
        setError('City is required for published profiles');
        return false;
      }

      if (!state.trim()) {
        setError('State is required for published profiles');
        return false;
      }

      if (!serviceRadiusKm || serviceRadiusKm <= 0) {
        setError('Service radius is required for published profiles');
        return false;
      }
    }

    // Validate rate amount if provided and not empty
    const rateValue = parseFloat(rateAmount);
    if (rateAmount !== '' && !isNaN(rateValue) && rateValue <= 0) {
      setError('Rate amount must be greater than 0');
      return false;
    }

    // Validate service radius range
    if (serviceRadiusKm && (serviceRadiusKm < 0 || serviceRadiusKm > 100)) {
      setError('Service radius must be between 0 and 100 km');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const profileData = {
        displayName: displayName.trim(),
        headline: headline.trim(),
        bio: bio.trim(),
        location: {
          city: city.trim(),
          state: state.trim()
        },
        serviceRadiusKm: parseInt(serviceRadiusKm),
        rate: rateAmount && rateAmount !== '' ? {
          currency: 'USD',
          amount: parseFloat(rateAmount),
          unit: rateUnit
        } : undefined,
        skills: skills,
        credentials: credentials.filter(c => c.label && c.issuer && c.id),
        photos: photos.filter(p => p.trim()),
        isPublished: isPublished
      };

      let response;
      if (isEditMode && existingProfileId) {
        response = await updateProfile(existingProfileId, profileData);
      } else {
        response = await createProfile(profileData);
      }

      setSuccess('Profile saved successfully!');
      if (!isEditMode) {
        setIsEditMode(true);
        setExistingProfileId(response.profile._id);
      }
    } catch (err) {
      console.error('Profile submission error:', err);
      setError(err.response?.data?.error || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-profile-page">
      <Navbar />
      
      <div className="create-profile-container">
        <div className="create-profile-header">
          <h1>{isEditMode ? 'Edit Trades Profile' : 'Create Your Trades Profile'}</h1>
          <p>Tell customers about your services and expertise</p>
        </div>

        <div className="create-profile-content">
          <form className="profile-form" onSubmit={handleSubmit}>
            {/* Display Name */}
            <div className="form-section">
              <h2>Basic Information</h2>
              
              <div className="form-group">
                <label htmlFor="displayName">Business/Display Name *</label>
                <input
                  type="text"
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g., Mike's Plumbing Services"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="headline">Headline</label>
                <input
                  type="text"
                  id="headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g., Licensed Master Plumber - 15+ Years Experience"
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio">About You</label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell customers about your experience, specialties, and what sets you apart..."
                  rows="5"
                />
              </div>
            </div>

            {/* Location */}
            <div className="form-section">
              <h2>Location & Service Area</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City {isPublished && '*'}</label>
                  <input
                    type="text"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="New York"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="state">State {isPublished && '*'}</label>
                  <input
                    type="text"
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="NY"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="serviceRadius">Service Radius (km) {isPublished && '*'}</label>
                <input
                  type="number"
                  id="serviceRadius"
                  value={serviceRadiusKm}
                  onChange={(e) => setServiceRadiusKm(e.target.value)}
                  min="0"
                  max="100"
                />
                <p className="input-help">Maximum: 100 km. Required for published profiles.</p>
              </div>
            </div>

            {/* Rate */}
            <div className="form-section">
              <h2>Pricing</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="rateAmount">Rate Amount ($)</label>
                  <input
                    type="number"
                    id="rateAmount"
                    value={rateAmount}
                    onChange={(e) => setRateAmount(e.target.value)}
                    placeholder="50"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="rateUnit">Per</label>
                  <select
                    id="rateUnit"
                    value={rateUnit}
                    onChange={(e) => setRateUnit(e.target.value)}
                  >
                    <option value="hour">Hour</option>
                    <option value="day">Day</option>
                    <option value="project">Project</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="form-section">
              <h2>Skills</h2>
              
              <div className="form-group">
                <label htmlFor="skillInput">Add Skills</label>
                <input
                  type="text"
                  id="skillInput"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder="Type a skill and press Enter"
                />
                <p className="input-help">Press Enter to add each skill</p>
              </div>

              {skills.length > 0 && (
                <div className="skills-list">
                  {skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="remove-tag"
                      >
                        &#x2715;
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Credentials */}
            <div className="form-section">
              <h2>Credentials</h2>
              
              {credentials.map((credential, index) => (
                <div key={index} className="credential-group">
                  <div className="credential-header">
                    <h3>Credential {index + 1}</h3>
                    {credentials.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCredential(index)}
                        className="btn-remove"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Credential Name</label>
                    <input
                      type="text"
                      value={credential.label}
                      onChange={(e) => handleCredentialChange(index, 'label', e.target.value)}
                      placeholder="e.g., Master Plumber License"
                    />
                  </div>

                  <div className="form-group">
                    <label>Issued By</label>
                    <input
                      type="text"
                      value={credential.issuer}
                      onChange={(e) => handleCredentialChange(index, 'issuer', e.target.value)}
                      placeholder="e.g., NYC Department of Buildings"
                    />
                  </div>

                  <div className="form-group">
                    <label>Credential ID</label>
                    <input
                      type="text"
                      value={credential.id}
                      onChange={(e) => handleCredentialChange(index, 'id', e.target.value)}
                      placeholder="e.g., MP-123456"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddCredential}
                className="btn btn-secondary"
              >
                + Add Another Credential
              </button>
            </div>

            {/* Photos */}
            <div className="form-section">
              <h2>Photos</h2>
              <p className="section-help">Add photo URLs to showcase your work</p>
              
              {photos.map((photo, index) => (
                <div key={index} className="photo-group">
                  <div className="form-group">
                    <label>Photo URL {index + 1}</label>
                    <div className="photo-input-group">
                      <input
                        type="url"
                        value={photo}
                        onChange={(e) => handlePhotoChange(index, e.target.value)}
                        placeholder="https://example.com/photo.jpg"
                      />
                      {photos.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(index)}
                          className="btn-remove-inline"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddPhoto}
                className="btn btn-secondary"
              >
                + Add Another Photo
              </button>
            </div>

            {/* Profile Visibility Toggle */}
            <div className="form-section">
              <h2>Profile Visibility</h2>
              <p className="section-help">Control whether your profile appears on the public dashboard</p>
              
              <div className="toggle-group">
                <label className="toggle-label">
                  <span className="toggle-text">Profile Public</span>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      disabled={loading}
                    />
                    <span className="toggle-slider"></span>
                  </div>
                </label>
                <p className="toggle-help">
                  {isPublished 
                    ? 'Your profile is visible to customers on the dashboard' 
                    : 'Your profile is hidden and only visible to you'}
                </p>
              </div>
            </div>

            {/* Messages */}
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

            {/* Actions */}
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary btn-large"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateTradesProfile;
