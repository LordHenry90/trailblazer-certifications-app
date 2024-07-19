import React from 'react';
import './CertificationDetails.css';

const CertificationDetails = ({ certification }) => {
  return (
    <div className="certification-details">
      <img src={certification.certificationImageUrl} alt={certification.title} className="slds-image certification-logo-details" />
      <h3 className="slds-text-heading_medium">{certification.title}</h3>
      <p>{certification.description}</p>
      <p><strong>Date Completed:</strong> {new Date(certification.dateCompleted).toLocaleDateString()}</p>
      {certification.dateExpired && <p><strong>Date Expired:</strong> {new Date(certification.dateExpired).toLocaleDateString()}</p>}
      <p><strong>Status:</strong> {certification.certificationStatus}</p>
      <a href={certification.certificationUrl} target="_blank" rel="noopener noreferrer">View Certification</a>
    </div>
  );
};

export default CertificationDetails;
