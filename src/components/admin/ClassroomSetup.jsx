"use client";
import React, { useState } from 'react';
import { ArrowLeft, Plus, RefreshCw, Copy, Check } from 'lucide-react';
import { 
  generateDebatePassword, 
  generateDebateTopic, 
  getClassroomByPassword 
} from '../../services/geminiService';

import './ClassroomSetup.css';

const classOptions = [
  "S1 CV-217", "S1 CV-306", "S1 CV-314", "S1 CV-312", "S1 CV-317", "S1 CV-319",
  "S1 EE-116", "S1 EE-117", "S1 EE-112", "S1 EE-203",
  "S1 AIML-CR001", "S1 AIML-CR002", "S1 BT-217", "S1 BT-218",
  "S1 CH-104", "S1 CH-105",
  "S1 EE-202", "S1 EE-215",
  "S1 EC-203", "S1 EC-204", "S1 EC-205", "S1 EC-211", "S1 EC-212", "S1 EC-214",
  "S1 IS-112B", "S1 IS-106A",
  "S2 CV-217", "S2 CV-306", "S2 CV-314", "S2 CV-312", "S2 CV-317", "S2 CV-319",
  "S2 EE-116", "S2 EE-117", "S2 EE-112", "S2 EE-203",
  "S2 AIML-CR001", "S2 AIML-CR002", "S2 BT-217", "S2 BT-218",
  "S2 CH-104", "S2 CH-105",
  "S2 EE-202", "S2 EE-215",
  "S2 EC-203", "S2 EC-204", "S2 EC-205", "S2 EC-211", "S2 EC-212", "S2 EC-214",
  "S2 IS-112B", "S2 IS-106A"

];

function ClassroomSetup({ onClassroomCreated, onBack }) {
  const [formData, setFormData] = useState({
    name: classOptions[0], // 👈 Set the default value
    adminName: '',
    password: ''
  });
  
  const [isGeneratingTopic, setIsGeneratingTopic] = useState(false);
  const [isGeneratingPassword, setIsGeneratingPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleGeneratePassword = async () => {
    setIsGeneratingPassword(true);
    setError('');
    try {
      let newPassword;
      let isUnique = false;
      let attempts = 0;
      while (!isUnique && attempts < 10) {
        newPassword = await generateDebatePassword();
        const existing = await getClassroomByPassword(newPassword);
        if (!existing) {
          isUnique = true;
        }
        attempts++;
      }
      if (!isUnique) throw new Error('Could not find a unique password.');
  
      // Save the unique password to the formData state
      setFormData(prev => ({ ...prev, password: newPassword }));
      setShowPassword(true);
    } catch (err) {
      setError('Failed to generate a unique password.');
    } finally {
      setIsGeneratingPassword(false);
    }
  };
   const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(formData.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy password:', error);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Please enter a classroom name');
      return false;
    }
    if (!formData.adminName.trim()) {
      setError('Please enter your name');
      return false;
    }
  
    if (!formData.password) { 
      setError('Please generate a session password');
      return false;
    }
    return true;
  };

  const handleCreateClassroom = async () => {
    if (!validateForm()) return;
    setIsCreating(true);
    try {
      // Pass the entire formData object, which now includes the unique password
      await onClassroomCreated(formData);
    } catch (error) {
      setError('Failed to create classroom. Please try again.');
      console.error('Classroom creation error:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="classroom-setup">
      <div className="setup-header">
        <button onClick={onBack} className="back-btn">
          <ArrowLeft size={20} />
          Back
        </button>
        <h2>Create New Classroom Session</h2>
        <p className="setup-description">
          Set up a new debate session for your students
        </p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="setup-form">
        <div className="form-section">
          <h3>Classroom Details</h3>
          
          <div className="form-group">
            <label htmlFor="name">Classroom Name *</label>
            <select
            id="name"
            name="name"
            className="classroom-input" // You can use the same style
            value={formData.name}
            onChange={handleInputChange}
            required
          >
            {classOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          </div>

          <div className="form-group">
            <label htmlFor="adminName">Your Name *</label>
            <input
              id="adminName"
              name="adminName"
              type="text"
              className="classroom-input"
              value={formData.adminName}
              onChange={handleInputChange}
              
              required
            />
          </div>

        </div>

        <div className="form-section">
          <h3>Session Security</h3>
          
          <div className="password-section">
            <label>Session Password *</label>
            <div className="password-generator">
              <button
                type="button"
                className="generate-btn"
                onClick={handleGeneratePassword}
                disabled={isGeneratingPassword}
              >
                {isGeneratingPassword ? (
                  <>
                    <div className="loading-spinner small"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} />
                    Generate Password
                  </>
                )}
              </button>
              
              <div className="team-info">
                <p className="team-description">
                Please Be Patient with the "Generate" Buttons ⏳
                </p>
              </div>
              
              {showPassword && formData.password &&  (
                <div className="generated-password">
                  <span className="password-text">{formData.password}</span>
                  <button 
                    type="button"
                    className="copy-btn" 
                    onClick={handleCopyPassword}
                    title="Copy to clipboard"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              )}
            </div>
            <p className="password-info">
              Students will use this password to join your debate session. 
              Make sure to share it with them once the session is created.
            </p>
          </div>
        </div>
      </div>

      <div className="setup-tips">
        <h3>💡 Setup Tips</h3>
        <ul>
          <li><strong>Classroom Name:</strong> Choose something students will recognize (e.g., "Period 3 English")</li>
          <li><strong>Password Security:</strong> The generated password is unique and easy to remember</li>
          <li><strong>Topic Selection:</strong> Pick controversial but appropriate topics that encourage debate</li>
          <li><strong>Team Management:</strong> You can add students to teams after creating the session</li>
        </ul>
      </div>

      <div className="setup-actions">
        <button
          className="create-classroom-btn"
          onClick={handleCreateClassroom}
          disabled={isCreating || !formData.password || !formData.name.trim() || !formData.adminName.trim()}
        >
          {isCreating ? (
            <>
              <div className="loading-spinner small"></div>
              Creating Session...
            </>
          ) : (
            <>
              <Plus size={18} />
              Create Classroom Session
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ClassroomSetup;
