import React, { useState, useEffect } from "react";
import { useDebate } from "../../context/DebateContext";
import { Clock } from "lucide-react";
import "./TimerDisplay.css";

function TimerDisplay({ breakroomId = "default", initialTime = 60 }) {
  const { state, actions } = useDebate();

  // Get breakroom-specific timer or use backward compatibility
  const breakroomTimer = state.timers[breakroomId] || {
    time: state.timer || initialTime,
    isRunning: state.isTimerRunning || false,
  };
  const { time: timer, isRunning: isTimerRunning } = breakroomTimer;

  const [displayTime, setDisplayTime] = useState(timer);

  // Initialize breakroom timer if it doesn't exist
  useEffect(() => {
    if (!state.timers[breakroomId]) {
      actions.resetBreakroomTimer(breakroomId, initialTime);
    }
  }, [breakroomId, initialTime, state.timers, actions]);

  useEffect(() => {
    setDisplayTime(timer);
  }, [timer, isTimerRunning, breakroomId]);

  useEffect(() => {
    let interval = null;

    if (isTimerRunning && displayTime > 0) {
      interval = setInterval(() => {
        setDisplayTime((prevTime) => {
          const newTime = prevTime - 1;
          // Update the breakroom-specific timer in the global state
          actions.updateBreakroomTimer(breakroomId, newTime, newTime > 0);
          return newTime;
        });
      }, 1000);
    } else if (!isTimerRunning || displayTime === 0) {
      clearInterval(interval);
      if (displayTime === 0) {
        // Timer reached zero, stop it
        actions.updateBreakroomTimer(breakroomId, 0, false);
      }
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, displayTime, breakroomId, actions]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div className="timer-display card">
      <Clock size={24} />
      <h3>Debate Timer - Breakroom {breakroomId}</h3>
      <div className="time">{formatTime(displayTime)}</div>
      <div
        className={`status ${
          isTimerRunning && displayTime > 0 ? "running" : "paused"
        }`}
      >
        {isTimerRunning && displayTime > 0 ? "Running" : "Paused"}
      </div>
    </div>
  );
}

export default TimerDisplay;
