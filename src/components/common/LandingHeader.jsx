
"use client";
import React from 'react';
import Image from 'next/image';
import './LandingHeader.css';

function LandingHeader() {
  return (
    <header className="landing-header">
      <div className="logo-container">
        <div className="logos-wrapper">
        <Image src="/assets/rvce_white_logo.png" alt="RVCE Logo" width={250}  
          height={80}/> 
        <Image
          src="/assets/cc_white_logo.png"
          alt="CC Logo"
          width={125}  
          height={40} 
        />
             
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