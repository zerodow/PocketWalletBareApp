# Task 5: Speech-to-Text Integration

## Overview

Integrate speech-to-text functionality to convert recorded audio into text. This task focuses on connecting to speech recognition APIs (Google/Apple) and handling the conversion process with proper error handling and loading states.

## Tasks

- [ ] Integrate speech-to-text API (Google/Apple)
- [ ] Convert recorded audio to text
- [ ] Handle API responses and errors
- [ ] Add loading states during processing
- [ ] Basic text output display and validation

## Acceptance Criteria

### Speech Recognition Integration

- Successfully connects to platform speech recognition APIs
- Converts audio to text with reasonable accuracy
- Handles various audio qualities and environments
- Supports Vietnamese language recognition
- Processes audio within reasonable time limits

### API Response Handling

- Parses speech recognition results correctly
- Handles partial results and confidence scores
- Manages API errors and network issues
- Implements retry logic for failed requests
- Validates text output quality

### User Experience

- Shows loading states during processing
- Provides progress feedback to user
- Handles processing timeouts gracefully
- Displays results clearly and readably
- Allows user to see converted text before proceeding

## Priority

High

## Process

0%

## Estimated Time

6-8 hours

## Dependencies

- Task 1: Project Setup & Dependencies completed
- Task 4: Audio Recording Implementation completed
- Internet connectivity for speech recognition APIs

## Libraries to Install

- None (uses react-native-voice from Task 1)

## Implementation Details

### 1) Speech-to-Text Service Interface

- **SpeechToTextService**:
  ```typescript
  interface SpeechToTextService {
    convertAudioToText(audioData: string): Promise<SpeechResult>;
    setLanguage(locale: string): void;
    isAvailable(): Promise<boolean>;
    getSupportedLanguages(): Promise<string[]>;
  }

  interface SpeechResult {
    transcript: string;
    confidence: number;
    alternatives?: Array<{
      transcript: string;
      confidence: number;
    }>;
    isFinal: boolean;
    error?: string;
  }
  ```

### 2) Language Configuration

- **Supported Languages**:
  - Vietnamese (vi-VN) - primary
  - English (en-US) - fallback
  - Auto-detection capability
  - Language switching mechanism

- **Recognition Options**:
  ```typescript
  const recognitionOptions = {
    language: 'vi-VN',
    partialResults: true,
    timeout: 30000,
    maxResults: 1,
    showPopup: false,
  };
  ```

### 3) Processing State Management

- **Processing States**:
  - Starting recognition
  - Listening for speech
  - Processing audio
  - Results ready
  - Processing failed

## Development Workflow

### Before Starting
1. Create feature branch: `git checkout -b feat/speech-to-text-integration`
2. Start development work

### When Complete
1. Commit changes with descriptive messages
2. Push branch to remote repository
3. Create PR targeting `dev` branch
4. Add comprehensive PR description

## Implementation Steps

### Phase 1: Speech Service Implementation

1. **Create SpeechToTextService**:
   ```typescript
   import Voice from '@react-native-voice/voice';

   export class SpeechToTextService {
     private currentLanguage = 'vi-VN';
     private isProcessing = false;
     private listeners: Array<(result: SpeechResult) => void> = [];

     async convertAudioToText(): Promise<SpeechResult> {
       // Implementation using react-native-voice
     }
   }
   ```

2. **Configure Voice Recognition**:
   - Set up Vietnamese language recognition
   - Configure recognition parameters
   - Set up partial results handling
   - Configure timeout and error handling

3. **Implement Conversion Logic**:
   - Start speech recognition session
   - Handle real-time speech events
   - Process final recognition results
   - Format and validate output text

### Phase 2: API Integration & Error Handling

4. **Result Processing**:
   ```typescript
   private processRecognitionResults(results: string[]): SpeechResult {
     const primaryResult = results[0] || '';
     const confidence = this.calculateConfidence(results);

     return {
       transcript: primaryResult,
       confidence,
       alternatives: results.slice(1).map(r => ({
         transcript: r,
         confidence: confidence * 0.8
       })),
       isFinal: true,
     };
   }
   ```

5. **Error Handling**:
   - Network connectivity issues
   - API rate limiting
   - Audio quality problems
   - Language recognition failures
   - Timeout handling

6. **Retry Logic**:
   - Automatic retry for network failures
   - Progressive backoff for repeated failures
   - Maximum retry attempts
   - User notification for persistent failures

### Phase 3: UI Integration

7. **Processing State Integration**:
   ```typescript
   const [processingState, setProcessingState] = useState<ProcessingState>('idle');
   const [speechResult, setSpeechResult] = useState<SpeechResult | null>(null);

   const handleSpeechProcessing = async () => {
     setProcessingState('processing');
     try {
       const result = await speechService.convertAudioToText();
       setSpeechResult(result);
       setProcessingState('completed');
     } catch (error) {
       setProcessingState('error');
       // Handle error
     }
   };
   ```

8. **Modal Integration**:
   - Add processing state to VoiceInputModal
   - Show loading spinner during processing
   - Display converted text results
   - Handle processing errors with user messaging

9. **Result Display**:
   - Show converted text clearly
   - Display confidence score if low
   - Provide option to retry if processing fails
   - Allow user to edit text before proceeding

### Phase 4: Vietnamese Language Support

10. **Vietnamese Optimization**:
    - Configure Vietnamese language settings
    - Handle Vietnamese-specific recognition challenges
    - Test with various Vietnamese accents
    - Optimize for common Vietnamese phrases

11. **Language Detection**:
    - Auto-detect language if possible
    - Fallback to English for mixed language input
    - Handle code-switching between Vietnamese/English
    - Provide language switching option

12. **Text Validation**:
    - Basic text quality checks
    - Minimum confidence thresholds
    - Empty result handling
    - Gibberish detection and filtering

## Manual Testing Checklist

### Basic Speech Recognition
- [ ] Clear speech converted accurately
- [ ] Vietnamese language recognition works
- [ ] English fallback works when needed
- [ ] Processing completes within reasonable time
- [ ] Results displayed clearly to user

### Error Scenarios
- [ ] Network connectivity issues handled
- [ ] API failures handled gracefully
- [ ] Audio quality issues managed
- [ ] Processing timeouts handled
- [ ] Retry mechanisms work correctly

### Language Support
- [ ] Vietnamese speech recognized accurately
- [ ] Different Vietnamese accents handled
- [ ] Mixed language input processed
- [ ] Special Vietnamese characters preserved
- [ ] Numbers and currency terms recognized

### Integration Testing
- [ ] Recording → Processing → Results flow works
- [ ] Modal shows processing states correctly
- [ ] Error states communicated clearly
- [ ] User can retry failed processing
- [ ] Results ready for next processing step

### Performance Testing
- [ ] Processing completes within 10 seconds typical
- [ ] Memory usage reasonable during processing
- [ ] Battery impact minimal
- [ ] App remains responsive during processing
- [ ] Background processing handled correctly

## Acceptance Criteria for Task

- Speech-to-text conversion functional and accurate
- Vietnamese language support working properly
- Error handling robust and user-friendly
- Processing states clearly communicated to user
- Integration with recording components complete
- Ready for text parsing and transaction extraction