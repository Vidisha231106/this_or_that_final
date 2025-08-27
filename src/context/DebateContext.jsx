"use client";
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { subscribeToTeams, subscribeToGame } from '@/services/debateService';

const DebateContext = createContext();

// Initial state with all properties defined
const initialState = {
  topic: "Waiting for topic...",
  votes: { switch: 0, dontSwitch: 0 },
  speakingFor: 'A',
  teamAStance: 'Pro',
  teamA: [], // Master roster
  teamB: [], // Master roster
  debateStarted: false,
  currentClassroom: null,
  isLoading: true,
  error: null,
  // Support multiple timers for different rooms
  timers: {}, // { [roomId]: { time: 60, isRunning: false } }
  timer: 0, // Deprecated - kept for backward compatibility
  isTimerRunning: false, // Deprecated - kept for backward compatibility
  activePlayers: { teamA: [], teamB: [] },
  activeGameId: null,
};

// All possible actions
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_TEAMS: 'SET_TEAMS',
  SET_CLASSROOM: 'SET_CLASSROOM',
  SET_DEBATE_STARTED: 'SET_DEBATE_STARTED',
  UPDATE_DEBATE_DATA: 'UPDATE_DEBATE_DATA',
  UPDATE_ROOM_TIMER: 'UPDATE_ROOM_TIMER',
  RESET_ROOM_TIMER: 'RESET_ROOM_TIMER',
  RESET_STATE: 'RESET_STATE'
};

// The reducer function to handle state changes
function debateReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case ACTIONS.SET_CLASSROOM:
      return { ...state, currentClassroom: action.payload };
    case ACTIONS.SET_DEBATE_STARTED:
      return { ...state, debateStarted: action.payload };
    case ACTIONS.SET_TEAMS:
      // This is the corrected case that was causing the bug
      return {
        ...state, // Keep the existing state
        teamA: action.payload.teamA || [], // Only update teamA
        teamB: action.payload.teamB || [], // Only update teamB
      };
    case ACTIONS.UPDATE_DEBATE_DATA:
      return { ...state, ...action.payload };
    case ACTIONS.UPDATE_ROOM_TIMER:
      return {
        ...state,
        timers: {
          ...state.timers,
          [action.payload.roomId]: {
            time: action.payload.time,
            isRunning: action.payload.isRunning
          }
        }
      };
    case ACTIONS.RESET_ROOM_TIMER:
      return {
        ...state,
        timers: {
          ...state.timers,
          [action.payload.roomId]: {
            time: action.payload.initialTime || 60,
            isRunning: false
          }
        }
      };
    case ACTIONS.RESET_STATE:
      return { ...initialState, isLoading: false };
    default:
      return state;
  }
}

// The provider component that wraps the app
export function DebateProvider({ children }) {
  const [state, dispatch] = useReducer(debateReducer, initialState);

  // The final, efficient useEffect with nested listeners
  useEffect(() => {
    if (!state.currentClassroom?.id) {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      return;
    }

    let unsubscribeGame = () => {};

    const unsubscribeClassroom = onSnapshot(doc(db, 'classrooms', state.currentClassroom.id), (classroomDoc) => {
      const liveGameId = classroomDoc.data()?.activeGameId;
      unsubscribeGame(); // Unsubscribe from any previous game listener

      if (liveGameId) {
        unsubscribeGame = subscribeToGame(state.currentClassroom.id, liveGameId, (liveGame) => {
          if (liveGame) {
            dispatch({
              type: ACTIONS.UPDATE_DEBATE_DATA,
              payload: {
                activeGameId: liveGame.id,
                topic: liveGame.topic,
                votes: liveGame.votes,
                speakingFor: liveGame.speakingFor,
                teamAStance: liveGame.teamAStance,
                debateStarted: true,
                timer: liveGame.timer,
                isTimerRunning: liveGame.isTimerRunning,
                activePlayers: {
                  teamA: liveGame.teamAPlayers,
                  teamB: liveGame.teamBPlayers,
                }
              }
            });
          }
        });
      } else {
        dispatch({ type: ACTIONS.SET_DEBATE_STARTED, payload: false });
      }
    });

    const unsubscribeTeams = subscribeToTeams(state.currentClassroom.id, (teamsData) => {
      if (teamsData) {
        dispatch({ type: ACTIONS.SET_TEAMS, payload: teamsData });
      }
    });

    return () => {
      unsubscribeClassroom();
      unsubscribeGame();
      unsubscribeTeams();
    };
  }, [state.currentClassroom?.id]);

  const actions = {
    setLoading: (loading) => dispatch({ type: ACTIONS.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ACTIONS.SET_ERROR, payload: error }),
    setClassroom: (classroom) => dispatch({ type: ACTIONS.SET_CLASSROOM, payload: classroom }),
    setTeams: (teams) => dispatch({ type: ACTIONS.SET_TEAMS, payload: teams }),
    updateRoomTimer: (roomId, time, isRunning) => dispatch({ 
      type: ACTIONS.UPDATE_ROOM_TIMER, 
      payload: { roomId, time, isRunning } 
    }),
    resetRoomTimer: (roomId, initialTime = 60) => dispatch({ 
      type: ACTIONS.RESET_ROOM_TIMER, 
      payload: { roomId, initialTime } 
    }),
    resetState: () => dispatch({ type: ACTIONS.RESET_STATE })
  };

  const value = { state, actions };

  return (
    <DebateContext.Provider value={value}>
      {children}
    </DebateContext.Provider>
  );
}

// The custom hook to access the context
export function useDebate() {
  const context = useContext(DebateContext);
  if (!context) {
    throw new Error('useDebate must be used within a DebateProvider');
  }
  return context;
}