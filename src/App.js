import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Parser } from 'json2csv';
import TrailblazerTable from './components/TrailblazerTable';
import ActionMenu from './components/ActionMenu';
import Footer from './components/Footer';
import './App.css';

const App = () => {
  const [profiles, setProfiles] = useState([]);
  const [allCertifications, setAllCertifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get('/api/trailblazers');
        setProfiles(response.data);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    fetchProfiles();
  }, []);

useEffect(() => {
  const fetchCertifications = async () => {
    const certifications = [];
    for (const trailblazer of profiles) {
      try {
        const response = await axios.get(`/api/trailblazer/${trailblazer.id}/certifications`);
        console.log(response);
        // Controlliamo se certificationsList è presente e se è un array
        if (response.data && Array.isArray(response.data.CertificationsList)) {
          const trailblazerCertifications = response.data.CertificationsList.map(cert => ({
            firstName: trailblazer.firstName,
            lastName: trailblazer.lastName,
            profileUrl: trailblazer.profileUrl,
            ...cert
          }));
          certifications.push(...trailblazerCertifications);
        } else {
          console.error(`Certifications list is missing for ${trailblazer.firstName} ${trailblazer.lastName}`);
        }
      } catch (error) {
        console.error(`Error fetching certifications for ${trailblazer.firstName} ${trailblazer.lastName}:`, error);
      }
    }
    setAllCertifications(certifications);
  };

  fetchCertifications();
}, [profiles]);

  const handleExportCSV = () => {
    const fields = ['firstName', 'lastName', 'profileUrl', 'Title', 'CertificationImageUrl', 'DateCompleted', 'CertificationStatus', 'CertificationUrl', 'Description', 'DateExpired'];
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

  const handleAddNew = async (newTrailblazer) => {
    const updatedProfiles = [...profiles, newTrailblazer];
    setProfiles(updatedProfiles);
    try {
      await axios.post('/api/trailblazers', updatedProfiles);
    } catch (error) {
      console.error('Error saving new trailblazer:', error);
    }
  };

  const handleAddMore = async (data) => {
    const newTrailblazers = data.map(item => ({
      id: item.id,
      firstName: item.firstName,
      lastName: item.lastName,
      profileUrl: item.profileUrl
    }));
    const updatedProfiles = [...profiles, ...newTrailblazers];
    setProfiles(updatedProfiles);
    try {
      await axios.post('/api/trailblazers', updatedProfiles);
    } catch (error) {
      console.error('Error saving new trailblazers:', error);
    }
  };


  const filteredProfiles = profiles.filter(profile =>
    profile.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.profileUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App slds-p-around_medium">
      <ActionMenu
        onAddNew={handleAddNew}
        onAddMore={handleAddMore}
        onExportCSV={handleExportCSV}
      />
        <TrailblazerTable trailblazers={filteredProfiles} />
	  <Footer />
    </div>
  );
};

export default App;
