# Migration Testing Checklist

## Pre-Migration Baseline Testing
Test current Expo version to establish baseline functionality:

### Core App Functions
- [ ] App launches successfully
- [ ] User can navigate between screens
- [ ] Authentication flow works
- [ ] Dashboard displays correctly
- [ ] Transaction screens load

### Voice Features
- [ ] Voice recording starts/stops
- [ ] Speech recognition converts voice to text
- [ ] Voice input saves as transaction
- [ ] Microphone permissions work

### Security Features
- [ ] Biometric authentication prompts
- [ ] PIN authentication works
- [ ] Secure storage saves/retrieves tokens
- [ ] App lock functionality

### UI/UX Features
- [ ] Theme switching (light/dark)
- [ ] Fonts render correctly
- [ ] Haptic feedback works
- [ ] Splash screen displays
- [ ] Navigation animations smooth

## Post-Migration Testing

### Build Testing
- [ ] **iOS Debug Build**: `npx react-native run-ios`
- [ ] **Android Debug Build**: `npx react-native run-android`
- [ ] **iOS Release Build**: Archive and export
- [ ] **Android Release Build**: Generate signed APK

### Functionality Testing

#### Navigation & Screens
- [ ] App launches without crashes
- [ ] Bottom tab navigation works
- [ ] Stack navigation works
- [ ] Screen transitions smooth
- [ ] All screens render content

#### Authentication Flow
- [ ] Welcome/login screens display
- [ ] Authentication context works
- [ ] Token storage/retrieval works
- [ ] Logout functionality works
- [ ] Session persistence works

#### Voice Recording
- [ ] Microphone permission granted
- [ ] Voice recording button works
- [ ] Recording starts/stops correctly
- [ ] Speech-to-text conversion works
- [ ] Voice input saves as transaction data

#### Secure Storage
- [ ] Tokens save to keychain
- [ ] Tokens retrieve from keychain
- [ ] PIN saves and validates
- [ ] Secure data persists after app restart
- [ ] Data encryption works

#### Biometric Authentication
- [ ] Biometric prompt appears
- [ ] Face ID/Touch ID works (iOS)
- [ ] Fingerprint/Face unlock works (Android)
- [ ] Fallback to PIN works
- [ ] Authentication state updates

#### Database & Storage
- [ ] WatermelonDB initializes
- [ ] Transactions save to database
- [ ] Categories load correctly
- [ ] Data synchronization works
- [ ] MMKV storage works

#### UI Components
- [ ] Custom components render
- [ ] Themed styles apply correctly
- [ ] Light/dark mode switching
- [ ] Space Grotesk fonts load
- [ ] Icons display correctly

#### System Integration
- [ ] Haptic feedback works
- [ ] Deep linking works
- [ ] App state management
- [ ] Background/foreground transitions
- [ ] Device orientation handling

### Performance Testing
- [ ] App startup time acceptable
- [ ] Navigation response time good
- [ ] Memory usage reasonable
- [ ] No memory leaks detected
- [ ] Voice recording smooth
- [ ] Database queries fast

### Platform-Specific Testing

#### iOS Specific
- [ ] Notch/safe area handling
- [ ] iOS gestures work
- [ ] App Store compliance
- [ ] iOS permissions dialogs
- [ ] Background app refresh

#### Android Specific
- [ ] Hardware back button
- [ ] Android navigation gestures
- [ ] Play Store compliance
- [ ] Android permissions
- [ ] Different screen sizes

## Regression Testing

### Compare with Expo Version
- [ ] Feature parity maintained
- [ ] Performance equal or better
- [ ] User experience equivalent
- [ ] No functionality lost
- [ ] Visual consistency maintained

### Edge Cases
- [ ] Low memory conditions
- [ ] Network connectivity issues
- [ ] Permission denied scenarios
- [ ] App backgrounding/foregrounding
- [ ] Device rotation
- [ ] System font size changes

## Development Workflow Testing

### Developer Experience
- [ ] Hot reload works
- [ ] Fast refresh works
- [ ] Metro bundler starts
- [ ] Debugging tools work
- [ ] Error reporting clear

### Build Process
- [ ] Development builds work
- [ ] Release builds work
- [ ] Code signing works
- [ ] Asset bundling correct
- [ ] Source maps generated

## Error Handling Testing

### Common Error Scenarios
- [ ] Network request failures
- [ ] Database connection errors
- [ ] Permission denied errors
- [ ] Invalid input handling
- [ ] Crash recovery

### Error Reporting
- [ ] Crash logs captured
- [ ] Error boundaries work
- [ ] User-friendly error messages
- [ ] Fallback UI displays

## Documentation & Setup Testing

### New Developer Setup
- [ ] README instructions work
- [ ] Dependencies install correctly
- [ ] Build instructions accurate
- [ ] Development server starts
- [ ] All required tools listed

## Sign-off Criteria

### Must Pass
- [ ] All core features work
- [ ] No crashes during normal use
- [ ] Authentication flow complete
- [ ] Voice recording functional
- [ ] Builds successfully on both platforms

### Performance Benchmarks
- [ ] App startup < 3 seconds
- [ ] Navigation response < 200ms
- [ ] Voice recording latency acceptable
- [ ] Memory usage reasonable

### Quality Gates
- [ ] TypeScript compilation clean
- [ ] Linting passes
- [ ] Tests pass (if applicable)
- [ ] No console errors/warnings

## Rollback Plan
If critical issues found:
1. Document specific failures
2. Assess if fixable quickly
3. Consider incremental migration
4. Maintain Expo version as backup
5. Plan retry timeline

## Success Metrics
- [ ] 100% feature parity with Expo version
- [ ] Zero critical bugs
- [ ] Performance maintained or improved
- [ ] Developer workflow established
- [ ] Documentation updated