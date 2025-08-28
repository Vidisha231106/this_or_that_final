
"use client";
import React from 'react';
import './LandingHeader.css';
import ccLogo from '../../../public/assets/cc_white_logo.png';
import rvceLogo from '../../../public/assets/rvce_white_logo.png';

function LandingHeader() {
  return (
    <header className="landing-header">
      <div className="logo-container">
        <div className="logos-wrapper">
          <img src={ccLogo} alt="CC Logo" className="header-logo cc-logo" />
          <img src={rvceLogo} alt="RVCE Logo" className="header-logo rvce-logo" />
        </div>
        <div className="text-content">
          <h1 className="logo-text">This or That</h1>
          <p className="tagline">The real-time classroom debate game.</p>
        </div>
      </div>
    </header>
  );
}

export default LandingHeader;