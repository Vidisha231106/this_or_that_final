import React from 'react';
import MultiRoomTimers from '../components/spectator/MultiRoomTimers';
import { DebateProvider } from '../context/DebateContext';

export default function TimerTestPage() {
  const rooms = ['A101', 'A102', 'A103', 'B201', 'B202'];

  return (
    <DebateProvider>
      <div style={{ padding: '20px' }}>
        <h1>Multi-Room Timer System Test</h1>
        <p>This page demonstrates parallel timers for different rooms.</p>
        <MultiRoomTimers rooms={rooms} />
      </div>
    </DebateProvider>
  );
}
