# Task 11: Transaction Preview Component

## Overview

Create the TransactionPreview component that displays parsed voice data in a reviewable format before applying to the transaction form. This component allows users to see and edit the extracted information before finalizing the transaction.

## Tasks

- [ ] Create TransactionPreview.tsx component
- [ ] Display parsed transaction data in cards
- [ ] Add edit capabilities for each field
- [ ] Show confidence indicators with colors
- [ ] Implement Apply/Cancel actions

## Acceptance Criteria

### Component Functionality

- Displays all parsed voice data in organized cards/sections
- Each field is individually editable inline
- Confidence scores visually represented (colors, indicators)
- Apply button commits changes to transaction form
- Cancel button discards voice data and returns to form

### Visual Design

- Card-based layout for different data types
- Color-coded confidence indicators (green/yellow/red)
- Clear field labels and values
- Edit icons and inline editing capability
- Accessible design with proper contrast and sizing

### User Interaction

- Tap to edit any field inline
- Save/cancel individual field edits
- Apply all changes with single action
- Clear feedback for user actions
- Validation during inline editing

## Priority

High

## Process

0%

## Estimated Time

6-8 hours

## Dependencies

- Task 10: Transaction Store Integration completed
- Understanding of app design system and component patterns
- Access to existing form components for consistency

## Libraries to Install

- None (uses existing app components and design system)

## Implementation Details

### 1) Component Interface & Props

- **TransactionPreview Interface**:
  ```typescript
  interface TransactionPreviewProps {
    voiceData: VoiceParseResult;
    onApply: (editedData: VoiceParseResult) => void;
    onCancel: () => void;
    onFieldEdit?: (field: string, value: any) => void;
    isVisible: boolean;
  }

  interface PreviewFieldProps {
    label: string;
    value: any;
    confidence: number;
    onEdit: (newValue: any) => void;
    editComponent: React.ComponentType<any>;
    placeholder?: string;
  }
  ```

### 2) Visual Design System

- **Card Layout**:
  ```typescript
  const $previewCard: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  });
  ```

- **Confidence Indicators**:
  - High confidence (>0.8): Green indicator
  - Medium confidence (0.5-0.8): Yellow/orange indicator
  - Low confidence (<0.5): Red indicator
  - Visual confidence bar or color-coded borders

### 3) Inline Editing System

- **Edit State Management**:
  ```typescript
  interface FieldEditState {
    isEditing: boolean;
    originalValue: any;
    currentValue: any;
    hasChanged: boolean;
  }

  const [editStates, setEditStates] = useState<Record<string, FieldEditState>>({});
  ```

## Development Workflow

### Before Starting
1. Create feature branch: `git checkout-b feat/transaction-preview-component`
2. Start development work

### When Complete
1. Commit changes with descriptive messages
2. Push branch to remote repository
3. Create PR targeting `dev` branch
4. Add comprehensive PR description

## Implementation Steps

### Phase 1: Basic Component Structure

1. **Create TransactionPreview Component**:
   ```typescript
   // app/components/voice/TransactionPreview.tsx
   export const TransactionPreview: React.FC<TransactionPreviewProps> = ({
     voiceData,
     onApply,
     onCancel,
     onFieldEdit,
     isVisible
   }) => {
     const { themed } = useAppTheme();
     const [editedData, setEditedData] = useState<VoiceParseResult>(voiceData);
     const [editingField, setEditingField] = useState<string | null>(null);

     // Component implementation
   };
   ```

2. **Modal/Overlay Container**:
   - Full-screen or bottom sheet presentation
   - Proper backdrop and dismissal handling
   - Animation for show/hide transitions
   - Safe area handling for different devices

3. **Basic Layout Structure**:
   - Header with title and actions
   - Scrollable content area for field cards
   - Bottom action bar with Apply/Cancel
   - Loading states during processing

### Phase 2: Field Display Cards

4. **Preview Field Component**:
   ```typescript
   const PreviewField: React.FC<PreviewFieldProps> = ({
     label,
     value,
     confidence,
     onEdit,
     editComponent: EditComponent,
     placeholder
   }) => {
     const [isEditing, setIsEditing] = useState(false);
     const [currentValue, setCurrentValue] = useState(value);

     return (
       <View style={themed($fieldCard)}>
         <View style={themed($fieldHeader)}>
           <Text style={themed($fieldLabel)}>{label}</Text>
           <ConfidenceIndicator confidence={confidence} />
         </View>

         {isEditing ? (
           <EditComponent
             value={currentValue}
             onChange={setCurrentValue}
             onSave={() => handleSave()}
             onCancel={() => handleCancel()}
           />
         ) : (
           <TouchableOpacity onPress={() => setIsEditing(true)}>
             <Text style={themed($fieldValue)}>
               {value || placeholder}
             </Text>
           </TouchableOpacity>
         )}
       </View>
     );
   };
   ```

5. **Confidence Indicator Component**:
   - Color-coded confidence visualization
   - Progress bar or circular indicator
   - Numerical confidence display option
   - Accessibility-friendly design

6. **Field-Specific Displays**:
   - Amount: Formatted currency display
   - Type: Transaction type with icons
   - Category: Category chips with icons
   - Description: Multiline text display
   - Date: Formatted date with calendar icon

### Phase 3: Inline Editing Implementation

7. **Edit Component System**:
   ```typescript
   const AmountEditComponent = ({ value, onChange, onSave, onCancel }) => {
     return (
       <View style={themed($editContainer)}>
         <TextInput
           value={value?.toString()}
           onChangeText={(text) => onChange(parseFloat(text) || 0)}
           keyboardType="numeric"
           autoFocus
           style={themed($editInput)}
         />
         <View style={themed($editActions)}>
           <Button onPress={onSave} text="Save" />
           <Button onPress={onCancel} text="Cancel" />
         </View>
       </View>
     );
   };
   ```

8. **Type Selection Edit**:
   - Radio buttons or segmented control
   - Income/expense selection
   - Visual feedback for selection

9. **Category Selection Edit**:
   - Category picker integration
   - Search functionality for categories
   - Visual category representation

10. **Description Text Edit**:
    - Multiline text input
    - Character limit indication
    - Auto-resize text area

### Phase 4: Actions & Integration

11. **Apply/Cancel Actions**:
    ```typescript
    const handleApply = () => {
      // Validate all edited data
      const validationResult = validateEditedData(editedData);

      if (validationResult.isValid) {
        onApply(editedData);
      } else {
        // Show validation errors
        showValidationErrors(validationResult.errors);
      }
    };

    const handleCancel = () => {
      // Confirm if there are unsaved changes
      if (hasUnsavedChanges()) {
        showConfirmationDialog({
          title: "Discard Changes?",
          message: "You have unsaved changes. Are you sure you want to cancel?",
          onConfirm: () => onCancel()
        });
      } else {
        onCancel();
      }
    };
    ```

12. **Change Tracking**:
    - Track which fields have been edited
    - Highlight changed fields visually
    - Provide reset option for individual fields
    - Show summary of changes

13. **Validation Integration**:
    - Real-time validation during editing
    - Show validation errors clearly
    - Prevent apply with invalid data
    - Guide user to fix validation issues

## Manual Testing Checklist

### Basic Display
- [ ] All voice data fields displayed correctly
- [ ] Confidence indicators show appropriate colors
- [ ] Card layout renders properly on different screen sizes
- [ ] Empty/missing fields handled gracefully
- [ ] Text truncation works for long content

### Inline Editing
- [ ] Tap to edit functionality works for all fields
- [ ] Amount editing with numeric keyboard
- [ ] Type selection with radio buttons/segmented control
- [ ] Category selection with picker interface
- [ ] Description editing with multiline text
- [ ] Date editing with date picker

### Confidence Indicators
- [ ] High confidence (>0.8): Green indicator
- [ ] Medium confidence (0.5-0.8): Yellow/orange indicator
- [ ] Low confidence (<0.5): Red indicator
- [ ] Confidence changes reflected when editing
- [ ] Accessibility support for color indicators

### Actions & Navigation
- [ ] Apply button commits all changes
- [ ] Cancel button discards changes (with confirmation)
- [ ] Individual field save/cancel works
- [ ] Validation prevents invalid data application
- [ ] Unsaved changes warning on cancel

### Integration
- [ ] Receives voice data from parsing correctly
- [ ] Edited data passed to form properly
- [ ] Modal/overlay presentation smooth
- [ ] Keyboard handling doesn't break layout
- [ ] Performance good with complex voice data

### Edge Cases
- [ ] Partial voice data (missing fields) handled
- [ ] Very low confidence data handled appropriately
- [ ] Invalid edits prevented or corrected
- [ ] Long descriptions don't break layout
- [ ] Multiple rapid edits handled correctly

## Acceptance Criteria for Task

- TransactionPreview component fully implemented with card layout
- All voice data fields displayable and editable
- Confidence indicators provide clear visual feedback
- Inline editing works smoothly for all field types
- Apply/Cancel actions properly integrated with transaction flow
- Component ready for integration with voice input flow