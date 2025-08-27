    # Multi-Room Timer System

This implementation supports parallel timers for different rooms in your debate application.

## How It Works

### 1. Context-Based Timer Management

- The `DebateContext` now supports multiple timers stored in a `timers` object
- Each room has its own timer state: `{ time: number, isRunning: boolean }`
- Backward compatibility is maintained with the original `timer` and `isTimerRunning` properties

### 2. Room-Specific Timer Storage

```javascript
// Timer state structure
state.timers = {
  A101: { time: 300, isRunning: true },
  A102: { time: 180, isRunning: false },
  B201: { time: 60, isRunning: true },
};
```

### 3. TimerDisplay Component

The `TimerDisplay` component now accepts:

- `roomId`: Unique identifier for the room (default: 'default')
- `initialTime`: Initial timer value in seconds (default: 60)

## Usage Examples

### Basic Usage

```jsx
import TimerDisplay from "./components/spectator/TimerDisplay";

// Single room timer
<TimerDisplay roomId="A101" initialTime={300} />;
```

### Multiple Room Timers

```jsx
import MultiRoomTimers from "./components/spectator/MultiRoomTimers";

// Display timers for multiple rooms
<MultiRoomTimers rooms={["A101", "A102", "A103"]} />;
```

### Manual Timer Control

```jsx
import { useDebate } from "./context/DebateContext";

function TimerControls({ roomId }) {
  const { state, actions } = useDebate();

  const startTimer = () => {
    actions.updateRoomTimer(roomId, 300, true);
  };

  const pauseTimer = () => {
    const currentTime = state.timers[roomId]?.time || 0;
    actions.updateRoomTimer(roomId, currentTime, false);
  };

  const resetTimer = () => {
    actions.resetRoomTimer(roomId, 300);
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

- `updateRoomTimer(roomId, time, isRunning)`: Update a room's timer
- `resetRoomTimer(roomId, initialTime)`: Reset a room's timer to initial value

### Service Functions

- `updateRoomTimer(classroomId, roomId, newTime, isRunning)`: Update timer in Firebase
- `subscribeToRoomTimer(classroomId, roomId, callback)`: Subscribe to timer updates

## Features

### Automatic Timer Countdown

- Each timer counts down independently
- Timers automatically stop when reaching zero
- State updates are synchronized across components

### Persistent Storage

- Timer states can be synchronized with Firebase
- Room timers persist across page refreshes
- Multiple users can see synchronized timer states

### Flexible Room Management

- Supports any number of parallel rooms
- Room IDs can be any string (e.g., 'A101', 'Room1', 'DebateRoom_5')
- Easy to add/remove rooms dynamically

## Testing

Visit `/timer-test` to see the multi-room timer system in action with 5 parallel room timers.

## Backward Compatibility

The original single-timer functionality still works:

- Existing code using `state.timer` and `state.isTimerRunning` continues to work
- TimerDisplay without `roomId` prop defaults to 'default' room
- Existing timer update functions remain functional
