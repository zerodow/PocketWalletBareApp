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
- **State Management**: Zustand (with MMKV persistence via `zustandStorage`)
- **Navigation**: React Navigation v7 (native-stack + bottom-tabs)
- **Storage**: react-native-mmkv (encrypted with key in `storage.ts`)
- **Styling**: Custom theme system with light/dark mode support
- **Forms**: react-hook-form
- **Internationalization**: i18next + react-i18next
- **Animations**: react-native-reanimated + react-native-worklets
- **HTTP Client**: axios
- **Date Utilities**: date-fns
- **Number Formatting**: numeral

### Project Structure
```
src/
├── assets/         # Static resources
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── navigator/      # Navigation configuration
├── screens/        # Screen components (e.g., Login)
├── stores/         # Zustand stores
├── theme/          # Theming system
│   ├── ThemeProvider.tsx  # Context provider for theme
│   ├── createTheme.ts     # Theme factory
│   ├── token.ts           # Design tokens
│   ├── typography.ts      # Typography definitions
│   └── types.ts           # Theme TypeScript types
└── utils/          # Utility functions
    ├── makeStyles.ts      # Theme-aware styling hook
    ├── storage.ts         # MMKV storage utilities
    ├── constant.ts        # App constants
    └── helper.ts          # Helper functions
```

### Import Aliases
TypeScript path aliases are configured:
- `@/*` → `src/*`
- `assets/*` → `./assets/*`

### Theming System
The app uses a custom theming system supporting light/dark modes:
- **ThemeProvider**: Wraps the app and provides theme context via `useTheme()`
- **makeStyles**: Factory function to create theme-aware styles
  ```tsx
  const useStyles = makeStyles((theme) => ({
    container: {
      backgroundColor: theme.colors.background,
    }
  }));
  ```
- Theme switches automatically based on system settings or can be forced via `forceMode` prop

### Storage & Persistence
- Uses MMKV for fast, encrypted storage
- Storage instance: `storage` (from `utils/storage.ts`)
- Encryption key is hardcoded in `storage.ts:12`
- Zustand stores can persist via `zustandStorage` middleware
- Utilities: `loadString`, `saveString`, `load`, `save`, `loadBoolean`, `saveBoolean`, `remove`, `clear`

## Code Conventions

### Babel Configuration
- Uses `@react-native/babel-preset`
- `react-native-worklets/plugin` is enabled for Reanimated worklets

### TypeScript
- Config extends `@react-native/typescript-config`
- Excludes `node_modules` and `Pods` directories

### ESLint
- Extends `@react-native` config

### Testing
- Jest is configured with `react-native` preset
- Test runner: `yarn test`

## Native Dependencies

### iOS Specific
- Use Ruby bundler: `bundle install` then `bundle exec pod install`
- Pods are managed via CocoaPods
- Info.plist has been modified (per git status)

### Android Specific
- MainActivity.kt has been modified (per git status)

## Important Notes

- **Node Version**: Requires Node.js >= 20
- **Package Manager**: Uses Yarn (yarn.lock present)
- **Worklets**: react-native-worklets plugin is required for Reanimated animations
- **Storage Security**: The MMKV encryption key in `storage.ts` should be secured/rotated in production
