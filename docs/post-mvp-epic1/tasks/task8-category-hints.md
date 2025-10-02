# Task 8: Category Hints Extraction

## Overview

Implement functionality to extract category hints from transaction descriptions in Vietnamese speech. This task analyzes keywords and context to suggest appropriate transaction categories based on common Vietnamese spending patterns.

## Tasks

- [ ] Implement extractCategoryHints() function
- [ ] Create keyword-to-category mapping for Vietnamese transactions
- [ ] Support common Vietnamese transaction categories
- [ ] Basic category suggestion logic
- [ ] Handle multiple potential categories and rank by relevance

## Acceptance Criteria

### Category Recognition

- Recognizes food/dining keywords (cơm, phở, nhà hàng, quán)
- Identifies transportation terms (taxi, xe buýt, xăng, grab)
- Detects shopping categories (quần áo, giày, mỹ phẩm)
- Recognizes utility payments (điện, nước, internet, điện thoại)
- Identifies entertainment/leisure activities

### Keyword Mapping

- Comprehensive Vietnamese category keyword database
- Context-aware category suggestions
- Support for brand names and location types
- Handle abbreviations and slang terms
- Regional variation support where applicable

### Suggestion Logic

- Returns multiple category suggestions ranked by relevance
- Confidence scoring for each category suggestion
- Handles overlapping categories appropriately
- Provides fallback categories for unclear input
- Considers transaction amount for category likelihood

## Priority

Medium-High

## Process

0%

## Estimated Time

6-8 hours

## Dependencies

- Task 7: Transaction Type Detection completed
- Understanding of Vietnamese consumer spending categories
- Knowledge of common Vietnamese brands and locations

## Libraries to Install

- None (pure JavaScript/TypeScript implementation)

## Implementation Details

### 1) Category Hint Interface

- **Category Extraction Interface**:
  ```typescript
  interface CategoryHint {
    category: string;
    confidence: number;
    matchedKeywords: string[];
    reasoning: string;
  }

  interface CategoryExtractionResult {
    hints: CategoryHint[];
    primaryCategory?: string;
    fallbackCategory?: string;
  }

  function extractCategoryHints(text: string, amount?: number): CategoryExtractionResult;
  ```

### 2) Vietnamese Category Mapping

- **Category Database**:
  ```typescript
  const CATEGORY_KEYWORDS = {
    food: {
      vietnamese: ['cơm', 'phở', 'bánh', 'bún', 'chè', 'trà', 'cà phê', 'nhà hàng', 'quán'],
      brands: ['highland', 'starbucks', 'kfc', 'lotteria', 'pizza hut'],
      locations: ['food court', 'chợ', 'siêu thị']
    },
    transportation: {
      vietnamese: ['taxi', 'grab', 'xe buýt', 'xe ôm', 'xăng', 'dầu', 'vé tàu'],
      brands: ['grab', 'gojek', 'be', 'mai linh'],
      contexts: ['đi làm', 'về nhà', 'sân bay']
    },
    shopping: {
      vietnamese: ['mua', 'quần áo', 'giày', 'túi', 'mỹ phẩm', 'điện thoại'],
      brands: ['zara', 'uniqlo', 'h&m', 'guardian', 'watson'],
      locations: ['mall', 'trung tâm', 'shop']
    }
  };
  ```

### 3) Context Analysis System

- **Amount-Based Category Scoring**:
  - Small amounts (< 100k) favor food/transport
  - Medium amounts (100k-1M) favor shopping/entertainment
  - Large amounts (> 1M) favor utilities/rent/major purchases

## Development Workflow

### Before Starting
1. Create feature branch: `git checkout -b feat/category-hints-extraction`
2. Start development work

### When Complete
1. Commit changes with descriptive messages
2. Push branch to remote repository
3. Create PR targeting `dev` branch
4. Add comprehensive PR description

## Implementation Steps

### Phase 1: Category Database Setup

1. **Extend SpeechParser Class**:
   ```typescript
   // app/utils/voice/speechParser.ts
   export class SpeechParser {
     private categoryDatabase = new CategoryDatabase();

     extractCategoryHints(text: string, amount?: number): CategoryExtractionResult {
       const normalizedText = this.normalizeText(text);
       const keywordMatches = this.findCategoryKeywords(normalizedText);
       const hints = this.generateCategoryHints(keywordMatches, amount);

       return {
         hints: hints.sort((a, b) => b.confidence - a.confidence),
         primaryCategory: hints[0]?.category,
         fallbackCategory: this.getFallbackCategory(text, amount)
       };
     }
   }
   ```

2. **Build Category Database**:
   - Comprehensive Vietnamese keyword lists
   - Brand name recognition
   - Location type mapping
   - Common abbreviations and slang

3. **Keyword Matching System**:
   - Fuzzy matching for similar words
   - Multiple keyword combinations
   - Context-dependent matching
   - Weighted keyword importance

### Phase 2: Vietnamese Category Implementation

4. **Food & Dining Categories**:
   ```typescript
   private analyzeFoodKeywords(text: string): CategoryHint[] {
     const foodPatterns = [
       { pattern: /\b(cơm|phở|bún|bánh)\b/gi, weight: 0.9, category: 'food' },
       { pattern: /\b(nhà hàng|quán|coffee|cà phê)\b/gi, weight: 0.8, category: 'dining' },
       { pattern: /\b(ăn sáng|ăn trưa|ăn tối)\b/gi, weight: 0.7, category: 'food' }
     ];

     return this.matchPatterns(text, foodPatterns);
   }
   ```

5. **Transportation Categories**:
   - Vehicle types (taxi, xe buýt, xe máy)
   - Ride-sharing brands (Grab, Be, GoJek)
   - Fuel and maintenance terms
   - Public transportation terms

6. **Shopping & Retail**:
   - Clothing and fashion terms
   - Electronics and gadgets
   - Personal care and cosmetics
   - Home and household items

### Phase 3: Context & Confidence Scoring

7. **Context Analysis**:
   ```typescript
   private analyzeTransactionContext(text: string, amount?: number): ContextFactors {
     return {
       timeOfDay: this.extractTimeContext(text),
       location: this.extractLocationHints(text),
       frequency: this.detectFrequencyIndicators(text),
       urgency: this.detectUrgencyKeywords(text),
       amountRange: this.categorizeAmount(amount)
     };
   }
   ```

8. **Confidence Calculation**:
   - Keyword match strength
   - Context relevance
   - Amount appropriateness for category
   - Multiple keyword reinforcement
   - Conflict resolution between categories

9. **Category Ranking**:
   - Primary category (highest confidence)
   - Secondary suggestions
   - Fallback categories for unclear cases
   - Context-based tie-breaking

### Phase 4: Advanced Features

10. **Brand Recognition**:
    - Vietnamese brand database
    - International brand localization
    - Phonetic brand matching
    - Brand-to-category mapping

11. **Location-Based Categories**:
    - Shopping mall indicators
    - Restaurant/food court terms
    - Service location types
    - Geographic context clues

12. **Seasonal & Cultural Context**:
    - Vietnamese holidays and events
    - Seasonal spending patterns
    - Cultural context indicators
    - Special occasion categories

## Manual Testing Checklist

### Food & Dining
- [ ] "ăn cơm trưa" → food (high confidence)
- [ ] "uống cà phê highland" → dining (high confidence)
- [ ] "ăn phở 50k" → food (high confidence)
- [ ] "đặt pizza" → food (medium confidence)
- [ ] "nhà hàng buffet" → dining (high confidence)

### Transportation
- [ ] "đi grab 30k" → transportation (high confidence)
- [ ] "đổ xăng 200k" → transportation (high confidence)
- [ ] "vé xe buýt" → transportation (medium confidence)
- [ ] "taxi sân bay" → transportation (high confidence)
- [ ] "grab food" → food (context override)

### Shopping & Retail
- [ ] "mua quần áo" → shopping-clothing (high confidence)
- [ ] "điện thoại mới" → electronics (high confidence)
- [ ] "mỹ phẩm watson" → shopping-beauty (high confidence)
- [ ] "giày nike" → shopping-clothing (high confidence)
- [ ] "siêu thị coop" → groceries (medium confidence)

### Utilities & Services
- [ ] "trả tiền điện" → utilities (high confidence)
- [ ] "cắt tóc" → services-personal (medium confidence)
- [ ] "internet fpt" → utilities (high confidence)
- [ ] "nước tháng 3" → utilities (medium confidence)
- [ ] "sửa xe" → services-maintenance (medium confidence)

### Edge Cases & Ambiguity
- [ ] "mua cơm" → food vs groceries (context-dependent)
- [ ] "điện thoại bị hỏng" → services vs electronics
- [ ] "grab" without context → transportation (default)
- [ ] Multiple categories: "mua đồ ăn ở mall" → food + shopping
- [ ] Unknown terms → fallback category

### Confidence & Ranking
- [ ] Single strong keyword → high confidence (>0.8)
- [ ] Multiple reinforcing keywords → very high confidence (>0.9)
- [ ] Brand recognition → confidence boost
- [ ] Amount-category mismatch → confidence penalty
- [ ] Conflicting categories → lower confidence

## Acceptance Criteria for Task

- Category hint extraction accurate for Vietnamese transactions
- Comprehensive keyword database covering common spending categories
- Confidence scoring reflects suggestion quality
- Multiple category suggestions ranked appropriately
- Brand and location recognition functional
- Ready for integration with date/time extraction