# Task: Voice Input for Transactions

**Task ID:** Post-MVP-Epic1-Voice
**Priority:** High
**Status:** Pending
**Estimated Effort:** 2-3 days

---

## 📋 Overview

Implement voice input functionality that allows users to record audio and automatically populate transaction data using speech-to-text and intelligent parsing.

## 🎯 Goals

- **Primary**: Reduce transaction entry time from ≤10s to ≤5s using voice input
- **Secondary**: Support Vietnamese language voice commands
- **Tertiary**: Maintain offline-first approach with graceful fallbacks

## 📝 User Stories

### Story 1: Basic Voice Recording
**As a** user
**I want to** tap a voice button and speak my transaction
**So that** I can quickly add transactions without manual typing

**Acceptance Criteria:**
- [ ] Voice button is prominently displayed on QuickAddScreen
- [ ] Tapping button opens voice recording modal
- [ ] Recording shows visual feedback (waveform/amplitude)
- [ ] Stop recording automatically processes audio

### Story 2: Speech-to-Text Processing
**As a** user
**I want to** speak "spent 50 nghìn for lunch at restaurant yesterday"
**So that** the app fills amount=50000, type=expense, category=food, note="lunch at restaurant", date=yesterday

**Acceptance Criteria:**
- [ ] Converts Vietnamese speech to text accurately
- [ ] Parses amount from speech (supports "nghìn", "triệu" currency units)
- [ ] Detects transaction type from keywords ("spent", "received", "bought", "added")
- [ ] Extracts category hints from keywords
- [ ] Parses optional date/time expressions ("yesterday", "this morning")
- [ ] Populates transaction form fields automatically

### Story 3: Smart Parsing & Validation
**As a** user
**I want to** review and edit voice-parsed data before saving
**So that** I can correct any errors from speech recognition

**Acceptance Criteria:**
- [ ] Shows parsed data in preview before applying
- [ ] Allows editing of all auto-filled fields
- [ ] Highlights confidence levels for parsed data
- [ ] Graceful fallback when parsing fails

---

## 🛠 Technical Implementation

### Architecture Overview

**Backend-Powered Speech-to-Text Solution:**
- Frontend: Audio recording only
- Backend: Processes audio via Google Cloud Speech-to-Text API
- Flow: Record → Upload to BE → BE calls Google → Return transcript → Parse & fill form

### Frontend Dependencies Required
```json
{
  "react-native-audio-recorder-player": "^3.6.0",
  "axios": "^1.6.0",
  "react-native-fs": "^2.20.0"
}
```

### Backend Dependencies Required
```json
{
  "@google-cloud/speech": "^6.0.0",
  "multer": "^1.4.5-lts.1",
  "express": "^4.18.0"
}
```

**Note:**
- Requires internet connectivity for STT processing
- Google Cloud Speech-to-Text API credentials required
- Audio files temporarily uploaded to backend, not stored after processing

### API Specification

#### Backend Endpoint: POST /api/v1/speech-to-text

**Request:**
```typescript
Content-Type: multipart/form-data

{
  audio: File,        // Audio file (.m4a, .wav, .mp3, .aac)
  language: string    // 'vi-VN' for Vietnamese
}
```

**Response:**
```typescript
{
  success: boolean,
  data?: {
    transcript: string,      // Transcribed text
    confidence: number,      // 0-1 confidence score
    language: string         // Detected/used language
  },
  error?: {
    code: string,
    message: string
  }
}
```

**Error Codes:**
- `AUDIO_TOO_LARGE`: File exceeds 10MB limit
- `INVALID_FORMAT`: Unsupported audio format
- `TRANSCRIPTION_FAILED`: Google API error
- `RATE_LIMIT_EXCEEDED`: Too many requests

### Frontend Components to Create

#### 1. VoiceInputModal.tsx
- Audio recording interface with visual feedback
- Start/stop recording controls
- Upload progress indicator
- Processing status (uploading → transcribing → parsing)
- Error handling display

#### 2. VoiceButton.tsx
- Floating action button with microphone icon
- Tap-to-record mode
- Loading states for upload/processing
- Permissions handling (microphone access)
- Network connectivity check

#### 3. TransactionPreview.tsx
- Display parsed transaction data from transcript
- Edit capabilities for each field
- Confidence indicators per field
- Apply/Cancel actions

### Utility Functions

#### speechParser.ts
```typescript
interface VoiceParseResult {
  amount?: string;
  type?: 'income' | 'expense';
  categoryHints?: string[];
  description?: string;
  date?: string;
  confidence: number;
}

function parseVietnameseTransaction(text: string): VoiceParseResult
function extractAmount(text: string): { amount: string; confidence: number }
function extractAmountWithCurrency(text: string): { amount: string; confidence: number } // Supports "nghìn", "triệu"
function extractTransactionType(text: string): 'income' | 'expense' | null // Keywords: "received", "added", "spent", "bought"
function extractCategoryHints(text: string): string[]
function extractDescription(text: string): string
function extractDateTime(text: string): string | null // Supports "yesterday", "this morning", etc.
```

### Frontend Service Layer

#### voiceService.ts
```typescript
interface VoiceRecordingResult {
  filePath: string;
  duration: number;
  size: number;
}

interface TranscriptResponse {
  transcript: string;
  confidence: number;
  language: string;
}

async function startRecording(): Promise<void>
async function stopRecording(): Promise<VoiceRecordingResult>
async function uploadAndTranscribe(filePath: string, language: string): Promise<TranscriptResponse>
async function deleteAudioFile(filePath: string): Promise<void>
```

### Backend Implementation

#### Route: /api/v1/speech-to-text

**File:** `backend/src/routes/speechRoutes.ts`
```typescript
import express from 'express';
import multer from 'multer';
import { speechToTextController } from '../controllers/speechController';

const router = express.Router();
const upload = multer({
  dest: 'uploads/audio/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/m4a', 'audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/aac'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid audio format'));
    }
  }
});

router.post('/speech-to-text', upload.single('audio'), speechToTextController);
```

#### Controller: speechController.ts
```typescript
import speech from '@google-cloud/speech';
import fs from 'fs/promises';

const client = new speech.SpeechClient();

export async function speechToTextController(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'NO_AUDIO_FILE', message: 'No audio file provided' }
      });
    }

    const { language = 'vi-VN' } = req.body;
    const audioFilePath = req.file.path;

    // Read audio file
    const audioBytes = await fs.readFile(audioFilePath);

    // Configure Google Speech-to-Text request
    const audio = { content: audioBytes.toString('base64') };
    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: language,
      enableAutomaticPunctuation: true,
    };

    const request = { audio, config };

    // Call Google Speech-to-Text API
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0])
      .filter(alt => alt.confidence > 0.5)
      .map(alt => alt.transcript)
      .join(' ');

    const confidence = response.results[0]?.alternatives[0]?.confidence || 0;

    // Delete audio file after processing
    await fs.unlink(audioFilePath);

    return res.json({
      success: true,
      data: {
        transcript: transcription,
        confidence,
        language
      }
    });
  } catch (error) {
    console.error('Speech-to-text error:', error);

    // Cleanup audio file on error
    if (req.file?.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }

    return res.status(500).json({
      success: false,
      error: {
        code: 'TRANSCRIPTION_FAILED',
        message: error.message
      }
    });
  }
}
```

### Store Updates

#### transactionDraftStore.ts
```typescript
// Add bulk update method
setBulkFields: (fields: Partial<TransactionDraft>) => void
setFromVoiceInput: (voiceData: VoiceParseResult) => void
```

### Cost Analysis

**Google Cloud Speech-to-Text Pricing:**
- Free tier: 60 minutes/month
- Standard pricing: $0.006 per 15 seconds (~$0.024/minute)
- Enhanced models: $0.009 per 15 seconds (~$0.036/minute)

**Usage Estimates:**
- Average transaction voice input: 5-10 seconds
- 1000 voice transactions/month ≈ 83-167 minutes
- Monthly cost (after free tier): $2-4/month for standard model

**Cost Optimization:**
- Use standard model (sufficient for transaction data)
- Implement client-side validation to avoid unnecessary API calls
- Cache common phrases/patterns
- Set reasonable audio duration limits (max 30 seconds)

---

## 🎨 UI/UX Design

### Voice Button Design
- **Position**: Floating action button below amount input
- **Icon**: 🎤 microphone with subtle pulse animation
- **States**: Default, Recording, Processing, Success, Error
- **Accessibility**: VoiceOver support with audio feedback

### Recording Modal Design
- **Layout**: Full-screen overlay with dark background
- **Visual**: Large waveform or circular pulse animation
- **Controls**: Large stop button, cancel button
- **Feedback**: Real-time audio level visualization

### Parsing Results Design
- **Layout**: Card-based preview of extracted data
- **Fields**: Amount, Category, Description with edit icons
- **Confidence**: Color-coded confidence indicators
- **Actions**: Apply, Edit, Cancel buttons

---

## 🧪 Testing Strategy

### Unit Tests
- [ ] Speech-to-text conversion accuracy
- [ ] Amount parsing with various formats
- [ ] Category hint extraction
- [ ] Vietnamese language support

### Component Tests
- [ ] VoiceInputModal rendering and interactions
- [ ] Voice button states and permissions
- [ ] Transaction preview editing capabilities

### Integration Tests
- [ ] End-to-end voice recording flow
- [ ] Form auto-population from voice input
- [ ] Error handling and fallbacks

### Manual Testing
- [ ] Test with various Vietnamese accents
- [ ] Background noise handling
- [ ] Permission denied scenarios
- [ ] Offline functionality

---

## 📊 Success Metrics

### Performance Targets
- [ ] Voice-to-transaction completion: ≤5 seconds
- [ ] Speech recognition accuracy: >85% for clear audio
- [ ] Amount parsing accuracy: >95%
- [ ] Category suggestion accuracy: >70%

### User Experience Targets
- [ ] One-tap voice recording activation
- [ ] Visual feedback within 100ms of recording start
- [ ] Auto-fill transaction form with minimal manual editing

---

## 🔍 Implementation Details

### Phase 1: Frontend Audio Recording (MVP)
**Duration:** 1 day

1. Install dependencies: `react-native-audio-recorder-player`, `react-native-fs`, `axios`
2. Create VoiceInputModal component with recording UI
3. Implement audio recording functionality
4. Add voice button to QuickAddScreen
5. Handle microphone permissions
6. Add network connectivity check

**Deliverables:**
- Working audio recording with start/stop controls
- Visual feedback during recording
- Audio file saved to temp directory

### Phase 2: Backend API Implementation (MVP)
**Duration:** 1-2 days

1. Setup Google Cloud Speech-to-Text API credentials
2. Create backend endpoint: POST `/api/v1/speech-to-text`
3. Implement multer for multipart/form-data handling
4. Integrate Google Speech-to-Text API
5. Add error handling and file cleanup
6. Implement rate limiting

**Deliverables:**
- Working backend API endpoint
- Audio file processing and transcription
- Error handling and logging

### Phase 3: Frontend-Backend Integration (MVP)
**Duration:** 1 day

1. Create `voiceService.ts` for API communication
2. Implement file upload with progress tracking
3. Handle API responses and errors
4. Add retry logic for failed uploads
5. Show processing states (uploading → transcribing)

**Deliverables:**
- Complete audio recording → upload → transcription flow
- Error handling and user feedback
- Loading states and progress indicators

### Phase 4: Vietnamese Text Parsing & Auto-Fill (MVP)
**Duration:** 1-2 days

1. Create `speechParser.ts` utility
2. Implement Vietnamese amount extraction (nghìn, triệu)
3. Add transaction type detection (chi, thu, mua, nhận)
4. Implement category keyword matching
5. Add date/time parsing (hôm qua, sáng nay)
6. Create TransactionPreview component
7. Integrate with transaction draft store

**Deliverables:**
- Working Vietnamese text parser
- Auto-filled transaction form
- Editable preview before saving

### Phase 5: Polish & Testing (MVP)
**Duration:** 1 day

1. Add visual feedback and animations
2. Implement comprehensive error handling
3. Add unit tests for parser
4. Add integration tests for API
5. Performance optimization
6. Accessibility improvements

**Deliverables:**
- Smooth user experience
- Complete error handling
- Test coverage
- Performance benchmarks

---

## 🚨 Risk Mitigation

### Technical Risks
- **Speech recognition accuracy**: Implement confidence thresholds and manual fallback. Google STT provides ~90-95% accuracy for Vietnamese.
- **Vietnamese language support**: Google Cloud has excellent Vietnamese support. Test with native speakers, provide manual edit option.
- **Network dependency**: Feature requires internet connectivity. Show clear error messages when offline.
- **API costs**: Monitor usage and implement rate limiting. Free tier covers ~60 minutes/month.
- **File upload failures**: Implement retry logic with exponential backoff. Max 3 retries before showing error.
- **Backend availability**: Handle backend downtime gracefully with user-friendly error messages.

### UX Risks
- **Noisy environments**: Visual indicators for recording quality. Show warnings for low confidence transcriptions.
- **Privacy concerns**: Clear indication when recording. Explicit consent before first use. Audio sent to Google via backend (not stored).
- **Learning curve**: Progressive disclosure and helpful hints. Provide examples of voice commands.
- **Upload time**: Show progress indicator for large audio files. Compress audio before upload if needed.

---

## 🔒 Privacy & Legal Compliance

### Data Handling (Backend + Google Cloud)
- **Audio Data Flow**: Device → Your Backend → Google Cloud Speech-to-Text API → Backend → Device
- **User Consent**: Explicit opt-in required before first use. Clear disclosure that audio is sent to Google via backend.
- **Data Retention**:
  - Audio files temporarily stored on backend server during processing
  - Deleted immediately after transcription (within seconds)
  - No long-term storage of audio files
  - Google processes audio per their privacy policy (not stored after processing)
- **Backend Security**: Audio files stored in `/tmp` directory with automatic cleanup

### Legal Compliance (Vietnam)
- **Vietnam Decree 13/2023**: Voice data is classified as sensitive personal data
- **User Disclosure Requirements**:
  - Show consent dialog on first voice input use
  - Clearly state: "Audio will be sent to our servers and processed by Google Cloud for speech recognition"
  - Provide link to privacy policy with detailed data flow explanation
- **Consent Management**:
  - Users can revoke consent and disable voice input in Settings
  - Consent status stored locally with MMKV
- **Data Minimization**:
  - Only record when user explicitly taps record button
  - Max recording duration: 30 seconds
  - No background recording

### Google Cloud Data Processing Agreement (DPA)
- Google Cloud is GDPR compliant and provides Data Processing Addendum
- Audio data processed in accordance with Google's privacy commitments
- Consider using Google Cloud's data residency options (Asia-Pacific region)

### Privacy Controls
- **Settings Toggle**: Allow users to disable voice input entirely (`Settings → Voice Input → Disable`)
- **First-Use Consent**: Modal with clear explanation and "I Agree" / "No Thanks" options
- **Processing Indicator**:
  - Visual feedback when recording
  - "Uploading..." and "Transcribing..." status messages
  - Clear indication data is being sent to external service
- **Fallback Option**: Manual text input always available as primary method
- **Audit Logging**: Log voice input usage (count, timestamps) for transparency reports

### Privacy Policy Updates Required
Add section covering:
1. Voice input feature and data flow
2. Third-party processing (Google Cloud)
3. Data retention policy (immediate deletion after processing)
4. User rights (disable, revoke consent)
5. Security measures (encryption in transit)

---

## 📋 Acceptance Criteria

### Must Have
- [ ] Voice recording works on iOS and Android
- [ ] Basic Vietnamese speech recognition functional
- [ ] Amount extraction works for common formats
- [ ] Integration with existing QuickAddScreen

### Should Have
- [ ] Category auto-suggestion based on keywords
- [ ] Visual feedback during recording
- [ ] Edit capability for parsed data
- [ ] Error handling for failed recognition

### Could Have
- [ ] Multiple language support
- [ ] Advanced parsing for complex transactions
- [ ] Voice training for improved accuracy
- [ ] Offline speech processing

---

## 📚 References

- [React Native Voice Documentation](https://github.com/react-native-voice/voice)
- [iOS Speech Framework](https://developer.apple.com/documentation/speech)
- [Android SpeechRecognizer](https://developer.android.com/reference/android/speech/SpeechRecognizer)
- [Vietnamese Speech Recognition Best Practices](https://example.com)
- [Accessibility Guidelines for Voice Input](https://example.com)