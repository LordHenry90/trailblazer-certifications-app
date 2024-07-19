// Author: Enrico Notaro

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Parser } from 'json2csv';
import CertificationList from './components/CertificationList';
import trailblazerData from './trailblazerData.json';
import Footer from './components/Footer';
import './App.css';

const App = () => {
  const [profiles, setProfiles] = useState([]);
  const [allCertifications, setAllCertifications] = useState([]);

  useEffect(() => {
    const fetchCertifications = async () => {
      const certifications = [];
      for (const trailblazer of trailblazerData) {
        try {
          const response = await axios.get(`/api/trailblazer/${trailblazer.id}/certifications`);
          const trailblazerCertifications = response.data.certificationsList.map(cert => ({
            firstName: trailblazer.firstName,
            lastName: trailblazer.lastName,
            profileUrl: trailblazer.profileUrl,
            ...cert
          }));
          certifications.push(...trailblazerCertifications);
        } catch (error) {
          console.error(`Error fetching certifications for ${trailblazer.firstName} ${trailblazer.lastName}:`, error);
        }
      }
      setAllCertifications(certifications);
    };

    setProfiles(trailblazerData);
    fetchCertifications();
  }, []);

  const handleExportCSV = () => {
    const fields = ['firstName', 'lastName', 'profileUrl', 'title', 'certificationImageUrl', 'dateCompleted', 'certificationStatus', 'certificationUrl', 'description', 'dateExpired'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(allCertifications);
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'trailblazers_certifications.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="App slds-p-around_medium">
      <button className="slds-button slds-button_neutral" onClick={handleExportCSV}>Export All to CSV</button>
      {profiles.map((profile, index) => (
        <CertificationList key={index} trailblazer={profile} />
      ))}
      <Footer />
    </div>
  );
};

export default App;
