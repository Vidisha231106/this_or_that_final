"use client";
import React, { useState, useEffect } from 'react';
import { useDebate } from '@/context/DebateContext';
import { Clock } from 'lucide-react';
import '@styles/TimerDisplay.css';

function TimerDisplay() {
  const { state } = useDebate();
  // Get the timer data directly from the main context state
  const { timer, isTimerRunning } = state;

  // This local state is just for the visual countdown effect
  const [displayTime, setDisplayTime] = useState(timer);

  // This effect keeps the local display in sync with the master time from the database
  useEffect(() => {
    setDisplayTime(timer);
  }, [timer]);

  // Hook 2: COUNTDOWN
  // This hook's only job is to handle the 1-second countdown interval.
  useEffect(() => {
    let interval = null;
    // Only start the interval if the timer is running AND there's time left
    if (isTimerRunning && displayTime > 0) {
      interval = setInterval(() => {
        setDisplayTime(prevTime => {
          const newTime = prevTime - 1;
          // Stop at 0, don't go negative
          return newTime < 0 ? 0 : newTime;
        });
      }, 1000);
    }
    // This cleans up the interval when the component re-renders or unmounts
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, displayTime]);

  // Additional effect to handle when timer stops or resets
  useEffect(() => {
    // If timer is not running and displayTime doesn't match timer, sync them
    if (!isTimerRunning && displayTime !== timer) {
      setDisplayTime(timer);
    }
  }, [isTimerRunning, timer, displayTime]);

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "00:00"; // Safeguard for NaN
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="timer-display card">
      <Clock size={24} />
      <h3>Debate Timer</h3>
      <div className="time">{formatTime(displayTime)}</div>
      <div className={`status ${isTimerRunning && displayTime > 0 ? 'running' : 'paused'}`}>
        {isTimerRunning && displayTime > 0 ? 'Running' : 'Paused'}
      </div>
    </div>
  );
}

export default TimerDisplay;