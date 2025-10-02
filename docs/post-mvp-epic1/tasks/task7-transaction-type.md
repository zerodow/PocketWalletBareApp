# Task 7: Transaction Type Detection

## Overview

Implement functionality to detect whether a transaction is income or expense based on keywords in Vietnamese speech. This task focuses on analyzing speech patterns and keywords to automatically determine transaction type.

## Tasks

- [ ] Implement extractTransactionType() function
- [ ] Detect keywords: "spent", "received", "bought", "added"
- [ ] Support both English and Vietnamese keywords
- [ ] Add confidence scoring for type detection
- [ ] Handle ambiguous cases and provide fallbacks

## Acceptance Criteria

### Keyword Recognition

- Recognizes Vietnamese expense keywords ("chi", "mua", "trả", "tiêu")
- Recognizes Vietnamese income keywords ("nhận", "thu", "được", "kiếm")
- Supports English keywords ("spent", "bought", "received", "earned")
- Handles various verb forms and tenses
- Processes negations and context modifiers

### Type Classification

- Correctly classifies expense transactions
- Correctly classifies income transactions
- Returns null for ambiguous or unclear input
- Provides confidence scores for classifications
- Handles mixed language keyword usage

### Context Analysis

- Considers surrounding words for context
- Handles compound transaction descriptions
- Distinguishes between similar-sounding words
- Processes transaction-related phrases naturally
- Accounts for Vietnamese sentence structure

## Priority

High

## Process

0%

## Estimated Time

4-6 hours

## Dependencies

- Task 6: Amount Parser Implementation completed
- Understanding of Vietnamese transaction terminology

## Libraries to Install

- None (pure JavaScript/TypeScript implementation)

## Implementation Details

### 1) Transaction Type Interface

- **Type Detection Interface**:
  ```typescript
  interface TransactionTypeResult {
    type: 'income' | 'expense' | null;
    confidence: number;
    matchedKeywords: string[];
    originalText: string;
    position: number;
  }

  interface TypeDetectionOptions {
    language: 'vi' | 'en' | 'auto';
    strictMode: boolean;
    contextWindow: number;
  }

  function extractTransactionType(text: string, options?: TypeDetectionOptions): TransactionTypeResult;
  ```

### 2) Keyword Mapping System

- **Vietnamese Keywords**:
  ```typescript
  const EXPENSE_KEYWORDS = {
    vi: ['chi', 'mua', 'trả', 'tiêu', 'tốn', 'mất', 'đưa', 'nộp', 'thanh toán'],
    en: ['spent', 'bought', 'paid', 'purchased', 'cost', 'expense', 'withdraw'],
  };

  const INCOME_KEYWORDS = {
    vi: ['nhận', 'thu', 'được', 'kiếm', 'lương', 'thưởng', 'bán', 'thu nhập'],
    en: ['received', 'earned', 'income', 'salary', 'bonus', 'sold', 'profit'],
  };
  ```

### 3) Context Analysis Patterns

- **Sentence Structure Recognition**:
  - Vietnamese subject-verb-object patterns
  - English verb-object patterns
  - Passive voice constructions
  - Question vs statement detection

## Development Workflow

### Before Starting
1. Create feature branch: `git checkout -b feat/transaction-type-detection`
2. Start development work

### When Complete
1. Commit changes with descriptive messages
2. Push branch to remote repository
3. Create PR targeting `dev` branch
4. Add comprehensive PR description

## Implementation Steps

### Phase 1: Basic Type Detection

1. **Extend SpeechParser Class**:
   ```typescript
   // app/utils/voice/speechParser.ts
   export class SpeechParser {
     extractTransactionType(text: string, options?: TypeDetectionOptions): TransactionTypeResult {
       const normalizedText = this.normalizeText(text);
       const expenseMatch = this.findExpenseKeywords(normalizedText);
       const incomeMatch = this.findIncomeKeywords(normalizedText);

       return this.classifyTransaction(expenseMatch, incomeMatch, text);
     }
   }
   ```

2. **Keyword Detection**:
   - Case-insensitive keyword matching
   - Handle multiple keyword matches
   - Track keyword positions in text
   - Support partial word matches where appropriate

3. **Basic Classification Logic**:
   - Single keyword type → high confidence
   - Multiple same-type keywords → very high confidence
   - Conflicting keywords → low confidence, return null
   - No keywords → null result

### Phase 2: Vietnamese Language Processing

4. **Vietnamese Keyword Processing**:
   ```typescript
   private findVietnameseExpenseKeywords(text: string): KeywordMatch[] {
     const patterns = [
       /\b(chi|mua|trả|tiêu)\b/gi,
       /\b(tốn|mất|đưa|nộp)\b/gi,
       /\b(thanh toán)\b/gi,
     ];

     return this.findKeywordMatches(text, patterns, 'expense');
   }
   ```

5. **Vietnamese Sentence Analysis**:
   - Subject identification (tôi, mình, etc.)
   - Verb form recognition
   - Object relationship analysis
   - Temporal context (đã, sẽ, đang)

6. **Tone and Context Handling**:
   - Vietnamese tonal variations
   - Common abbreviated forms
   - Colloquial expressions
   - Regional dialect variations

### Phase 3: Confidence Scoring & Context

7. **Confidence Calculation**:
   ```typescript
   private calculateTypeConfidence(
     expenseMatches: KeywordMatch[],
     incomeMatches: KeywordMatch[],
     context: string
   ): number {
     let confidence = 0;

     // Base confidence from keyword strength
     const strongKeywords = expenseMatches.filter(m => m.strength > 0.8).length;
     confidence += strongKeywords * 0.3;

     // Context modifiers
     if (this.hasAmountNearby(context)) confidence += 0.2;
     if (this.hasLocationContext(context)) confidence += 0.1;

     // Conflicting keywords reduce confidence
     if (expenseMatches.length > 0 && incomeMatches.length > 0) {
       confidence *= 0.5;
     }

     return Math.min(confidence, 1.0);
   }
   ```

8. **Context Analysis**:
   - Proximity to amount mentions
   - Location/merchant context
   - Time references
   - Transaction-specific phrases

9. **Ambiguity Resolution**:
   - Handle conflicting keyword signals
   - Use context to break ties
   - Default to null for unclear cases
   - Provide reasoning for decisions

### Phase 4: Advanced Features

10. **Negation Handling**:
    - Vietnamese negation particles (không, chưa)
    - English negation (didn't, not, never)
    - Double negation resolution
    - Context-dependent negation effects

11. **Compound Transaction Detection**:
    - Multiple transactions in one sentence
    - Transfer vs expense distinction
    - Refund vs income classification
    - Complex transaction scenarios

12. **Performance Optimization**:
    - Efficient regex compilation
    - Short-circuit evaluation for clear cases
    - Minimize string processing overhead
    - Cache compiled patterns

## Manual Testing Checklist

### Vietnamese Expense Detection
- [ ] "tôi chi 50 nghìn" → expense (high confidence)
- [ ] "mua cơm 25k" → expense (high confidence)
- [ ] "trả tiền điện" → expense (medium confidence)
- [ ] "tiêu 100k hôm qua" → expense (high confidence)
- [ ] "tốn tiền taxi" → expense (medium confidence)

### Vietnamese Income Detection
- [ ] "nhận lương 5 triệu" → income (high confidence)
- [ ] "thu tiền bán hàng" → income (high confidence)
- [ ] "được thưởng" → income (medium confidence)
- [ ] "kiếm được 200k" → income (high confidence)
- [ ] "bán điện thoại" → income (medium confidence)

### English Keywords
- [ ] "spent 50k for lunch" → expense (high confidence)
- [ ] "received salary" → income (high confidence)
- [ ] "bought groceries" → expense (high confidence)
- [ ] "earned bonus" → income (high confidence)
- [ ] "paid bills" → expense (high confidence)

### Edge Cases
- [ ] "không mua gì" → null (negation)
- [ ] "mua và bán" → null (conflicting)
- [ ] "lunch yesterday" → null (no keywords)
- [ ] "50k" → null (amount only)
- [ ] "chuyển tiền cho mẹ" → expense (transfer context)

### Confidence Scoring
- [ ] Clear single keywords → high confidence (>0.8)
- [ ] Multiple same-type keywords → very high confidence (>0.9)
- [ ] Weak context → lower confidence (<0.6)
- [ ] Conflicting keywords → very low confidence (<0.3)
- [ ] Amount proximity → confidence boost

## Acceptance Criteria for Task

- Transaction type detection accurate for Vietnamese and English
- Confidence scoring reflects detection quality
- Handles common ambiguous cases appropriately
- Negation and complex sentence structures processed
- Performance optimized for real-time processing
- Ready for integration with category hint detection