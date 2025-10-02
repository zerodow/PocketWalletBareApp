# Task 9: Description & Date Parsing

## Overview

Implement functionality to extract transaction descriptions and parse relative date expressions from Vietnamese speech. This task handles natural language date references and cleans up transaction descriptions for storage.

## Tasks

- [ ] Implement extractDescription() function
- [ ] Implement extractDateTime() function
- [ ] Support relative dates ("yesterday", "this morning")
- [ ] Clean up and format description text
- [ ] Handle edge cases and parsing errors

## Acceptance Criteria

### Description Processing

- Extracts meaningful transaction descriptions
- Removes parsed elements (amounts, dates, keywords)
- Cleans up filler words and unnecessary text
- Preserves important context and details
- Handles mixed Vietnamese/English descriptions

### Date/Time Extraction

- Recognizes Vietnamese relative dates ("hôm qua", "sáng nay", "tuần trước")
- Supports English relative dates ("yesterday", "last week", "this morning")
- Converts relative dates to actual dates
- Handles time of day expressions ("buổi sáng", "chiều")
- Validates and formats date output consistently

### Text Processing

- Smart text cleanup without losing meaning
- Proper handling of Vietnamese diacritics
- Sentence structure preservation where relevant
- Context-aware keyword removal
- Maintains readability of final description

## Priority

Medium-High

## Process

0%

## Estimated Time

6-8 hours

## Dependencies

- Task 8: Category Hints Extraction completed
- Understanding of Vietnamese date/time expressions
- Knowledge of Vietnamese sentence structure patterns

## Libraries to Install

- None (pure JavaScript/TypeScript implementation, using built-in Date APIs)

## Implementation Details

### 1) Description & Date Interface

- **Extraction Interfaces**:
  ```typescript
  interface DescriptionResult {
    description: string;
    originalText: string;
    cleanedText: string;
    confidence: number;
    removedElements: string[];
  }

  interface DateTimeResult {
    date: Date;
    originalExpression: string;
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
    confidence: number;
    isRelative: boolean;
  }

  function extractDescription(text: string, parsedElements: ParsedElements): DescriptionResult;
  function extractDateTime(text: string): DateTimeResult | null;
  ```

### 2) Vietnamese Date Expression Mapping

- **Relative Date Patterns**:
  ```typescript
  const RELATIVE_DATE_PATTERNS = {
    vietnamese: {
      today: ['hôm nay', 'ngày nay'],
      yesterday: ['hôm qua', 'ngày qua'],
      tomorrow: ['ngày mai', 'mai'],
      thisWeek: ['tuần này'],
      lastWeek: ['tuần trước', 'tuần qua'],
      thisMonth: ['tháng này'],
      lastMonth: ['tháng trước', 'tháng qua']
    },
    english: {
      today: ['today'],
      yesterday: ['yesterday'],
      tomorrow: ['tomorrow'],
      thisWeek: ['this week'],
      lastWeek: ['last week'],
      thisMonth: ['this month'],
      lastMonth: ['last month']
    }
  };
  ```

### 3) Time of Day Recognition

- **Vietnamese Time Expressions**:
  ```typescript
  const TIME_OF_DAY_PATTERNS = {
    morning: ['sáng', 'buổi sáng', 'sáng nay', 'sáng qua'],
    afternoon: ['chiều', 'buổi chiều', 'trưa'],
    evening: ['tối', 'buổi tối', 'chiều tối'],
    night: ['đêm', 'ban đêm', 'khuya']
  };
  ```

## Development Workflow

### Before Starting
1. Create feature branch: `git checkout -b feat/description-date-parsing`
2. Start development work

### When Complete
1. Commit changes with descriptive messages
2. Push branch to remote repository
3. Create PR targeting `dev` branch
4. Add comprehensive PR description

## Implementation Steps

### Phase 1: Date/Time Extraction

1. **Extend SpeechParser Class**:
   ```typescript
   // app/utils/voice/speechParser.ts
   export class SpeechParser {
     extractDateTime(text: string): DateTimeResult | null {
       const normalizedText = this.normalizeText(text);

       // Check for relative date patterns
       const relativeMatch = this.findRelativeDatePattern(normalizedText);
       if (relativeMatch) {
         return this.parseRelativeDate(relativeMatch);
       }

       // Check for absolute date patterns
       const absoluteMatch = this.findAbsoluteDatePattern(normalizedText);
       if (absoluteMatch) {
         return this.parseAbsoluteDate(absoluteMatch);
       }

       return null;
     }
   }
   ```

2. **Relative Date Processing**:
   ```typescript
   private parseRelativeDate(match: DateMatch): DateTimeResult {
     const today = new Date();
     let targetDate = new Date(today);

     switch (match.type) {
       case 'yesterday':
         targetDate.setDate(today.getDate() - 1);
         break;
       case 'lastWeek':
         targetDate.setDate(today.getDate() - 7);
         break;
       case 'lastMonth':
         targetDate.setMonth(today.getMonth() - 1);
         break;
     }

     return {
       date: targetDate,
       originalExpression: match.text,
       confidence: match.confidence,
       isRelative: true
     };
   }
   ```

3. **Time of Day Processing**:
   - Extract time expressions from text
   - Map to standardized time periods
   - Combine with date information
   - Handle ambiguous time references

### Phase 2: Description Cleaning

4. **Description Extraction Logic**:
   ```typescript
   extractDescription(text: string, parsedElements: ParsedElements): DescriptionResult {
     let cleanedText = text;
     const removedElements: string[] = [];

     // Remove parsed amounts
     if (parsedElements.amount) {
       cleanedText = this.removeAmountText(cleanedText, parsedElements.amount);
       removedElements.push('amount');
     }

     // Remove transaction type keywords
     if (parsedElements.type) {
       cleanedText = this.removeTypeKeywords(cleanedText, parsedElements.type);
       removedElements.push('type keywords');
     }

     // Remove date expressions
     if (parsedElements.date) {
       cleanedText = this.removeDateExpressions(cleanedText, parsedElements.date);
       removedElements.push('date expressions');
     }

     // Clean up remaining text
     const finalDescription = this.cleanupDescription(cleanedText);

     return {
       description: finalDescription,
       originalText: text,
       cleanedText,
       confidence: this.calculateDescriptionConfidence(finalDescription),
       removedElements
     };
   }
   ```

5. **Smart Text Cleanup**:
   - Remove filler words ("uhm", "à", "thì")
   - Clean up extra whitespace
   - Preserve meaningful context
   - Handle sentence fragments

6. **Context Preservation**:
   - Keep location references
   - Preserve merchant/vendor names
   - Maintain purpose/reason context
   - Handle proper nouns correctly

### Phase 3: Vietnamese Language Processing

7. **Vietnamese Date Expression Handling**:
   ```typescript
   private findVietnameseDatePatterns(text: string): DateMatch[] {
     const patterns = [
       { regex: /\b(hôm qua|ngày qua)\b/gi, type: 'yesterday', confidence: 0.9 },
       { regex: /\b(tuần trước|tuần qua)\b/gi, type: 'lastWeek', confidence: 0.8 },
       { regex: /\b(tháng trước|tháng qua)\b/gi, type: 'lastMonth', confidence: 0.8 }
     ];

     return this.matchDatePatterns(text, patterns);
   }
   ```

8. **Vietnamese Description Processing**:
   - Handle Vietnamese sentence structure
   - Process compound descriptions
   - Clean Vietnamese-specific filler words
   - Preserve important Vietnamese context

9. **Mixed Language Handling**:
   - Process Vietnamese-English mixed text
   - Handle code-switching appropriately
   - Preserve brand names and proper nouns
   - Maintain natural language flow

### Phase 4: Advanced Features & Validation

10. **Date Validation**:
    ```typescript
    private validateExtractedDate(date: Date, originalText: string): boolean {
      // Check if date is reasonable (not too far in past/future)
      const now = new Date();
      const daysDiff = Math.abs((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff > 365) return false; // More than a year difference
      if (date > now && daysDiff > 7) return false; // Future dates limited

      return true;
    }
    ```

11. **Description Quality Assessment**:
    - Length validation (not too short/long)
    - Meaningfulness check
    - Context preservation validation
    - Readability assessment

12. **Error Handling**:
    - Invalid date expressions
    - Ambiguous time references
    - Empty descriptions after cleanup
    - Malformed input handling

## Manual Testing Checklist

### Vietnamese Date Expressions
- [ ] "hôm qua" → yesterday's date
- [ ] "sáng nay" → today (morning)
- [ ] "tuần trước" → last week's date
- [ ] "tháng qua" → last month's date
- [ ] "chiều mai" → tomorrow (afternoon)

### English Date Expressions
- [ ] "yesterday" → yesterday's date
- [ ] "this morning" → today (morning)
- [ ] "last week" → last week's date
- [ ] "yesterday evening" → yesterday (evening)
- [ ] "two days ago" → date minus 2 days

### Description Cleaning
- [ ] "chi 50k mua cơm hôm qua" → "mua cơm" (amount, date removed)
- [ ] "received salary 5 triệu" → "salary" (type, amount removed)
- [ ] "ăn phở ở quán gần nhà" → "ăn phở ở quán gần nhà" (preserved)
- [ ] "uhm mua bánh à" → "mua bánh" (fillers removed)
- [ ] "grab đi làm sáng nay" → "grab đi làm" (time removed)

### Mixed Language Processing
- [ ] "buy cơm trưa" → "buy cơm trưa"
- [ ] "coffee highland yesterday" → "coffee highland"
- [ ] "mua iphone mới" → "mua iphone mới"
- [ ] "grab food 30k" → "grab food"

### Edge Cases
- [ ] Only amount: "50k" → "" (empty description)
- [ ] Only date: "hôm qua" → "" (empty description)
- [ ] Multiple dates: uses first/most relevant
- [ ] Ambiguous dates → lower confidence score
- [ ] Very long descriptions → appropriately truncated

### Time of Day
- [ ] "sáng nay" → today, morning
- [ ] "chiều qua" → yesterday, afternoon
- [ ] "tối mai" → tomorrow, evening
- [ ] "đêm hôm qua" → yesterday, night
- [ ] "buổi trưa" → today, afternoon

## Acceptance Criteria for Task

- Date/time extraction accurate for Vietnamese expressions
- Description cleaning preserves meaningful content
- Mixed language processing handles common patterns
- Relative dates converted to absolute dates correctly
- Text cleanup maintains readability and context
- Ready for integration with transaction store