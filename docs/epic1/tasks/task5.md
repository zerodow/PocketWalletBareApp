# Task 5: Mobile Categories UI/UX

## Overview

Implement a comprehensive category management system with local-only functionality, including seeding default Vietnamese categories, allowing users to create and manage their own custom categories, and integrating them seamlessly into the transaction workflow.

## Tasks

- [ ] Seed ≥10 default categories with Vietnamese context.
- [ ] Create a screen to list all categories (default and custom).
- [ ] Implement functionality to add new custom categories.
- [ ] Implement functionality to edit existing custom categories.
- [ ] Assign an icon or emoji to each category.
- [ ] Implement sorting/reordering of categories.
- [ ] Integrate categories with the transaction creation/editing flow.

## Acceptance Criteria

- [ ] At least 10 default categories relevant to Vietnamese users are seeded on first app launch.
- [ ] The category list screen displays all available categories, clearly distinguishing between default and custom ones.
- [ ] Users can successfully create new custom categories with a name and an icon/emoji.
- [ ] Users can edit the name and icon/emoji of existing custom categories. Default categories are not editable.
- [ ] Each category is visually represented by an icon or emoji.
- [ ] Users can reorder their categories, and the new order is persisted.
- [ ] Category names are localized for a Vietnamese context.
- [ ] Input validation prevents duplicate category names and enforces length limits.
- [ ] The selected category is correctly associated with a transaction during creation and editing.
- [ ] The system works purely local with instant responses and no sync dependencies.

## Priority

High

## Process

100% - COMPLETED

## Estimated Time

6-8 hours

## Dependencies

- Task 2 (Database & Models) completed (local DB + models available)
- Task 4 (Transactions UI) for integration with `QuickAddScreen` and `TransactionDetailScreen`

## Libraries to Install

- `react-native-draggable-flatlist` (for reordering categories)
- `react-native-vector-icons` or an emoji picker library if not already present.

## Implementation Details

### 1) Screens & Components

- `CategoryListScreen`:
  - Displays a list of all categories (default and custom).
  - Draggable list items for reordering (`react-native-draggable-flatlist`).
  - Action to add a new category (e.g., FAB or header button).
  - Tapping a custom category navigates to `CategoryEditScreen`.

- `CategoryEditScreen` (can be a modal or a full screen):
  - Form fields for category name and icon/emoji picker.
  - "Save" and "Cancel" actions.
  - "Delete" action for custom categories.

- Reusable UI components:
  - `CategoryListItem`: Renders a single category with its icon, name, and drag handle.
  - `IconPicker`/`EmojiPicker`: A modal or component to select an icon/emoji.

### 2) Navigation

- Entry point: Add a "Categories" or "Manage Categories" button in the app's settings or main menu to navigate to `CategoryListScreen`.
- The `CategoryListScreen` should navigate to `CategoryEditScreen` for creating or editing a category.

### 3) State Management (Zustand)

- `categoryStore` (or similar):
  - Holds the list of all categories, fetched from the database.
  - Actions: `addCategory`, `updateCategory`, `deleteCategory`, `reorderCategories`.
  - These actions will interact with the local database only with instant updates.

### 4) Database & Models

- **Category Model**:
  - `id` (string, UUID)
  - `name` (string)
  - `icon` (string, e.g., emoji or icon name)
  - `sortOrder` (number)
  - `isDefault` (boolean, to distinguish default from custom categories)
  - `createdAt`, `updatedAt` (timestamps for local tracking)
  - `deletedAt`: `number|null` (for soft deletes of custom categories)

- **Seeding Default Categories**:
  - On first app launch, populate the database with a list of default categories. This should be idempotent.
  - Default Vietnamese categories:
    - Ăn uống (Food & Dining)
    - Đi lại (Transportation)
    - Mua sắm (Shopping)
    - Tiền nhà (Housing/Rent)
    - Điện nước (Utilities)
    - Y tế (Healthcare)
    - Giải trí (Entertainment)
    - Giáo dục (Education)
    - Tiết kiệm (Savings)
    - Thu nhập (Income)

- **CRUD Operations**:
  - **Create**: Add a new category record to the local DB instantly with immediate UI feedback.
  - **Update**: Update the local record (`name`, `icon`, `sortOrder`) with instant response.
  - **Delete**: Soft-delete a custom category by setting `deletedAt` with immediate UI update. Default categories cannot be deleted.

### 5) UX & Performance

- Use `react-native-draggable-flatlist` for smooth drag-and-drop reordering.
- Provide clear visual feedback for drag operations.
- Distinguish visually between default and custom categories (e.g., custom ones might have an edit icon).
- Pre-load categories into the store for fast access in transaction screens.

### 6) Testing

- **Unit**:
  - Validation logic for category names (uniqueness, length).
- **Integration**:
  - Create a custom category, see it appear in the list and in the `QuickAddScreen`.
  - Edit a custom category and verify the change is reflected.
  - Reorder categories and check if the order is saved and reflected.
  - Try to edit or delete a default category (should fail or be disallowed by the UI).
- **Manual**:
  - Test drag-and-drop on both iOS and Android.
  - Verify the default Vietnamese categories are seeded correctly.

## Development Workflow

### Before Starting
1. Create a new feature branch: `git checkout -b feat/task5-mobile-categories-ui-ux`
2. Start development work

### When Complete
1. Commit all changes with descriptive messages
2. Push branch to remote repository
3. Create PR using GitHub MCP: Use `mcp__github__create_pull_request` to create PR targeting `dev` branch
4. Add comprehensive PR description with implementation details and test results

## Implementation Steps

### Phase 1: Scaffolding & Seeding

1.  **Install Dependencies**: Add libraries for drag-and-drop functionality.
    *   `yarn add react-native-draggable-flatlist`
2.  **Update Database Schema**:
    *   Modify `app/database/schema.ts` to include a `categories` table with fields like `name`, `icon`, `sortOrder`, `isDefault`, `deletedAt`.
    *   Add a new migration in `app/database/migrations.ts`.
3.  **Implement Seeding Logic**:
    *   In `app/services/appInitService.ts` or a similar startup file, add a function to seed the default categories if they don't already exist.
4.  **Create Files**: Scaffold the new screens.
    *   `app/screens/CategoryListScreen.tsx`
    *   `app/screens/CategoryEditScreen.tsx`
5.  **Update Navigation**:
    *   Add routes for `CategoryList` and `CategoryEdit` to `app/navigators/MainNavigator.tsx`.
    *   Add a navigation entry point (e.g., in a settings screen).

### Phase 2: State and UI Implementation

6.  **Create Zustand Store**:
    *   `app/store/categoryStore.ts`: To manage category state and interactions with the database.
7.  **Implement Category List Screen**:
    *   Fetch and display categories from the store.
    *   Use `react-native-draggable-flatlist` to render the list and handle reordering.
    *   Connect the "add" button to navigate to the `CategoryEditScreen`.
8.  **Implement Category Edit Screen**:
    *   Build the form for creating/editing a category.
    *   Implement "Save" to call the appropriate store action (`addCategory` or `updateCategory`).
    - Implement "Delete" for custom categories.

### Phase 3: Integration & Final Touches

9.  **Integrate with Transaction Screens**:
    *   Modify `app/screens/QuickAddScreen.tsx` and `app/components/CategoryChips.tsx` to use the categories from the `categoryStore`.
    *   Ensure that creating/editing a transaction correctly links to the selected category.
10. **Polish Local Operations**:
    *   Ensure all CRUD operations provide immediate feedback and work seamlessly offline.
11. **Testing**:
    *   Perform manual and integration testing as described in the "Testing" section above.
