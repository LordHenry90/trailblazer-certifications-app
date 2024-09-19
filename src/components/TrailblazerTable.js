import React, { useState} from 'react';
import './TrailblazerTable.css';
import CertificationList from "./CertificationList"; // Componente per visualizzare le certificazioni

const TrailblazerTable = ({ trailblazers }) => {
  // Stato per tenere traccia di quale trailblazer ha le certificazioni aperte
  const [expandedTrailblazerId, setExpandedTrailblazerId] = useState(null);

  // Funzione per gestire l'espansione delle certificazioni
  const toggleCertifications = (id) => {
    if (expandedTrailblazerId === id) {
      setExpandedTrailblazerId(null); // Se già aperto, lo chiude
    } else {
      setExpandedTrailblazerId(id); // Altrimenti lo apre
    }
  };

  return (
    <div className="trailblazers-list">
        <table className="slds-table slds-table_bordered slds-table_cell-buffer slds-table_col-bordered">
        <thead>
          <tr className="slds-line-height_reset">
            <th scope="col">
              <div className="slds-truncate" title="First Name">First Name</div>
            </th>
            <th scope="col">
              <div className="slds-truncate" title="Last Name">Last Name</div>
            </th>
            <th scope="col">
              <div className="slds-truncate" title="Profile URL">Profile URL</div>
            </th>
            <th scope="col">
              <div className="slds-truncate" title="Certifications">Certifications</div>
            </th>
          </tr>
        </thead>
      <tbody>
        {trailblazers.map((trailblazer, index) => (
          <React.Fragment key={trailblazer.id}>
            <tr key={index} className="slds-hint-parent">
              <td >{trailblazer.firstName}</td>
              <td >{trailblazer.lastName}</td>
              <td >
                <a href={trailblazer.profileUrl} target="_blank" rel="noopener noreferrer">
                  {trailblazer.profileUrl}
                </a>
              </td>
              <td >
                <button className="slds-button slds-button_brand"
                  onClick={() => toggleCertifications(trailblazer.id)}
                >
                  {expandedTrailblazerId === trailblazer.id
                    ? "Hide Certifications"
                    : "Show Certifications"}
                </button>
              </td>
            </tr>
            {/* Mostra il componente CertificationList sotto la riga se espanso */}
            {expandedTrailblazerId === trailblazer.id && (
              <tr>
                <td colSpan="4">
                  <CertificationList trailblazer={trailblazer} />
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
        </table>
    </div>
  );
}

export default TrailblazerTable;