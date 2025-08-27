import React, { useState, useEffect } from 'react';
import { useDebate } from '../../context/DebateContext';
import { Clock } from 'lucide-react';
import './TimerDisplay.css'; 

function TimerDisplay({ roomId = 'default', initialTime = 60 }) {
  const { state, actions } = useDebate();

  // Get room-specific timer or use backward compatibility
  const roomTimer = state.timers[roomId] || { time: state.timer || initialTime, isRunning: state.isTimerRunning || false };
  const { time: timer, isRunning: isTimerRunning } = roomTimer;

  const [displayTime, setDisplayTime] = useState(timer);

  // Initialize room timer if it doesn't exist
  useEffect(() => {
    if (!state.timers[roomId]) {
      actions.resetRoomTimer(roomId, initialTime);
    }
  }, [roomId, initialTime, state.timers, actions]);

  useEffect(() => {
    setDisplayTime(timer);
  }, [timer, isTimerRunning, roomId]);
  
  useEffect(() => {
    let interval = null;

    if (isTimerRunning && displayTime > 0) {
      interval = setInterval(() => {
        setDisplayTime(prevTime => {
          const newTime = prevTime - 1;
          // Update the room-specific timer in the global state
          actions.updateRoomTimer(roomId, newTime, newTime > 0);
          return newTime;
        });
      }, 1000);
    } else if (!isTimerRunning || displayTime === 0) {
      clearInterval(interval);
      if (displayTime === 0) {
        // Timer reached zero, stop it
        actions.updateRoomTimer(roomId, 0, false);
      }
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, displayTime, roomId, actions]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="timer-display card">
      <Clock size={24} />
      <h3>Debate Timer - Room {roomId}</h3>
      <div className="time">{formatTime(displayTime)}</div>
      <div className={`status ${isTimerRunning && displayTime > 0 ? 'running' : 'paused'}`}>
        {isTimerRunning && displayTime > 0 ? 'Running' : 'Paused'}
      </div>
    </div>
  );
}

export default TimerDisplay;