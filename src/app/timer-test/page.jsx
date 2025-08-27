import React from 'react';
import MultiBreakroomTimers from '../components/spectator/MultiBreakroomTimers';
import { DebateProvider } from '../context/DebateContext';

export default function TimerTestPage() {
  const breakrooms = ['BR-101', 'BR-102', 'BR-103', 'BR-201', 'BR-202'];

  return (
    <DebateProvider>
      <div style={{ padding: '20px' }}>
        <h1>Multi-Breakroom Timer System Test</h1>
        <p>This page demonstrates parallel timers for different breakrooms.</p>
        <MultiBreakroomTimers breakrooms={breakrooms} />
      </div>
    </DebateProvider>
  );
}
