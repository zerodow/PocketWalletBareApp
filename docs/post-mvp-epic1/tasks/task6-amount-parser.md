# Task 6: Amount Parser Implementation

## Overview

Create the core text parsing functionality to extract transaction amounts from Vietnamese speech text. This includes handling Vietnamese currency units ("nghìn", "triệu") and various number formats commonly used in Vietnamese.

## Tasks

- [ ] Create speechParser.ts utility file
- [ ] Implement extractAmount() function
- [ ] Support basic number recognition
- [ ] Handle Vietnamese currency units ("nghìn", "triệu")
- [ ] Add confidence scoring for amount extraction

## Acceptance Criteria

### Amount Recognition

- Recognizes numbers in various formats (50, 50k, 50 nghìn, 2.5 triệu)
- Handles both Vietnamese and English number words
- Converts currency units to actual values (nghìn → ×1000, triệu → ×1000000)
- Supports decimal numbers and common fractions
- Validates extracted amounts for reasonableness

### Text Processing

- Extracts amounts from natural speech patterns
- Handles multiple amount mentions (uses first/largest)
- Ignores irrelevant numbers (dates, times, etc.)
- Processes mixed Vietnamese/English input
- Provides confidence scores for extraction accuracy

### Error Handling

- Returns null for no amount found
- Handles malformed or ambiguous input
- Validates numeric ranges (not negative, not excessive)
- Graceful handling of parsing failures
- Clear error messaging for debugging

## Priority

High

## Process

0%

## Estimated Time

6-8 hours

## Dependencies

- Task 5: Speech-to-Text Integration completed
- Understanding of Vietnamese number and currency conventions

## Libraries to Install

- None (pure JavaScript/TypeScript implementation)

## Implementation Details

### 1) Parser Interface & Types

- **Amount Parser Interface**:
  ```typescript
  interface AmountParseResult {
    amount: number;
    originalText: string;
    confidence: number;
    currency?: string;
    position: number;
  }

  interface ParserOptions {
    language: 'vi' | 'en' | 'auto';
    strictMode: boolean;
    maxAmount?: number;
    minAmount?: number;
  }

  function extractAmount(text: string, options?: ParserOptions): AmountParseResult | null;
  ```

### 2) Vietnamese Currency Units

- **Currency Mapping**:
  ```typescript
  const CURRENCY_MULTIPLIERS = {
    // Vietnamese
    'nghìn': 1000,
    'nghin': 1000,
    'k': 1000,
    'triệu': 1000000,
    'trieu': 1000000,
    'm': 1000000,
    'tỷ': 1000000000,
    'ty': 1000000000,
    'b': 1000000000,

    // English
    'thousand': 1000,
    'million': 1000000,
    'billion': 1000000000,
  };
  ```

### 3) Number Recognition Patterns

- **Regex Patterns**:
  - Decimal numbers: `/\d+\.?\d*/`
  - Currency with units: `/(\d+(?:\.\d+)?)\s*(nghìn|triệu|k|m)/`
  - Word numbers: `/(một|hai|ba|...)(\s+nghìn|triệu)?/`

## Development Workflow

### Before Starting
1. Create feature branch: `git checkout -b feat/amount-parser-implementation`
2. Start development work

### When Complete
1. Commit changes with descriptive messages
2. Push branch to remote repository
3. Create PR targeting `dev` branch
4. Add comprehensive PR description

## Implementation Steps

### Phase 1: Basic Parser Structure

1. **Create speechParser.ts**:
   ```typescript
   // app/utils/voice/speechParser.ts
   export class SpeechParser {
     private static instance: SpeechParser;

     public static getInstance(): SpeechParser {
       if (!this.instance) {
         this.instance = new SpeechParser();
       }
       return this.instance;
     }

     extractAmount(text: string, options?: ParserOptions): AmountParseResult | null {
       // Implementation
     }
   }
   ```

2. **Define Constants**:
   - Vietnamese currency multipliers
   - Number word mappings
   - Regex patterns for different number formats
   - Confidence scoring weights

3. **Basic Number Recognition**:
   - Extract numeric patterns from text
   - Handle decimal numbers and integers
   - Basic validation for reasonable amounts
   - Position tracking in original text

### Phase 2: Vietnamese Currency Processing

4. **Currency Unit Processing**:
   ```typescript
   private processCurrencyUnits(text: string): Array<{amount: number, unit: string, position: number}> {
     const patterns = [
       /(\d+(?:\.\d+)?)\s*(nghìn|nghin|k)/gi,
       /(\d+(?:\.\d+)?)\s*(triệu|trieu|m)/gi,
       /(\d+(?:\.\d+)?)\s*(tỷ|ty|b)/gi,
     ];

     const results = [];
     patterns.forEach(pattern => {
       const matches = [...text.matchAll(pattern)];
       results.push(...matches.map(match => ({
         amount: parseFloat(match[1]) * CURRENCY_MULTIPLIERS[match[2].toLowerCase()],
         unit: match[2],
         position: match.index || 0
       })));
     });

     return results;
   }
   ```

5. **Vietnamese Number Words**:
   - Handle written numbers (một, hai, ba, etc.)
   - Convert number words to digits
   - Support compound numbers
   - Handle mixed digit/word formats

6. **Amount Selection Logic**:
   - Choose most likely amount when multiple found
   - Prioritize amounts with currency units
   - Handle context clues for amount selection
   - Confidence scoring based on context

### Phase 3: Validation & Confidence Scoring

7. **Amount Validation**:
   ```typescript
   private validateAmount(amount: number, context: string): boolean {
     // Check reasonable ranges
     if (amount < 0 || amount > 10000000000) return false;

     // Check for common mistake patterns
     if (this.looksLikeDateTime(context)) return false;

     // Additional validation rules
     return true;
   }
   ```

8. **Confidence Scoring**:
   - Higher confidence for amounts with currency units
   - Lower confidence for ambiguous numbers
   - Context-based scoring adjustments
   - Multiple amount detection penalties

9. **Error Handling**:
   - Graceful handling of malformed input
   - Null return for no amount found
   - Detailed error logging for debugging
   - Recovery from partial parsing failures

### Phase 4: Advanced Features

10. **Context Analysis**:
    - Detect transaction-related keywords near amounts
    - Distinguish between amounts and other numbers
    - Handle multiple amounts (choose primary)
    - Context-based confidence adjustment

11. **Format Normalization**:
    - Convert all amounts to consistent format
    - Handle various decimal separators
    - Normalize currency representations
    - Clean up formatting inconsistencies

12. **Performance Optimization**:
    - Efficient regex execution
    - Caching for repeated patterns
    - Minimal string processing overhead
    - Optimized for mobile performance

## Manual Testing Checklist

### Basic Amount Extraction
- [ ] "50 nghìn" → 50000
- [ ] "2.5 triệu" → 2500000
- [ ] "500k" → 500000
- [ ] "1 tỷ" → 1000000000
- [ ] "25000" → 25000

### Vietnamese Language Support
- [ ] "năm mươi nghìn" → 50000
- [ ] "hai triệu rưỡi" → 2500000
- [ ] Mixed formats handled correctly
- [ ] Accented characters processed properly
- [ ] Common Vietnamese phrases recognized

### Edge Cases
- [ ] Multiple amounts: "50k for lunch, 20k tip" → 50000
- [ ] No amount: "had lunch yesterday" → null
- [ ] Invalid amounts: "abc nghìn" → null
- [ ] Very large amounts handled correctly
- [ ] Decimal precision maintained

### Confidence Scoring
- [ ] Clear amounts have high confidence (>0.8)
- [ ] Ambiguous amounts have lower confidence
- [ ] Context improves confidence scores
- [ ] Multiple amounts reduce confidence
- [ ] Edge cases have appropriate confidence

### Performance
- [ ] Fast processing of typical input
- [ ] Handles long text without issues
- [ ] Memory usage reasonable
- [ ] No regex catastrophic backtracking
- [ ] Consistent performance across devices

## Acceptance Criteria for Task

- Amount extraction works accurately for Vietnamese input
- Currency units properly converted to numeric values
- Confidence scoring provides meaningful quality assessment
- Error handling robust for edge cases and invalid input
- Performance optimized for mobile usage
- Ready for integration with transaction type detection