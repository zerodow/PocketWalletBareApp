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

### Dependencies Required
```json
{
  "react-native-voice": "^3.2.4",
  "expo-av": "~14.2.0",
  "expo-permissions": "~15.1.0"
}
```

**Note:** Speech-to-text functionality requires either:
- `react-native-voice` for cross-platform online STT
- Native integration with Google MLKit (Android) / iOS Speech API for higher accuracy
- Expo custom dev client or prebuild (not compatible with Expo Go)

### Components to Create

#### 1. VoiceInputModal.tsx
- Recording interface with visual feedback
- Start/stop recording controls
- Audio waveform visualization
- Processing status indicators

#### 2. VoiceButton.tsx
- Floating action button with microphone icon
- Press-and-hold or tap-to-record modes
- Loading states and permissions handling

#### 3. TransactionPreview.tsx
- Display parsed transaction data
- Edit capabilities for each field
- Confidence indicators
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

### Store Updates

#### transactionDraftStore.ts
```typescript
// Add bulk update method
setBulkFields: (fields: Partial<TransactionDraft>) => void
setFromVoiceInput: (voiceData: VoiceParseResult) => void
```

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

### Phase 1: Basic Voice Recording (MVP)
1. Add react-native-voice dependency
2. Create VoiceInputModal component
3. Implement basic recording functionality
4. Add voice button to QuickAddScreen

### Phase 2: Speech-to-Text Processing (MVP)
1. Implement Vietnamese speech recognition using online APIs
2. Create speechParser utility functions
3. Add text parsing algorithms
4. Integrate with transaction draft store

### Phase 3: Smart Auto-Fill (MVP)
1. Implement category matching logic
2. Create TransactionPreview component
3. Add confidence scoring system
4. Implement edit-before-save workflow

### Phase 4: Polish & Testing (MVP)
1. Add visual feedback and animations
2. Implement error handling and fallbacks
3. Add comprehensive test coverage
4. Performance optimization and accessibility

### Phase 5: Offline STT Engine (Post-MVP)
1. Investigate on-device STT engines (Vosk, Whisper Tiny)
2. Implement offline fallback mechanism
3. Add model download and management
4. Performance optimization for on-device processing

---

## 🚨 Risk Mitigation

### Technical Risks
- **Speech recognition accuracy**: Implement confidence thresholds and manual fallback
- **Vietnamese language support**: Test with native speakers, provide manual edit option
- **Device compatibility**: Graceful degradation for older devices
- **Permissions**: Clear permission prompts and fallback flows
- **Online/Offline trade-offs**: MVP relies on internet connectivity; Post-MVP offline engines may have reduced accuracy but provide offline functionality

### UX Risks
- **Noisy environments**: Visual indicators for recording quality
- **Privacy concerns**: Clear indication when recording, local processing emphasis
- **Learning curve**: Progressive disclosure and helpful hints

---

## 🔒 Privacy & Legal Compliance

### Data Handling
- **Audio Data**: Voice recordings are processed by external APIs (Google/Apple) during MVP phase
- **User Consent**: Explicit opt-in required before sending voice data off-device
- **Data Retention**: Audio data is not stored locally or remotely after processing
- **Offline Processing**: Post-MVP phase will implement on-device STT to eliminate external data sharing

### Legal Compliance
- **Vietnam Decree 13/2023**: Voice data is classified as sensitive personal data
- **User Disclosure**: Clear notification when voice data is sent to external services
- **Consent Management**: Users can revoke voice input permissions at any time
- **Data Minimization**: Only necessary audio segments are processed, no background recording

### Privacy Controls
- **Settings Toggle**: Allow users to disable voice input entirely
- **Processing Indicator**: Visual feedback when audio is being sent to external APIs
- **Fallback Option**: Manual text input always available as alternative

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

- [Expo Speech Documentation](https://docs.expo.dev/versions/latest/sdk/speech/)
- [React Native Audio Recording](https://docs.expo.dev/versions/latest/sdk/av/)
- [Vietnamese Speech Recognition Best Practices](https://example.com)
- [Accessibility Guidelines for Voice Input](https://example.com)