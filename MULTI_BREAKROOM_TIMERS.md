# Multi-Breakroom Timer System

This implementation supports parallel timers for different breakrooms in your debate application.

## How It Works

### 1. Context-Based Timer Management

- The `DebateContext` now supports multiple timers stored in a `timers` object
- Each breakroom has its own timer state: `{ time: number, isRunning: boolean }`
- Backward compatibility is maintained with the original `timer` and `isTimerRunning` properties

### 2. Breakroom-Specific Timer Storage

```javascript
// Timer state structure
state.timers = {
  'BR-101': { time: 300, isRunning: true },
  'BR-102': { time: 180, isRunning: false },
  'BR-201': { time: 60, isRunning: true },
};
```

### 3. TimerDisplay Component

The `TimerDisplay` component now accepts:

- `breakroomId`: Unique identifier for the breakroom (default: 'default')
- `initialTime`: Initial timer value in seconds (default: 60)

## Usage Examples

### Basic Usage

```jsx
import TimerDisplay from "./components/spectator/TimerDisplay";

// Single breakroom timer
<TimerDisplay breakroomId="BR-101" initialTime={300} />;
```

### Multiple Breakroom Timers

```jsx
import MultiBreakroomTimers from "./components/spectator/MultiBreakroomTimers";

// Display timers for multiple breakrooms
<MultiBreakroomTimers breakrooms={["BR-101", "BR-102", "BR-103"]} />;
```

### Manual Timer Control

```jsx
import { useDebate } from "./context/DebateContext";

function TimerControls({ breakroomId }) {
  const { state, actions } = useDebate();

  const startTimer = () => {
    actions.updateBreakroomTimer(breakroomId, 300, true);
  };

  const pauseTimer = () => {
    const currentTime = state.timers[breakroomId]?.time || 0;
    actions.updateBreakroomTimer(breakroomId, currentTime, false);
  };

  const resetTimer = () => {
    actions.resetBreakroomTimer(breakroomId, 300);
  };

  return (
    <div>
      <button onClick={startTimer}>Start</button>
      <button onClick={pauseTimer}>Pause</button>
      <button onClick={resetTimer}>Reset</button>
    </div>
  );
}
```

## Available Actions

### Context Actions

- `updateBreakroomTimer(breakroomId, time, isRunning)`: Update a breakroom's timer
- `resetBreakroomTimer(breakroomId, initialTime)`: Reset a breakroom's timer to initial value

### Service Functions

- `updateBreakroomTimer(classroomId, breakroomId, newTime, isRunning)`: Update timer in Firebase
- `subscribeToBreakroomTimer(classroomId, breakroomId, callback)`: Subscribe to timer updates

## Features

### Automatic Timer Countdown

- Each timer counts down independently
- Timers automatically stop when reaching zero
- State updates are synchronized across components

### Persistent Storage

- Timer states can be synchronized with Firebase
- Breakroom timers persist across page refreshes
- Multiple users can see synchronized timer states

### Flexible Breakroom Management

- Supports any number of parallel breakrooms
- Breakroom IDs can be any string (e.g., 'BR-101', 'Breakroom1', 'DebateBreakroom_5')
- Easy to add/remove breakrooms dynamically

## Testing

Visit `/timer-test` to see the multi-breakroom timer system in action with 5 parallel breakroom timers.

## Backward Compatibility

The original single-timer functionality still works:

- Existing code using `state.timer` and `state.isTimerRunning` continues to work
- TimerDisplay without `breakroomId` prop defaults to 'default' breakroom
- Existing timer update functions remain functional
