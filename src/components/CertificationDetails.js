import React from 'react';
import './CertificationDetails.css';

const CertificationDetails = ({ certification }) => {
  return (
    <div className="certification-details">
      <img src={certification.CertificationImageUrl} alt={certification.Title} className="slds-image certification-logo-details" />
      <h3 className="slds-text-heading_medium">{certification.Title}</h3>
      <p className="slds-text-body_regular">{certification.Description}</p>
      <div className="certification-info">
        <p><strong>Date Completed:</strong> {new Date(certification.DateCompleted).toLocaleDateString()}</p>
        {certification.DateExpired && <p><strong>Date Expired:</strong> {new Date(certification.DateExpired).toLocaleDateString()}</p>}
        <p><strong>Status:</strong> <span className={`slds-badge ${certification.CertificationStatus === 'Active' ? 'slds-theme_success' : 'slds-theme_error'}`}>{certification.CertificationStatus}</span></p>
        <a href={certification.CertificationUrl} target="_blank" rel="noopener noreferrer">View Certification</a>
      </div>
    </div>
  );
};

export default CertificationDetails;
