
"use client";
import React from 'react';
import './LandingHeader.css';

function LandingHeader() {
  return (
    <header className="landing-header">
      <div className="logo-container">
        <div className="logos-wrapper">
        <img src="/assets/cc_white_logo.png" alt="CC Logo" className="header-logo" />
        <img src="/assets/rvce_white_logo.png" alt="RVCE Logo" className="header-logo" />      </div>
        <div className="text-content">
          <h1 className="logo-text">This or That</h1>
          <p className="tagline">The real-time classroom debate game.</p>
        </div>
      </div>
    </header>
  );
}

export default LandingHeader;