import React from 'react';
import TimerDisplay from './TimerDisplay';
import { useDebate } from '../../context/DebateContext';

function MultiRoomTimers({ rooms = ['Room1', 'Room2', 'Room3'] }) {
  const { state, actions } = useDebate();

  const startTimer = (roomId) => {
    actions.updateRoomTimer(roomId, 300, true); // Start 5-minute timer
  };

  const pauseTimer = (roomId) => {
    actions.updateRoomTimer(roomId, state?.timers[roomId]?.time || 0, false);
  };

  const resetTimer = (roomId) => {
    actions.resetRoomTimer(roomId, 300); // Reset to 5 minutes
  };

  return (
    <div className="multi-room-timers">
      <h2>Multiple Room Timers</h2>
      <div className="rooms-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {rooms.map(roomId => (
          <div key={roomId} className="room-timer-container">
            <TimerDisplay roomId={roomId} initialTime={300} />
            <div className="timer-controls" style={{ marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button 
                onClick={() => startTimer(roomId)}
                style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Start
              </button>
              <button 
                onClick={() => pauseTimer(roomId)}
                style={{ padding: '8px 16px', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Pause
              </button>
              <button 
                onClick={() => resetTimer(roomId)}
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

export default MultiRoomTimers;
