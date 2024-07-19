import React from 'react';
import './TrailblazerProfile.css';

const TrailblazerProfile = ({ firstName, lastName, profileUrl }) => {
  return (
    <div className="trailblazer-profile">
      <h2 className="trailblazer-name">{firstName} {lastName}</h2>
      <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="trailblazer-url">
        {profileUrl}
      </a>
    </div>
  );
};

export default TrailblazerProfile;
