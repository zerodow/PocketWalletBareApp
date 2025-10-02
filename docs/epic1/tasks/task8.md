# Task 8: Mobile Export CSV

## Overview

Implement local-only CSV export functionality for transactions with date filtering and share capabilities. All export operations work entirely offline using local database.

## Tasks

- [ ] Settings → Export transactions → share sheet
- [ ] Local file generation and validation

## Acceptance Criteria

- Export option is accessible from Settings screen
- Date range selection for export (from/to dates)
- CSV export includes all relevant transaction fields
- CSV format follows standard conventions (headers, proper escaping)
- Share sheet integration allows multiple sharing options
- Export works offline using local database
- Progress indicator for large exports
- Proper error handling for export failures
- CSV includes: date, type, amount, category, note, currency
- Date format is consistent and readable
- Amount format handles decimal precision correctly
- Category names are included (not just IDs)
- UTF-8 encoding for Vietnamese characters

## Priority

Medium

## Process

0%

## Estimated Time

4-6 hours

## Dependencies

- Task 2 (Database & Models) completed for transaction data access
- Task 5 (Categories) completed for category names in exports

## Libraries to Install

- `react-native-share` (for share sheet functionality)
- `react-native-fs` (for file system operations)
- `date-fns` (for date formatting and manipulation)
- `papaparse` or similar (for robust CSV generation)

## Implementation Details

### 1) Screens & Components

- **Export Settings Screen**:
  - `ExportScreen`: Main export interface with date range selection
  - Date range picker (from/to dates) with presets (this month, last month, etc.)
  - Export format selection (CSV initially, expandable for future formats)
  - Export progress indicator and status messages

- **Export Components**:
  - `DateRangePicker`: Reusable date selection component
  - `ExportPreview`: Shows estimated export size and record count
  - `ExportProgressModal`: Progress indicator for large exports
  - `ExportSuccessModal`: Success confirmation with share options

### 2) Navigation

- Entry point: "Export Data" option in Settings screen
- The `ExportScreen` should be a modal or separate screen from settings
- Return to settings after successful export or user cancellation

### 3) State Management (Zustand)

- `exportStore` (or extend existing stores):
  - State: `dateRange`, `isExporting`, `exportProgress`, `lastExport`
  - Actions: `setDateRange`, `startExport`, `cancelExport`, `updateProgress`
  - Selectors: `getTransactionsForExport`, `getExportEstimate`

### 4) Database & Models

- **Export Queries**:
  - Transaction selection with date filtering:
    ```sql
    SELECT t.*, c.name as categoryName
    FROM transactions t
    LEFT JOIN categories c ON t.categoryId = c.id
    WHERE t.date BETWEEN ? AND ?
    AND t.deletedAt IS NULL
    ORDER BY t.date DESC
    ```
  - Export metadata for tracking:
    ```sql
    CREATE TABLE export_history (
      id TEXT PRIMARY KEY,
      exportType TEXT NOT NULL,
      dateRange TEXT NOT NULL,
      recordCount INTEGER NOT NULL,
      exportedAt INTEGER NOT NULL,
      fileSize INTEGER,
      checksum TEXT
    );
    ```

### 5) CSV Export Service

- **CSV Generation**:
  - Use streaming approach for memory efficiency with large datasets
  - Proper CSV escaping for special characters (commas, quotes, newlines)
  - UTF-8 encoding for Vietnamese characters
  - Standardized date format (ISO 8601 or Vietnamese locale preference)

- **CSV Format Specification**:
  ```csv
  Date,Type,Amount,Currency,Category,Note
  2023-12-01,Expense,50000,VND,Ăn uống,"Cơm trua"
  2023-12-01,Income,1000000,VND,Thu nhập,"Lương tháng"
  ```

- **File Management**:
  - Generate temporary files in app's documents directory
  - Clean up temporary files after sharing or on app start
  - File naming convention: `transactions_YYYY-MM-DD_to_YYYY-MM-DD.csv`

### 6) UX & Performance

- **Progress Tracking**:
  - Show progress indicator for exports >1000 records
  - Allow cancellation of long-running exports
  - Estimate completion time based on record count

- **Error Handling**:
  - Graceful handling of low storage space
  - Network-independent operation (offline exports)
  - User-friendly error messages with retry options

- **Share Integration**:
  - Native share sheet with multiple sharing options
  - Preview of file size and record count before export
  - Option to save to device or share directly

### 7) Testing

- **Unit**:
  - CSV generation and escaping logic
  - Date range validation and filtering
  - File creation and cleanup
  - Memory usage with large datasets
- **Integration**:
  - End-to-end export flow from settings to sharing
  - Various date range selections and edge cases
  - Export with different data sizes (0 records, 1000+ records)
  - Share sheet integration and file access
- **Manual**:
  - Vietnamese character encoding in exports
  - Large dataset performance and memory usage
  - Share functionality across different apps
  - File integrity verification

## Development Workflow

### Before Starting
1. Create a new feature branch: `git checkout -b feat/task8-mobile-export-csv`
2. Start development work

### When Complete
1. Commit all changes with descriptive messages
2. Push branch to remote repository
3. Create PR using GitHub MCP: Use `mcp__github__create_pull_request` to create PR targeting `dev` branch
4. Add comprehensive PR description with implementation details and test results

## Implementation Steps

### Phase 1: Setup & Core Services

1. **Install Dependencies**: Add required libraries for file operations and sharing.
   * `yarn add react-native-share react-native-fs date-fns papaparse`
   * Follow platform-specific setup for react-native-fs
2. **Create Export Service**:
   * `app/services/exportService.ts`: Core CSV generation and file management
   * `app/services/csvGenerator.ts`: Streaming CSV creation with proper escaping
3. **Update Database Schema**:
   * Add `export_history` table for tracking exports (optional)
   * Create query functions for filtered transaction exports
4. **Create Export Store**:
   * `app/store/exportStore.ts`: State management for export process

### Phase 2: UI Implementation

5. **Create Export Screen**:
   * `app/screens/ExportScreen.tsx`: Main export interface
   * Date range selection with preset options
   * Export preview showing estimated records and file size
6. **Build Export Components**:
   * `app/components/export/DateRangePicker.tsx`: Reusable date selection
   * `app/components/export/ExportProgressModal.tsx`: Progress tracking UI
   * `app/components/export/ExportPreview.tsx`: Export estimation display
7. **Implement Navigation Integration**:
   * Add export option to Settings screen
   * Navigate to ExportScreen with proper modal/stack navigation
8. **Create Export Flow**:
   * Implement the complete export process from selection to sharing
   * Handle progress updates and cancellation
   * Integrate native share sheet functionality

### Phase 3: Polish & Testing

9. **Implement Advanced Features**:
   * Streaming export for large datasets to prevent memory issues
   * File cleanup and management
   * Export history tracking (optional)
   * Checksum verification for data integrity (optional)
10. **Error Handling & Edge Cases**:
    * Handle low storage space scenarios
    * Manage export cancellation gracefully
    * Provide clear error messages and recovery options
11. **Testing & Optimization**:
    * Test with various data sizes and date ranges
    * Verify Vietnamese character encoding
    * Performance testing with 1000+ transactions
    * Cross-platform file sharing verification

## Optional Features (Future Enhancements)

- Multiple export formats (JSON, Excel)
- Email export integration
- Export statistics summary
- Scheduled/recurring exports
- Import functionality with checksum verification
- Export templates and custom field selection
