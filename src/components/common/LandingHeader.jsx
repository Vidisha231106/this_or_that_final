"use client";
import React from 'react';
import './LandingHeader.css'; // We'll create this file next

function LandingHeader() {
  return (
    <header className="landing-header">
      <div className="logo-container">
        {/* You can add a logo image here later if you want */}
        <h1 className="logo-text">This or That</h1>
      </div>
      <p className="tagline">The real-time classroom debate game.</p>
    </header>
  );
}

export default LandingHeader;