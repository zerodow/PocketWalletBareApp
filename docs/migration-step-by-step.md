# Step-by-Step Migration Guide

## Prerequisites
- Node.js 20+
- React Native CLI installed globally
- Android Studio and Xcode set up
- Current project backed up

## Phase 1: New Project Creation

### Step 1: Create New Bare React Native Project
```bash
cd /Users/MinhDuc/Documents
npx react-native@latest init PocketWalletAppBare --version 0.79.4
cd PocketWalletAppBare
```

### Step 2: Copy Source Code
```bash
# Copy main application code
cp -r ../PocketWalletApp/app/ ./src/

# Copy assets
cp -r ../PocketWalletApp/assets/ ./assets/

# Copy test files
cp -r ../PocketWalletApp/.maestro/ ./.maestro/
cp -r ../PocketWalletApp/test/ ./test/

# Copy configuration files to reference
cp ../PocketWalletApp/tsconfig.json ./tsconfig.json.backup
cp ../PocketWalletApp/metro.config.js ./metro.config.js.backup
```

## Phase 2: Configuration Updates

### Step 3: Update tsconfig.json
```json
{
  "extends": "@react-native/typescript-config/tsconfig.json",
  "compilerOptions": {
    "allowJs": false,
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "jsx": "react-native",
    "module": "esnext",
    "moduleResolution": "bundler",
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "sourceMap": true,
    "target": "esnext",
    "lib": ["esnext", "dom"],
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@assets/*": ["./assets/*"]
    },
    "typeRoots": ["./node_modules/@types", "./types"]
  }
}
```

### Step 4: Update metro.config.js
```javascript
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    unstable_conditionNames: ['require', 'default', 'browser'],
    sourceExts: [...getDefaultConfig(__dirname).resolver.sourceExts, 'cjs'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

### Step 5: Update babel.config.js
```javascript
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [['@babel/plugin-proposal-decorators', {legacy: true}]],
};
```

### Step 6: Update index.js Entry Point
```javascript
import {AppRegistry} from 'react-native';
import {App} from './src/app';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
```

## Phase 3: Dependency Migration

### Step 7: Update package.json
```bash
# Remove Expo dependencies
yarn remove expo expo-secure-store expo-haptics expo-font expo-av expo-local-authentication expo-localization expo-linking expo-splash-screen expo-system-ui expo-application @expo-google-fonts/space-grotesk expo-dev-client @expo/metro-runtime babel-preset-expo jest-expo eslint-config-expo

# Add bare RN alternatives
yarn add react-native-keychain react-native-haptic-feedback react-native-video react-native-sound react-native-biometrics react-native-localize @react-native-community/linking react-native-splash-screen react-native-device-info

# Update dev dependencies
yarn add -D metro-react-native-babel-preset @react-native/eslint-config @react-native/typescript-config
```

### Step 8: Update Scripts in package.json
```json
{
  "scripts": {
    "start": "react-native start",
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "compile": "tsc --noEmit -p . --pretty",
    "lint": "eslint . --fix",
    "lint:check": "eslint .",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:maestro": "maestro test -e MAESTRO_APP_ID=com.pocketwalletapp .maestro/flows"
  }
}
```

## Phase 4: Code Updates

### Step 9: Update Secure Storage
Replace content in `src/utils/storage/_deprecated/secureStorage.ts`:
```typescript
import Keychain from 'react-native-keychain';

const TOKEN_KEY = "supabase_token"
const REFRESH_TOKEN_KEY = "supabase_refresh_token"
const PIN_KEY = "app_pin"

export const secureStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      const credentials = await Keychain.getInternetCredentials(key);
      if (credentials) {
        return credentials.password;
      }
      return null;
    } catch (error) {
      console.error("Error getting secure storage item:", error);
      return null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await Keychain.setInternetCredentials(key, key, value);
    } catch (error) {
      console.error("Error setting secure storage item:", error);
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      await Keychain.resetInternetCredentials(key);
    } catch (error) {
      console.error("Error removing secure storage item:", error);
    }
  },
};
```

### Step 10: Update Import Statements
Search and replace throughout codebase:
- `from "expo-haptics"` → `from "react-native-haptic-feedback"`
- `from "expo-linking"` → `from "@react-native-community/linking"`
- `from "expo-localization"` → `from "react-native-localize"`

## Phase 5: Native Configuration

### Step 11: iOS Setup
1. **Add fonts to iOS bundle**:
   - Copy Space Grotesk fonts to `ios/PocketWalletAppBare/Fonts/`
   - Update `Info.plist` with font names

2. **Update Info.plist permissions**:
```xml
<key>NSMicrophoneUsageDescription</key>
<string>This app needs access to the microphone to enable voice input for transaction recording.</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>This app uses speech recognition to convert voice input into transaction data.</string>
```

3. **Install iOS dependencies**:
```bash
cd ios && pod install && cd ..
```

### Step 12: Android Setup
1. **Add fonts to Android**:
   - Copy fonts to `android/app/src/main/assets/fonts/`

2. **Update AndroidManifest.xml**:
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

## Phase 6: Testing

### Step 13: Test Build
```bash
# Test Android
npx react-native run-android

# Test iOS
npx react-native run-ios
```

### Step 14: Test Features
- [ ] App launches successfully
- [ ] Navigation works
- [ ] Voice recording functions
- [ ] Secure storage works
- [ ] Biometric authentication
- [ ] All screens render correctly

## Troubleshooting

### Common Issues
1. **Metro bundler errors**: Clear cache with `npx react-native start --reset-cache`
2. **iOS build errors**: Clean and rebuild with `cd ios && xcodebuild clean && cd ..`
3. **Android build errors**: Clean with `cd android && ./gradlew clean && cd ..`
4. **Font loading issues**: Verify fonts are properly added to native bundles

### Rollback Plan
If migration fails:
1. Keep original project intact
2. Test specific features individually
3. Migrate features incrementally if needed