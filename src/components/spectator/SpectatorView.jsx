"use client";
import React, { useState, useEffect } from 'react';
import { Users, Vote, Clock, Trophy, AlertCircle, User, Hash } from 'lucide-react';
import { useDebate } from '@/context/DebateContext';
import { submitVoteInGame } from '@/services/debateService';
import VotePanel from './VotePanel';
import TimerDisplay from './TimerDisplay';
import './SpectatorView.css';

function SpectatorView({ classroom, student }) {
  const { state } = useDebate();
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmittingVote, setIsSubmittingVote] = useState(false);
  const [error, setError] = useState('');

  // Check if user has voted in the current round (stored in localStorage)
  useEffect(() => {
    if (classroom?.id && state.speakingFor) {
      const votedKey = `voted_${classroom.id}_${state.speakingFor}`;
      const hasVotedStored = localStorage.getItem(votedKey) === 'true';
      setHasVoted(hasVotedStored);
    }
  }, [classroom?.id, state.speakingFor]);

  // Handler for submitting a vote
  const handleVote = async (voteType) => {
    if (hasVoted || !classroom?.id || !state.activeGameId) return;

    setIsSubmittingVote(true);
    setError('');
    try {
      await submitVoteInGame(classroom.id, state.activeGameId, voteType);
      const votedKey = `voted_${classroom.id}_${state.speakingFor}`;
      localStorage.setItem(votedKey, 'true');
      setHasVoted(true);
    } catch (error) {
      console.error('Error submitting vote:', error);
      setError('Failed to submit vote. Please try again.');
    } finally {
      setIsSubmittingVote(false);
    }
  };

  // Helper functions
  const getMyTeam = () => {
    if (!student) return null;
    return student.assignedTeam;
  };

  const isMyTeamSpeaking = () => {
    return getMyTeam() === state.speakingFor;
  };

  // Main loading state for the component
  if (state.isLoading) {
    return (
      <div className="spectator-view">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading debate session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="spectator-view">
      {error && (
        <div className="error-banner">
          <AlertCircle size={16} />
          {error}
          <button onClick={() => setError('')} className="error-close">×</button>
        </div>
      )}

      {/* Student Info Card */}
      {student && (
        <div className="student-info-card card">
          <div className="student-header">
            <div className="student-details">
              <h3><User size={20} /> Welcome, {student.name}!</h3>
              <div className="student-meta">
                <span className="phone-number"><Hash size={14} /> {student.phoneNumber}</span>
                <span className={`team-assignment team-${student.assignedTeam?.toLowerCase()}`}>You're on Team {student.assignedTeam}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* This block shows only when a breakout game is live */}
      {state.debateStarted && (
        <>
          <div className="debate-status-card card">
            <div className="status-header">
              <div className="status-info">
                <h2>Debate Status</h2>
                <div className="status-indicator active">
                  <div className="status-dot"></div>
                  <span>Live Debate</span>
                </div>
              </div>
              <div className="current-speaker">
                <span className="speaker-label">Speaking Pro:</span>
                <span className={`team-badge team-${state.speakingFor.toLowerCase()}`}>Team {state.speakingFor}</span>
              </div>
            </div>
            <div className="topic-display">
              <h3>📋 Current Topic</h3>
              <p className="topic-text">{state.topic}</p>
            </div>
          </div>

          <TimerDisplay />

          <div className="on-the-floor-card card">
            <h3>🎤 On the Floor</h3>
            <div className="active-players-display">
              <div className="team-column">
                <h4>Team A Speakers ({state.teamAStance})</h4>
                <ul>{state.activePlayers.teamA.map(p => <li key={p.phoneNumber}>{p.name}</li>)}</ul>
              </div>
              <div className="vs-divider">
                <div className="vs-text">VS</div>
              </div>

              <div className="team-column">
                <h4>Team B Speakers ({state.teamAStance === 'Pro' ? 'Con' : 'Pro'})</h4>
                <ul>{state.activePlayers.teamB.map(p => <li key={p.phoneNumber}>{p.name}</li>)}</ul>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Teams Overview (Master Roster) */}
      <div className="teams-overview">
        <div className={`team-card team-a ${getMyTeam() === 'A' ? 'my-team' : ''}`}>
          <div className="team-header">
            <h3><Users size={20} /> Team A ({state.teamAStance})</h3>
            <span className="member-count">{state.teamA.length} members</span>
          </div>
          <div className="team-members">
            {state.teamA.length > 0 ? (
              state.teamA.map(member => (
                <span key={member.phoneNumber} className={`member-badge ${student?.phoneNumber === member.phoneNumber ? 'me' : ''}`}>
                  {member.name}
                  {student?.phoneNumber === member.phoneNumber && " (You)"}
                </span>
              ))
            ) : ( getMyTeam() ? <p className="no-members">Syncing team...</p> : <p className="no-members">No students assigned yet</p> )}
          </div>
        </div>
        <div className="vs-divider"><div className="vs-text">VS</div></div>
        <div className={`team-card team-b ${getMyTeam() === 'B' ? 'my-team' : ''}`}>
          <div className="team-header">
            <h3><Users size={20} /> Team B ({state.teamAStance === 'Pro' ? 'Con' : 'Pro'})</h3>
            <span className="member-count">{state.teamB.length} members</span>
          </div>
          <div className="team-members">
            {state.teamB.length > 0 ? (
              state.teamB.map(member => (
                <span key={member.phoneNumber} className={`member-badge ${student?.phoneNumber === member.phoneNumber ? 'me' : ''}`}>
                  {member.name}
                  {student?.phoneNumber === member.phoneNumber && " (You)"}
                </span>
              ))
            ) : ( getMyTeam() ? <p className="no-members">Syncing team...</p> : <p className="no-members">No students assigned yet</p> )}
          </div>
        </div>
      </div>

      {/* Voting Section - shows when a game is live */}
      {state.debateStarted && (
        <VotePanel
          votes={state.votes}
          onVote={handleVote}
          hasVoted={hasVoted}
          isSubmittingVote={isSubmittingVote}
        />
      )}

      {/* Waiting State - shows before a game is live */}
      {!state.debateStarted && (
        <div className="waiting-state card">
          <div className="waiting-content">
            <Clock size={48} className="waiting-icon" />
            <h3>Waiting for a Game to Start</h3>
            <p>Your volunteer will start a breakout game when ready.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SpectatorView;