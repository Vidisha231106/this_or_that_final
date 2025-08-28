"use client";
import React from 'react';
import './LandingPage.css';

function LandingPage({ onRoleSelect }) {
  return (
    <div className="landing-page">
      <div className="role-selection">
        <div className="role-cards">
          {/* Spectator Card */}
          <div className="role-card spectator-card" onClick={() => onRoleSelect('spectator')}>
            <h3>Join as Student</h3>
            <p>
              Participate in live debates, vote on arguments, and engage in classroom discussions
            </p>
            
            <button className="role-btn">
              Join Debate Session !
            </button>
          </div>

          {/* Admin Card */}
          <div className="role-card admin-card" onClick={() => onRoleSelect('admin')}>
            <h3>Login as Volunteer</h3>
            <p>
              Create and manage debate sessions, organize teams, and moderate discussions
            </p>
            
            <button className="role-btn">
              Volunteer Login
            </button>
          </div>
        </div>
      </div>

      <div className="landing-features">
        <h2>Features</h2>
        <div className="feature-grid">
          <div className="feature-item">
            <h4>🎯 Real-time Debates</h4>
            <p>Experience live, interactive debate sessions with instant feedback and voting</p>
          </div>
          <div className="feature-item">
            <h4>👥 Team Management</h4>
            <p>Organize students into debate teams with easy-to-use admin controls</p>
          </div>
          <div className="feature-item">
            <h4>📊 Live Analytics</h4>
            <p>Track participation, votes, and engagement in real-time</p>
          </div>
          <div className="feature-item">
            <h4>🔒 Secure Access</h4>
            <p>Password-protected sessions ensure only authorized participants can join</p>
          </div>
        </div>
      </div>

      <div className="landing-footer">
        <p>Built for educators, designed for engagement</p>
      </div>
    </div>
  );
}

export default LandingPage;