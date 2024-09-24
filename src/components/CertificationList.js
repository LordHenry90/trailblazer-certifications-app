import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CertificationDetails from './CertificationDetails';
import './CertificationList.css';

const CertificationList = ({ trailblazer }) => {
  const [certifications, setCertifications] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        setLoading(true); // Mostra l'indicatore di caricamento
        console.log(`Fetching certifications for trailblazer ID: ${trailblazer.id}`);
        const response = await axios.get(`/api/trailblazer/${trailblazer.id}/certifications`);
        console.log('API response:', response.data);
        setCertifications(response.data || []);
        setLoading(false); // Disabilita l'indicatore di caricamento
      } catch (error) {
        console.error('Error fetching certifications:', error);
        setError('Failed to load certifications. Please try again later.');
        setLoading(false); // Disabilita l'indicatore di caricamento anche in caso di errore
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

    // Renderizzazione condizionale
    if (loading) {
      return <p>Loading certifications...</p>;
    }
  
    if (error) {
      return <p>{error}</p>;
    }
  
    if (certifications.length === 0) {
      return <p>No certifications found for this trailblazer.</p>;
    }

  return (
    <div className="certification-list">
      {error && <p className="slds-text-color_error">{error}</p>}
      <table className="slds-table slds-table_bordered slds-table_cell-buffer slds-table_col-bordered">
        <thead>
          <tr className="slds-line-height_reset">
            <th scope="col">
              <div className="slds-truncate" title="Logo">Logo</div>
            </th>
            <th scope="col">
              <div className="slds-truncate" title="Title">Title</div>
            </th>
            <th scope="col">
              <div className="slds-truncate" title="Date Completed">Date Completed</div>
            </th>
            <th scope="col">
              <div className="slds-truncate" title="Status">Status</div>
            </th>
            <th scope="col">
              <div className="slds-truncate" title="Actions">Actions</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {certifications.map((cert, index) => (
            <tr key={index} className="slds-hint-parent">
              <td>
                <img src={cert.CertificationImageUrl} alt={cert.Title} className="certification-logo" />
              </td>
              <td>
                <div className="slds-truncate" title={cert.Title}>{cert.Title}</div>
              </td>
              <td>
                <div className="slds-truncate" title={new Date(cert.DateCompleted).toLocaleDateString()}>{new Date(cert.DateCompleted).toLocaleDateString()}</div>
              </td>
              <td>
                <span className={`slds-badge ${cert.CertificationStatus === 'Active' ? 'slds-theme_success' : 'slds-theme_error'}`}>
                  {cert.CertificationStatus}
                </span>
              </td>
              <td>
                <button className="slds-button slds-button_brand" onClick={() => handleShow(cert)}>More Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {show && (
        <div className="slds-modal slds-fade-in-open">
          <div className="slds-modal__container">
            <div className="slds-modal__header">
              <h2 className="slds-text-heading_medium">Certification Details</h2>
              <button className="slds-button slds-button_icon slds-modal__close slds-button_icon-inverse" onClick={handleClose}>
                <svg className="slds-button__icon slds-button__icon_large" aria-hidden="true">
                  <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span className="slds-assistive-text">Close</span>
              </button>
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
