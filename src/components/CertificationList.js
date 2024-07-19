import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CertificationDetails from './CertificationDetails';

const CertificationList = ({ trailblazer }) => {
  const [certifications, setCertifications] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const response = await axios.get(`/api/trailblazer/${trailblazer.id}/certifications`);
        setCertifications(response.data.certificationsList);
      } catch (error) {
        setError('Failed to load certifications. Please try again later.');
        setCertifications([]); // Ensure certifications is set to an empty array on error
      }
    };

    fetchCertifications();
  }, [trailblazer.id]);

  const handleShow = (certification) => {
    setSelectedCertification(certification);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  return (
    <div className="slds-p-around_medium">
      {error && <p className="slds-text-color_error">{error}</p>}
      <h2>{`${trailblazer.firstName} ${trailblazer.lastName}`} - <a href={trailblazer.profileUrl} target="_blank" rel="noopener noreferrer">{trailblazer.profileUrl}</a></h2>
      <div className="slds-grid slds-wrap slds-gutters">
        {certifications && certifications.map((cert, index) => (
          <div key={index} className="slds-col slds-size_1-of-3">
            <div className="slds-box slds-theme_default">
              <img src={cert.certificationImageUrl} alt={cert.title} className="slds-image" />
              <div className="slds-box">
                <h5 className="slds-text-heading_small">{cert.title}</h5>
                <p className="slds-text-body_regular">
                  Completed on: {new Date(cert.dateCompleted).toLocaleDateString()}<br />
                  <span className={`slds-badge ${cert.certificationStatus === 'ACTIVE' ? 'slds-theme_success' : 'slds-theme_error'}`}>
                    {cert.certificationStatus}
                  </span>
                </p>
                <button className="slds-button slds-button_brand" onClick={() => handleShow(cert)}>More Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {show && (
        <div className="slds-modal slds-fade-in-open">
          <div className="slds-modal__container">
            <div className="slds-modal__header">
              <button className="slds-button slds-button_icon slds-modal__close slds-button_icon-inverse" onClick={handleClose}>
                <svg className="slds-button__icon slds-button__icon_large" aria-hidden="true">
                  <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span className="slds-assistive-text">Close</span>
              </button>
              <h2 className="slds-text-heading_medium">Certification Details</h2>
            </div>
            <div className="slds-modal__content slds-p-around_medium">
              {selectedCertification && <CertificationDetails certification={selectedCertification} />}
            </div>
            <div className="slds-modal__footer">
              <button className="slds-button slds-button_neutral" onClick={handleClose}>Close</button>
            </div>
          </div>
        </div>
      )}

      {show && <div className="slds-backdrop slds-backdrop_open"></div>}
    </div>
  );
};

export default CertificationList;
