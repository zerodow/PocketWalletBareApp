# Task 10: Transaction Store Integration

## Overview

Integrate voice parsing results with the existing transaction draft store system. This task connects the voice parsing functionality to the app's state management and provides methods for bulk updating transaction form fields.

## Tasks

- [ ] Extend transactionDraftStore.ts with voice methods
- [ ] Implement setBulkFields() and setFromVoiceInput() methods
- [ ] Connect voice parsing results to transaction form
- [ ] Handle partial parsing results gracefully
- [ ] Test store integration with voice components

## Acceptance Criteria

### Store Methods Implementation

- setBulkFields() method accepts partial transaction data
- setFromVoiceInput() method processes VoiceParseResult
- Methods integrate smoothly with existing store structure
- Partial updates don't overwrite existing user input
- Store state updates trigger appropriate UI re-renders

### Voice Data Integration

- Amount parsing results populate amount field correctly
- Transaction type updates form type selection
- Category hints populate category suggestions
- Description text appears in note/description field
- Date parsing updates transaction date field

### Error Handling

- Invalid parsing results handled gracefully
- Partial results don't break form functionality
- Store remains consistent after failed operations
- User input preserved during voice integration
- Clear error states for integration failures

## Priority

High

## Process

0%

## Estimated Time

6-8 hours

## Dependencies

- Task 9: Description & Date Parsing completed
- Existing transactionDraftStore.ts implementation
- Understanding of current store architecture

## Libraries to Install

- None (extends existing Zustand store)

## Implementation Details

### 1) Store Extension Interface

- **Voice Integration Methods**:
  ```typescript
  interface TransactionDraftStore {
    // Existing methods...

    // Voice integration methods
    setBulkFields: (fields: Partial<TransactionDraft>) => void;
    setFromVoiceInput: (voiceData: VoiceParseResult) => void;
    clearVoiceData: () => void;
    getVoiceConfidence: () => number;
    hasVoiceData: () => boolean;
  }

  interface VoiceParseResult {
    amount?: string;
    type?: 'income' | 'expense';
    categoryHints?: string[];
    description?: string;
    date?: string;
    confidence: number;
    rawText?: string;
  }
  ```

### 2) Voice Data Processing

- **Data Transformation**:
  ```typescript
  const processVoiceData = (voiceData: VoiceParseResult): Partial<TransactionDraft> => {
    const updates: Partial<TransactionDraft> = {};

    if (voiceData.amount) {
      updates.amount = parseFloat(voiceData.amount);
    }

    if (voiceData.type) {
      updates.type = voiceData.type;
    }

    if (voiceData.categoryHints?.length) {
      updates.categoryId = findBestCategoryMatch(voiceData.categoryHints);
    }

    if (voiceData.description) {
      updates.description = voiceData.description;
    }

    if (voiceData.date) {
      updates.date = new Date(voiceData.date);
    }

    return updates;
  };
  ```

## Development Workflow

### Before Starting
1. Create feature branch: `git checkout -b feat/store-voice-integration`
2. Start development work

### When Complete
1. Commit changes with descriptive messages
2. Push branch to remote repository
3. Create PR targeting `dev` branch
4. Add comprehensive PR description

## Implementation Steps

### Phase 1: Store Extension

1. **Extend TransactionDraftStore**:
   ```typescript
   // app/stores/transactionDraftStore.ts
   interface TransactionDraftState {
     // Existing state...

     voiceData?: VoiceParseResult;
     voiceConfidence: number;
     hasVoiceInput: boolean;
   }

   export const useTransactionDraftStore = create<TransactionDraftStore>()((set, get) => ({
     // Existing implementation...

     setBulkFields: (fields: Partial<TransactionDraft>) => {
       set((state) => ({
         ...state,
         ...fields,
         hasVoiceInput: true
       }));
     },

     setFromVoiceInput: (voiceData: VoiceParseResult) => {
       const processedData = processVoiceData(voiceData);
       set((state) => ({
         ...state,
         ...processedData,
         voiceData,
         voiceConfidence: voiceData.confidence,
         hasVoiceInput: true
       }));
     }
   }));
   ```

2. **Add Voice State Management**:
   - Track voice input presence
   - Store confidence scores
   - Maintain original voice data for reference
   - Handle clearing voice-specific state

3. **Implement Bulk Update Logic**:
   - Merge new fields with existing state
   - Preserve user input where appropriate
   - Handle field validation during bulk updates
   - Maintain store consistency

### Phase 2: Data Processing & Validation

4. **Voice Data Processing**:
   ```typescript
   const processVoiceData = (voiceData: VoiceParseResult): Partial<TransactionDraft> => {
     const updates: Partial<TransactionDraft> = {};

     // Amount processing with validation
     if (voiceData.amount && !isNaN(parseFloat(voiceData.amount))) {
       updates.amount = parseFloat(voiceData.amount);
     }

     // Type processing
     if (voiceData.type && ['income', 'expense'].includes(voiceData.type)) {
       updates.type = voiceData.type;
     }

     // Category processing
     if (voiceData.categoryHints?.length) {
       const matchedCategory = findBestCategoryMatch(voiceData.categoryHints);
       if (matchedCategory) {
         updates.categoryId = matchedCategory.id;
       }
     }

     // Description processing
     if (voiceData.description?.trim()) {
       updates.description = voiceData.description.trim();
     }

     // Date processing
     if (voiceData.date) {
       const parsedDate = new Date(voiceData.date);
       if (!isNaN(parsedDate.getTime())) {
         updates.date = parsedDate;
       }
     }

     return updates;
   };
   ```

5. **Category Matching Logic**:
   - Match category hints to existing categories
   - Handle multiple category suggestions
   - Priority-based category selection
   - Fallback category assignment

6. **Field Validation**:
   - Validate amounts for reasonable ranges
   - Ensure transaction types are valid
   - Verify date formats and ranges
   - Check description length and content

### Phase 3: Component Integration

7. **Voice Component Connection**:
   ```typescript
   // In VoiceInputModal or similar
   const transactionStore = useTransactionDraftStore();

   const handleVoiceProcessingComplete = (result: VoiceParseResult) => {
     if (result.confidence > 0.5) {
       transactionStore.setFromVoiceInput(result);
       // Show preview or go directly to form
     } else {
       // Handle low confidence result
       showLowConfidenceDialog(result);
     }
   };
   ```

8. **Form Integration**:
   - Update form fields from store state
   - Handle voice-populated fields differently
   - Show voice confidence indicators
   - Allow user editing of voice-populated data

9. **State Synchronization**:
   - Ensure UI reflects store changes
   - Handle concurrent user input and voice input
   - Manage form validation with voice data
   - Clear voice state appropriately

### Phase 4: Advanced Features

10. **Confidence-Based Handling**:
    ```typescript
    setFromVoiceInput: (voiceData: VoiceParseResult) => {
      const processedData = processVoiceData(voiceData);

      // High confidence: auto-populate fields
      if (voiceData.confidence > 0.8) {
        set((state) => ({ ...state, ...processedData }));
      }
      // Medium confidence: populate with indicators
      else if (voiceData.confidence > 0.5) {
        set((state) => ({
          ...state,
          ...processedData,
          voiceFieldsRequireReview: true
        }));
      }
      // Low confidence: store for user review
      else {
        set((state) => ({
          ...state,
          voiceData,
          showVoiceReviewModal: true
        }));
      }
    }
    ```

11. **Partial Update Handling**:
    - Handle cases where only some fields are parsed
    - Preserve existing user input
    - Merge voice data with form data intelligently
    - Provide undo capability for voice updates

12. **Performance Optimization**:
    - Debounce rapid store updates
    - Minimize unnecessary re-renders
    - Efficient state comparison
    - Lazy processing of complex voice data

## Manual Testing Checklist

### Basic Integration
- [ ] Voice amount populates amount field correctly
- [ ] Transaction type updates form type selection
- [ ] Category hints select appropriate categories
- [ ] Description appears in description field
- [ ] Date updates transaction date

### Partial Results Handling
- [ ] Amount only: populates amount, leaves other fields
- [ ] Type only: updates type, preserves other data
- [ ] Mixed results: updates available fields only
- [ ] Low confidence: shows review interface
- [ ] No results: maintains existing form state

### User Input Preservation
- [ ] Existing user input not overwritten inappropriately
- [ ] Voice + manual input handled correctly
- [ ] Undo voice input functionality works
- [ ] Form validation with voice data works
- [ ] Clear voice data resets appropriate fields

### Store State Management
- [ ] Voice confidence tracked correctly
- [ ] Voice presence flag accurate
- [ ] Store updates trigger UI re-renders
- [ ] Multiple voice inputs handled correctly
- [ ] Store remains consistent after errors

### Integration with Existing Features
- [ ] Category selection works with voice hints
- [ ] Form validation includes voice-populated fields
- [ ] Save transaction includes voice data
- [ ] Edit transaction preserves voice origin
- [ ] Form reset clears voice state

## Acceptance Criteria for Task

- Store extended with voice integration methods
- Voice parsing results properly integrated with form
- Partial results handled gracefully without breaking store
- Confidence-based processing provides appropriate UX
- Integration tested with existing transaction flow
- Ready for transaction preview component integration