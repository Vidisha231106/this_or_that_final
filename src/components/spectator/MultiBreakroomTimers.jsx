import React from 'react';
import TimerDisplay from './TimerDisplay';
import { useDebate } from '../../context/DebateContext';

function MultiBreakroomTimers({ breakrooms = ['Breakroom1', 'Breakroom2', 'Breakroom3'] }) {
  const { state, actions } = useDebate();

  const startTimer = (breakroomId) => {
    actions.updateBreakroomTimer(breakroomId, 300, true); // Start 5-minute timer
  };

  const pauseTimer = (breakroomId) => {
    actions.updateBreakroomTimer(breakroomId, state?.timers[breakroomId]?.time || 0, false);
  };

  const resetTimer = (breakroomId) => {
    actions.resetBreakroomTimer(breakroomId, 300); // Reset to 5 minutes
  };

  return (
    <div className="multi-breakroom-timers">
      <h2>Multiple Breakroom Timers</h2>
      <div className="breakrooms-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {breakrooms.map(breakroomId => (
          <div key={breakroomId} className="breakroom-timer-container">
            <TimerDisplay breakroomId={breakroomId} initialTime={300} />
            <div className="timer-controls" style={{ marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button 
                onClick={() => startTimer(breakroomId)}
                style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Start
              </button>
              <button 
                onClick={() => pauseTimer(breakroomId)}
                style={{ padding: '8px 16px', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Pause
              </button>
              <button 
                onClick={() => resetTimer(breakroomId)}
                style={{ padding: '8px 16px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Reset
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MultiBreakroomTimers;
