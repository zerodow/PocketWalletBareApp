# Task 1: Project Setup & Dependencies

## Overview

Set up the foundational dependencies and project structure required for voice input functionality. This includes adding React Native voice libraries, configuring Expo development build, and creating the basic component structure.

## Tasks

- [ ] Add react-native-voice, expo-av, and expo-permissions dependencies
- [ ] Configure Expo development build for voice capabilities
- [ ] Create basic project structure for voice components
- [ ] Set up placeholder components and utilities
- [ ] Test dependency installation and basic permissions

## Acceptance Criteria

### Dependencies Installation

- `react-native-voice ^3.2.4` installed and configured
- `expo-av ~14.2.0` installed for audio handling
- `expo-permissions ~15.1.0` installed for permission management
- All dependencies resolve without conflicts
- Expo development build configured (not Expo Go compatible)

### Project Structure

- `/app/components/voice/` directory created
- Basic placeholder components created:
  - `VoiceButton.tsx`
  - `VoiceInputModal.tsx`
  - `TransactionPreview.tsx`
- `/app/utils/voice/` directory created for utilities:
  - `speechParser.ts`
  - `voicePermissions.ts`
- TypeScript types defined for voice functionality

### Basic Configuration

- Voice recording permissions configured in app.json/expo.json
- Android/iOS specific voice configurations added
- Development build works with voice dependencies
- Basic permission requests functional

## Priority

High

## Process

0%

## Estimated Time

4-6 hours

## Dependencies

- Existing project setup and Expo configuration
- Access to development build environment

## Libraries to Install

- `react-native-voice@^3.2.4` (cross-platform speech-to-text)
- `expo-av@~14.2.0` (audio recording and playback)
- `expo-permissions@~15.1.0` (permission handling)

## Implementation Details

### 1) Dependency Installation & Configuration

- **Package Installation**:
  - Install react-native-voice for speech recognition
  - Install expo-av for audio recording capabilities
  - Install expo-permissions for microphone access
  - Verify no version conflicts with existing dependencies

- **Expo Configuration**:
  - Update app.json/expo.json with microphone permissions
  - Configure development build requirements
  - Add necessary Android/iOS specific permissions
  - Test build compatibility with new dependencies

### 2) Project Structure Setup

- **Component Directory Structure**:
  ```
  /app/components/voice/
    ├── VoiceButton.tsx (placeholder)
    ├── VoiceInputModal.tsx (placeholder)
    └── TransactionPreview.tsx (placeholder)
  ```

- **Utility Directory Structure**:
  ```
  /app/utils/voice/
    ├── speechParser.ts (placeholder)
    ├── voicePermissions.ts (placeholder)
    └── types.ts (TypeScript definitions)
  ```

### 3) TypeScript Types Definition

- **Voice Result Types**:
  ```typescript
  interface VoiceParseResult {
    amount?: string;
    type?: 'income' | 'expense';
    categoryHints?: string[];
    description?: string;
    date?: string;
    confidence: number;
  }

  interface VoiceRecordingState {
    isRecording: boolean;
    isProcessing: boolean;
    hasPermission: boolean;
    error?: string;
  }
  ```

## Development Workflow

### Before Starting
1. Create a new feature branch: `git checkout -b feat/voice-input-setup`
2. Start development work

### When Complete
1. Commit all changes with descriptive messages
2. Push branch to remote repository
3. Create PR using GitHub MCP: Use `mcp__github__create_pull_request` to create PR targeting `dev` branch
4. Add comprehensive PR description with setup details

## Implementation Steps

### Phase 1: Dependencies & Configuration

1. **Install Voice Dependencies**:
   ```bash
   yarn add react-native-voice@^3.2.4
   yarn add expo-av@~14.2.0
   yarn add expo-permissions@~15.1.0
   ```

2. **Configure Expo for Voice**:
   - Update app.json with microphone permissions
   - Add development build configuration
   - Configure Android/iOS specific settings

3. **Verify Installation**:
   - Test development build compilation
   - Verify no dependency conflicts
   - Test basic import statements

### Phase 2: Project Structure

4. **Create Component Placeholders**:
   - Basic VoiceButton component with props interface
   - Basic VoiceInputModal component structure
   - Basic TransactionPreview component structure

5. **Create Utility Placeholders**:
   - speechParser.ts with function signatures
   - voicePermissions.ts with permission handling
   - types.ts with comprehensive TypeScript definitions

6. **Integration Setup**:
   - Import components in appropriate screens
   - Set up basic component props and state
   - Verify component mounting and rendering

### Phase 3: Basic Permission Testing

7. **Permission Handling**:
   - Implement basic microphone permission requests
   - Test permission flow on device
   - Add permission status checking

8. **Initial Testing**:
   - Test development build on physical device
   - Verify voice dependencies load correctly
   - Test basic permission prompts

## Manual Testing Checklist

### Installation Verification
- [ ] All dependencies install without errors
- [ ] Development build compiles successfully
- [ ] No TypeScript compilation errors
- [ ] App launches on development device

### Permission Testing
- [ ] Microphone permission prompt appears
- [ ] Permission grant/deny handled correctly
- [ ] Permission status can be checked
- [ ] Settings app integration works

### Component Structure
- [ ] All placeholder components render without errors
- [ ] Component imports work correctly
- [ ] TypeScript types are properly defined
- [ ] File structure follows project conventions

## Acceptance Criteria for Task

- All voice dependencies installed and configured
- Expo development build works with voice capabilities
- Basic component structure created and rendering
- Permission handling implemented and tested
- No build errors or TypeScript issues
- Ready for voice recording implementation