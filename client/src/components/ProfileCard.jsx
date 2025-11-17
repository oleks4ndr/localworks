import { useState } from 'react';
import { Link } from "react-router-dom";
import './ProfileCard.css';

function ProfileCard({ data }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Render star rating
  const renderStars = (rating) => {
    if (!rating) return <span className="no-reviews">No reviews yet</span>;
    
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < fullStars ? 'star filled' : 'star'}>
          ★
        </span>
      );
    }
    
    return (
      <div className="rating">
        <span className="stars">{stars}</span>
        <span className="rating-text">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <>
      <div className="profile-card">
        <div className="profile-card-image">
          {data.photos && data.photos.length > 0 ? (
            <img src={data.photos[0]} alt={data.displayName} />
          ) : (
            <div className="profile-card-placeholder">👷</div>
          )}
        </div>
        
        <div className="profile-card-content">
          <h3 className="profile-card-name">{data.displayName}</h3>
          
          {data.headline && (
            <p className="profile-card-headline">{data.headline}</p>
          )}
          
          {data.location && (data.location.city || data.location.state) && (
            <p className="profile-card-location">
              📍 {data.location.city}{data.location.city && data.location.state ? ', ' : ''}{data.location.state}
            </p>
          )}
          
          <div className="profile-card-rating">
            {renderStars(data.avgRating)}
            {data.reviewCount > 0 && (
              <span className="review-count">{data.reviewCount} review{data.reviewCount !== 1 ? 's' : ''}</span>
            )}
          </div>
          
          {data.rate && data.rate.amount && (
            <p className="profile-card-rate">
              {data.rate.currency === 'USD' ? '$' : data.rate.currency}
              {data.rate.amount}/{data.rate.unit}
            </p>
          )}
          
          {data.skills && data.skills.length > 0 && (
            <div className="profile-card-skills">
              {data.skills.slice(0, 3).map((skill, index) => (
                <span key={index} className="skill-badge">{skill}</span>
              ))}
              {data.skills.length > 3 && (
                <span className="skill-badge more">+{data.skills.length - 3} more</span>
              )}
            </div>
          )}
        </div>
        
        <button 
          className="profile-card-btn"
          onClick={() => setIsModalOpen(true)}
        >
          Details
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>
              &#x2715;
            </button>
            
            <div className="modal-header">
              <div className="modal-image">
                {data.photos && data.photos.length > 0 ? (
                  <img src={data.photos[0]} alt={data.displayName} />
                ) : (
                  <div className="modal-placeholder">👷</div>
                )}
              </div>
              
              <div className="modal-header-info">
                <h2>{data.displayName}</h2>
                {data.headline && <p className="modal-headline">{data.headline}</p>}
                {data.location && (data.location.city || data.location.state) && (
                  <p className="modal-location">
                    📍 {data.location.city}{data.location.city && data.location.state ? ', ' : ''}{data.location.state}
                  </p>
                )}
                <div className="modal-rating">
                  {renderStars(data.avgRating)}
                  {data.reviewCount > 0 && (
                    <span className="review-count">{data.reviewCount} review{data.reviewCount !== 1 ? 's' : ''}</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="modal-body">
              {data.rate && data.rate.amount && (
                <div className="modal-section">
                  <h3>Rate</h3>
                  <p className="modal-rate">
                    {data.rate.currency === 'USD' ? '$' : data.rate.currency}
                    {data.rate.amount} per {data.rate.unit}
                  </p>
                </div>
              )}
              
              {data.bio && (
                <div className="modal-section">
                  <h3>About</h3>
                  <p>{data.bio}</p>
                </div>
              )}
              
              {data.skills && data.skills.length > 0 && (
                <div className="modal-section">
                  <h3>Skills</h3>
                  <div className="modal-skills">
                    {data.skills.map((skill, index) => (
                      <span key={index} className="skill-badge">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {data.credentials && data.credentials.length > 0 && (
                <div className="modal-section">
                  <h3>Credentials</h3>
                  <div className="credentials-list">
                    {data.credentials.map((credential, index) => (
                      <div key={index} className="credential-item">
                        <strong>{credential.label}</strong>
                        <p>Issued by: {credential.issuer}</p>
                        <p>ID: {credential.id}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {data.serviceRadiusKm && (
                <div className="modal-section">
                  <h3>Service Area</h3>
                  <p>Services within {data.serviceRadiusKm} km radius</p>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <Link to="/messages" className="btn btn-primary">
                Send Message
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProfileCard;