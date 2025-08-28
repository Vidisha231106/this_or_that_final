import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Hash, Users, Loader } from 'lucide-react';
import { registerStudent } from '../../services/debateService';
import './StudentRegistration.css';

function StudentRegistration({ classroom, onRegistrationComplete, onBack }) {
  const [formData, setFormData] = useState({
    studentName: '',
    phoneNumber: ''
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    try {
      const savedDetails = localStorage.getItem(`student_details_${classroom.id}`);
      if (savedDetails) {
        const student = JSON.parse(savedDetails);
        setFormData({
          studentName: student.name || '',
          phoneNumber: student.phoneNumber || ''
        });
      }
    } catch (error) {
      console.warn('Could not retrieve saved student details:', error);
    }
  }, [classroom.id]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.studentName.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (formData.studentName.trim().length < 2) {
      setError('Name must be at least 2 characters long');
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      setError('Please enter your phone number');
      return false;
    }
    if (formData.phoneNumber.trim().length < 3) {
      setError('Phone number must be at least 3 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsRegistering(true);
    setError('');

    try {
      const studentData = {
        name: formData.studentName.trim(),
        phoneNumber: formData.phoneNumber.trim().toUpperCase(),
        joinedAt: new Date().toISOString()
      };

      const result = await registerStudent(classroom.id, studentData);
      
      // Pass the assigned team info to parent component
      onRegistrationComplete({
        ...studentData,
        assignedTeam: result.assignedTeam,
        teamPosition: result.teamPosition
      });
    } catch (error) {
      console.error('Registration error:', error);
      if (error.message.includes('already registered')) {
        setError('This phone number is already registered in this session');
      } else if (error.message.includes('name already exists')) {
        setError('This name is already registered. Please use your full name or add your last initial');
      } else {
        setError('Registration failed. Please try again');
      }
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="student-registration">
      <div className="registration-container card">
        <div className="registration-header">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft size={20} />
            Back
          </button>
          
          <div className="registration-title">
            <div className="title-icon">
              <Users size={32} />
            </div>
            <h2>Student Registration</h2>
            <p>Please provide your details to join the debate session</p>
            <div className="classroom-info">
              <span className="classroom-name">{classroom.name}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <label htmlFor="studentName" className="form-label">
              <User size={16} />
              Your Full Name
            </label>
            <input
              type="text"
              id="studentName"
              name="studentName"
              className="form-input"
              placeholder="e.g., John Smith, Sarah Johnson"
              value={formData.studentName}
              onChange={handleInputChange}
              autoFocus
              required
              minLength={2}
              maxLength={50}
            />
            <div className="input-help">
              Enter your full name as it appears in school records
            </div>
          </div>

          <div className="form-group">
          <label htmlFor="phoneNumber" className="form-label">
            <Hash size={16} />
            Phone Number
          </label>
          <input
            type="tel" // Use "tel" for phone numbers
            id="phoneNumber"
            name="phoneNumber"
            className="form-input"
            placeholder="e.g., 9876543210"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
          />
          <div className="input-help">
            Your phone number will be used as a unique identifier for this session.
          </div>
        </div>

          <div className="form-actions">
            <button
              type="submit"
              className="register-btn btn-primary"
              disabled={isRegistering || !formData.studentName.trim() || !formData.phoneNumber.trim()}
            >
              {isRegistering ? (
                <>
                  <Loader size={18} className="loading-spinner" />
                  Registering & Assigning Team...
                </>
              ) : (
                <>
                  <Users size={18} />
                  Register & Join Debate
                </>
              )}
            </button>
          </div>
        </form>

        <div className="registration-info">
          <div className="info-section">
            <h4>🎯 What happens next?</h4>
            <div className="info-steps">
              <div className="info-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <strong>Automatic Team Assignment</strong>
                  <p>You'll be automatically assigned to either Team A or Team B</p>
                </div>
              </div>
              <div className="info-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <strong>Join Debate Session</strong>
                  <p>Enter the live debate room and see your team</p>
                </div>
              </div>
              <div className="info-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <strong>Participate & Vote</strong>
                  <p>Listen to arguments and vote on team performance</p>
                </div>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h4>ℹ️ Registration Notes</h4>
            <ul className="info-list">
              <li>Teams are balanced automatically</li>
              <li>Your information is only used for this session</li>
              <li>You can participate in voting and discussions</li>
              <li>The volunteer can see your participation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentRegistration;
