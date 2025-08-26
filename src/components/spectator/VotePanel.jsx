"use client";
import React from 'react';
import './VotePanel.css';

function VotePanel({ votes, onVote, hasVoted, isSubmittingVote }) {
  // This log helps confirm the correct function is being received
  console.log("VotePanel rendered. The onVote prop is a function:", typeof onVote === 'function');

  return (
    <div className="vote-panel card">
      <h3>Cast Your Vote</h3>
      <p>Should the teams switch sides?</p>
      
      <div className="vote-buttons">
        <button
          className="vote-btn switch"
          onClick={() => {
            console.log("VotePanel button clicked! Calling onVote('switch').");
            if (onVote) onVote('switch');
          }}
          disabled={hasVoted || isSubmittingVote}
        >
          {isSubmittingVote ? 'Submitting...' : 'Vote to SWITCH'}
        </button>
      </div>
      
      {hasVoted && (
        <p className="voted-message">You have voted in this round.</p>
      )}
    </div>
  );
}

export default VotePanel;