# Task 2: Voice Button Component

## Overview

Create the VoiceButton component that serves as the entry point for voice input functionality. This button will be integrated into the QuickAddScreen and handle the initial user interaction for voice recording.

## Tasks

- [ ] Create VoiceButton.tsx component with microphone icon
- [ ] Implement basic press-to-record functionality
- [ ] Add loading states and basic animations
- [ ] Style voice button to match app theme
- [ ] Integrate button into QuickAddScreen layout

## Acceptance Criteria

### Component Functionality

- Voice button renders with microphone icon (🎤)
- Button supports both tap-to-record and press-and-hold modes
- Loading states during recording and processing
- Disabled state when permissions not granted
- Proper error handling for permission issues

### Visual Design

- Follows app theme system (light/dark mode)
- Floating action button style below amount input
- Subtle pulse animation when active
- Clear visual feedback for different states
- Accessible design with proper touch targets

### States Management

- Default state (ready to record)
- Recording state (active recording)
- Processing state (speech-to-text conversion)
- Success state (processing complete)
- Error state (permissions/recording failed)

## Priority

High

## Process

0%

## Estimated Time

6-8 hours

## Dependencies

- Task 1: Project Setup & Dependencies completed
- Access to app theme system
- QuickAddScreen component exists

## Libraries to Install

- None (uses existing dependencies from Task 1)

## Implementation Details

### 1) Component Structure & Props

- **VoiceButton Interface**:
  ```typescript
  interface VoiceButtonProps {
    onVoiceRecordingStart: () => void;
    onVoiceRecordingComplete: (result: string) => void;
    onError: (error: string) => void;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
  }

  interface VoiceButtonState {
    isRecording: boolean;
    isProcessing: boolean;
    hasPermission: boolean;
    recordingError?: string;
  }
  ```

### 2) Visual Design Implementation

- **Button Styling**:
  - Circular floating action button design
  - 56dp diameter following Material Design
  - Microphone icon centered
  - Theme-aware colors and shadows
  - Smooth transitions between states

- **Animation System**:
  - Subtle pulse animation when ready
  - Expand/contract animation on press
  - Rotation animation during processing
  - Color transitions for state changes

### 3) State Management Integration

- **Permission Handling**:
  - Check microphone permissions on mount
  - Request permissions when needed
  - Handle permission denial gracefully
  - Show appropriate error states

- **Recording States**:
  - Idle → Ready → Recording → Processing → Complete/Error
  - Visual feedback for each state transition
  - Proper cleanup on component unmount

## Development Workflow

### Before Starting
1. Create feature branch: `git checkout -b feat/voice-button-component`
2. Start development work

### When Complete
1. Commit changes with descriptive messages
2. Push branch to remote repository
3. Create PR targeting `dev` branch
4. Add comprehensive PR description

## Implementation Steps

### Phase 1: Basic Component Structure

1. **Create VoiceButton Component**:
   ```typescript
   // Basic component structure with TypeScript
   export const VoiceButton: React.FC<VoiceButtonProps> = ({
     onVoiceRecordingStart,
     onVoiceRecordingComplete,
     onError,
     disabled = false,
     style
   }) => {
     // Component implementation
   }
   ```

2. **Add State Management**:
   - useState hooks for recording state
   - useEffect for permission checking
   - Custom hooks for voice recording logic

3. **Implement Basic Rendering**:
   - Themed button with microphone icon
   - Conditional rendering based on state
   - Accessibility props and labels

### Phase 2: Styling & Animation

4. **Apply Theme System**:
   ```typescript
   const $button: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
     width: 56,
     height: 56,
     borderRadius: 28,
     backgroundColor: colors.tint,
     alignItems: 'center',
     justifyContent: 'center',
     marginTop: spacing.md,
   })
   ```

5. **Add Animations**:
   - Pulse animation using Animated.loop
   - Press feedback with scale transform
   - State transition animations
   - Proper animation cleanup

6. **Implement State Visual Feedback**:
   - Different colors for each state
   - Icon changes (microphone, loading, checkmark, error)
   - Loading spinner integration
   - Error state styling

### Phase 3: Integration & Functionality

7. **Permission Integration**:
   - Check microphone permissions
   - Request permissions flow
   - Handle permission responses
   - Show permission denied state

8. **QuickAddScreen Integration**:
   - Add button to screen layout
   - Position below amount input field
   - Handle screen state interactions
   - Integrate with existing form logic

9. **Event Handling**:
   - Press handlers for different interactions
   - Callback function implementation
   - Error handling and reporting
   - State cleanup and reset

## Manual Testing Checklist

### Visual Appearance
- [ ] Button renders correctly in light/dark themes
- [ ] Proper sizing and positioning on screen
- [ ] Icons display correctly for all states
- [ ] Animations smooth and performant
- [ ] Touch feedback works properly

### Functionality
- [ ] Permission request triggers on first use
- [ ] Button disabled when permissions denied
- [ ] State changes reflected visually
- [ ] Callbacks fire at appropriate times
- [ ] Error states handle edge cases

### Integration
- [ ] Works properly within QuickAddScreen
- [ ] Doesn't interfere with other form elements
- [ ] Maintains proper layout on different screen sizes
- [ ] Accessibility features work correctly
- [ ] Theme changes apply properly

### States Testing
- [ ] Default state: ready and responsive
- [ ] Recording state: visual feedback active
- [ ] Processing state: loading indication
- [ ] Success state: completion feedback
- [ ] Error state: clear error indication

## Acceptance Criteria for Task

- VoiceButton component fully implemented and styled
- All recording states properly handled and visualized
- Smooth animations and theme integration
- Successfully integrated into QuickAddScreen
- Permission handling works correctly
- Component ready for voice recording functionality