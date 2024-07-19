import React, { useState, useEffect } from 'react';
import CertificationList from './components/CertificationList';
import trailblazerData from './trailblazerData.json';

const App = () => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    setProfiles(trailblazerData);
  }, []);

  return (
    <div className="App slds-p-around_medium">
      {profiles.map((profile, index) => (
        <CertificationList key={index} trailblazer={profile} />
      ))}
    </div>
  );
};

export default App;
