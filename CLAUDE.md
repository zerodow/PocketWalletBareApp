# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**PocketWalletBareApp** is a React Native mobile application (v0.81.4) for managing personal finances. The app uses React 19.1.0 and supports both iOS and Android platforms.

## Development Commands

### Installation
```bash
# Install dependencies
yarn install

# iOS: Install CocoaPods dependencies
bundle install
bundle exec pod install
```

### Running the App
```bash
# Start Metro bundler
yarn start

# Start with cache reset (use after changing Babel config)
yarn start --reset-cache

# Run on Android
yarn android

# Run on iOS
yarn ios
```

### Code Quality
```bash
# Lint the codebase
yarn lint

# Run tests
yarn test
```

## Architecture

### Technology Stack
- **Database**: WatermelonDB with SQLite adapter (JSI enabled for performance)
- **State Management**: Zustand (with MMKV persistence via `zustandStorage`)
- **Navigation**: React Navigation v7 (native-stack + bottom-tabs)
- **Storage**: react-native-mmkv (encrypted with key in `storage.ts`)
- **Styling**: Custom theme system with light/dark mode support
- **Forms**: react-hook-form
- **Internationalization**: i18next + react-i18next (supports en/vi, RTL-aware)
- **Animations**: react-native-reanimated + react-native-worklets
- **HTTP Client**: axios
- **Date Utilities**: date-fns
- **Number Formatting**: numeral
- **Locale**: expo-localization

### Project Structure
```
src/
├── assets/         # Static resources
├── components/     # Reusable UI components (e.g., Toast)
├── database/       # WatermelonDB setup
│   ├── index.ts           # Database instance & exports
│   ├── schema.ts          # Database schema definition
│   ├── migrations.ts      # Database migrations
│   ├── queries.ts         # Reusable database queries
│   ├── models/            # WatermelonDB model classes
│   └── performanceMonitor.ts
├── hooks/          # Custom React hooks
├── i18n/           # Internationalization setup
│   ├── index.ts           # i18n initialization (initI18n)
│   ├── en.ts              # English translations
│   ├── vi.ts              # Vietnamese translations
│   └── translate.ts       # Translation utilities
├── navigator/      # Navigation configuration
│   ├── AppNavigator.tsx   # Main navigator component
│   ├── types.ts           # Navigation type definitions
│   ├── config.ts          # Screen options & SCREEN_NAME constants
│   └── navigationUtilities.ts  # Navigation helpers (navigate, goBack, etc.)
├── screens/        # Screen components (e.g., Login)
├── services/       # Business logic & app services
│   ├── appInitService.ts       # App initialization & hydration
│   ├── authService.ts          # Authentication logic
│   ├── categorySeedService.ts  # Default category seeding
│   ├── devDataSeedService.ts   # DEV mock data seeding
│   ├── settingsService.ts      # Settings management
│   ├── statisticsService.ts    # Statistics calculations
│   ├── statisticsObserver.ts   # Statistics auto-update
│   └── api/                    # API client setup
├── store/          # Zustand stores
│   ├── appStore.ts             # App-wide state (auth, theme, language)
│   ├── transactionDraftStore.ts
│   └── syncStore.ts
├── theme/          # Theming system
│   ├── ThemeProvider.tsx  # Context provider for theme
│   ├── createTheme.ts     # Theme factory
│   ├── token.ts           # Design tokens (spacing, colors, elevation)
│   ├── typography.ts      # Typography definitions
│   └── types.ts           # Theme TypeScript types
└── utils/          # Utility functions
    ├── makeStyles.ts      # Theme-aware styling hook
    ├── storage.ts         # MMKV storage utilities
    ├── constant.ts        # App constants (Z_INDEX, dimensions, etc.)
    └── helper.ts          # Helper functions (makeHitSlop, delay, etc.)
```

### Import Aliases
Configured in both `tsconfig.json` (for TypeScript) and `babel.config.js` (for runtime):
- `@/*` → `src/*`
- `assets/*` → `./assets/*`

**Important**: When modifying path aliases in `babel.config.js`, restart Metro with `yarn start --reset-cache`

### Database Layer (WatermelonDB)

The app uses WatermelonDB for local-first data persistence with SQLite:

- **Models**: `Category`, `Transaction`, `MonthlyStatistics`, `DailyStatistics`, `CategoryStatistics`
- **Database instance**: Exported from `src/database/index.ts`
- **JSI mode**: Enabled for maximum performance on iOS/Android
- **Migrations**: Managed in `src/database/migrations.ts`
- **Queries**: Common queries in `src/database/queries.ts`

### Navigation Architecture

Navigation uses a hybrid stack/tab structure:

- **PublicStackParamList**: Unauthenticated screens (Login)
- **AppStackParamList**: Main app (contains Tabs)
- **BottomTabParamList**: Tab navigator (Home, InventoryHubList, Profile)
- **ProfileStackParamList**: Nested stack within Profile tab

Navigation utilities in `navigationUtilities.ts`:
- `navigationRef` - Access navigation outside components
- `navigate(name, params)` - Navigate programmatically
- `goBack()` - Go back if possible
- `switchToTab(name)` - Reset to specific tab
- `resetRoot(state)` - Reset navigation state

### Theming System

Custom theme system supporting light/dark modes with design tokens:

**Usage Pattern**:
```tsx
import { makeStyles } from '@/utils/makeStyles';

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    elevation: theme.elevation.level2,
  },
  title: {
    color: theme.colors.onSurface,
    fontFamily: theme.typography.family.semiBold,
    fontSize: theme.typography.size.title,
  }
}));

// In component:
const styles = useStyles();
```

**Design Tokens** (from `token.ts`):
- `spacing`: xxxs(2) to xxxl(40) - 8pt grid system
- `radius`: sm(4) to pill(999)
- `elevation`: level0 to level4
- `duration`: fast(120ms), normal(200ms), slow(320ms)
- `colors`: Separate light/dark palettes with Material Design naming

**Theme access**: Use `useTheme()` hook to get current theme object

### State Management (Zustand)

Stores are located in `src/store/`:

**appStore.ts** - Main app state:
- Auth state: `isAuthenticated`, `user`
- Settings: `themeMode`, `language`, `currencyCode`, `defaultTxType`
- Hydration: `isHydrated` flag
- Actions: `setAuthState`, `clearAuthState`, `setThemeMode`, etc.

Stores use MMKV persistence via `zustandStorage` middleware from `utils/storage.ts`.

### App Initialization Flow

On app startup, `appInitService.initializeApp()` runs:
1. Hydrates auth state from MMKV storage
2. Hydrates settings from storage
3. Seeds default categories (idempotent)
4. **DEV only**: Seeds mock transactions via `devDataSeedService`
5. Sets `isHydrated: true` in appStore

This service should be called early in the app lifecycle.

### Internationalization (i18n)

- **Initialization**: Call `initI18n()` from `src/i18n/index.ts` on app startup
- **Supported locales**: English (en), Vietnamese (vi)
- **RTL support**: Automatically enabled based on device locale
- **System locale**: Auto-detected via `expo-localization`
- **Translations**: Stored in `src/i18n/en.ts` and `src/i18n/vi.ts`
- **Type-safe keys**: Use `TxKeyPath` type for translation keys

### Storage & Persistence

**MMKV Storage** (`utils/storage.ts`):
- Encrypted with hardcoded key (line 12)
- Storage instance: `storage`
- Functions: `loadString`, `saveString`, `load<T>`, `save`, `loadBoolean`, `saveBoolean`, `remove`, `clear`
- Zustand adapter: `zustandStorage`

**Storage Keys** (constants in `storage.ts`):
- `KEYCHAIN_PASSKEY`: 'mmkv'
- `USER_ROLE`: 'user_role'
- `DEBUG_MODE`: 'app_debug_mode'

### Services Layer

Services contain business logic separated from UI:

- **appInitService**: App startup & hydration orchestration
- **authService**: Authentication state management
- **categorySeedService**: Ensures default categories exist
- **devDataSeedService**: Creates mock data (DEV only)
- **settingsService**: User preferences management
- **statisticsService**: Financial statistics calculations
- **statisticsObserver**: Auto-updates statistics on data changes

## Code Conventions

### Babel Configuration
- Uses `@react-native/babel-preset`
- Plugins:
  - `react-native-worklets/plugin` for Reanimated
  - `babel-plugin-module-resolver` for `@/*` path aliases

### TypeScript
- Extends `@react-native/typescript-config`
- Excludes `node_modules` and `Pods`
- Path aliases must match Babel config

### ESLint
- Extends `@react-native` config

### Testing
- Jest with `react-native` preset
- Run: `yarn test`

### Constants
Use constants from `utils/constant.ts`:
- `LANGUAGE_NAME`: Language codes
- `isIOS`: Platform check
- `deviceWidth`, `deviceHeight`: Screen dimensions
- `Z_INDEX`: Z-index layers (HEADER:10, MODAL:1000, LOADING:10000, etc.)
- `DATE_FORMAT`: 'D/M/YYYY'
- Layout constants: `HEADER_HEIGHT`, `BOTTOM_SPACE`, `COMMON_SHEET_HEIGHT`

## Native Dependencies

### iOS Specific
- Use Ruby bundler: `bundle install` then `bundle exec pod install`
- Pods are managed via CocoaPods
- WatermelonDB requires native setup
- Info.plist has been modified

### Android Specific
- MainActivity.kt has been modified
- WatermelonDB requires native setup

## Important Notes

- **Node Version**: Requires Node.js >= 20
- **Package Manager**: Uses Yarn (yarn.lock present)
- **Worklets**: `react-native-worklets/plugin` must be in Babel config for Reanimated
- **Storage Security**: MMKV encryption key in `storage.ts:12` should be secured/rotated in production
- **DEV Data**: Mock data is auto-seeded in `__DEV__` mode via `devDataSeedService`
- **Database**: WatermelonDB uses JSI for native performance - don't disable it
- **Metro Cache**: Clear with `yarn start --reset-cache` after native dependency or Babel config changes
