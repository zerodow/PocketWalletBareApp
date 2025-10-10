# Technical Documentation - Money Management App MVP

_Free Tier Implementation Guide_

## ðŸŽ¯ Technology Stack

### Frontend (React Native)

- **React Native** - v0.81.4 (bare workflow) for cross-platform mobile
- **React** - v19.1.0
- **TypeScript** - Type safety throughout the application
- **Zustand** - Lightweight state management solution with MMKV persistence
- **WatermelonDB** - Reactive offline-first database with JSI-enabled SQLite
- **React Navigation** - v7 (native-stack + bottom-tabs)
- **MMKV** - Fast, encrypted on-device storage
- **Native Components** - Built-in UI components with custom theme system

### Infrastructure (Free Tier)

- **React Native CLI** - Native build tooling for iOS and Android
- **Local Storage** - Device-based data storage with WatermelonDB + MMKV
- **Future Sync Infrastructure** - Placeholder for optional server synchronization

## ðŸ—ï¸ Architecture Decisions

### Local-First Design

**Decision**: WatermelonDB as primary data store with purely local operations
**Rationale**: Financial apps require reliability and instant responsiveness; local-first ensures no connectivity dependencies
**Trade-offs**: No automatic backup vs guaranteed privacy and instant performance

### State Management Choice

**Decision**: Zustand over Redux/Context API
**Rationale**: Simpler learning curve, less boilerplate, sufficient for MVP scope
**Trade-offs**: Less ecosystem tooling vs faster development

### Future Sync Strategy

**Decision**: Local-only with optional future server synchronization
**Rationale**: Prioritize user privacy and offline functionality; sync can be added later as user-controlled feature
**Trade-offs**: No automatic multi-device sync vs complete privacy and offline reliability

## ðŸ“± Frontend Architecture

### Project Structure

```
src/
â”œâ”€â”€ components/          # Reusable UI components
â”œâ”€â”€ screens/            # Screen-level components
â”œâ”€â”€ store/              # Zustand state stores
â”œâ”€â”€ database/           # WatermelonDB configuration
â”œâ”€â”€ services/           # External API integrations
â”œâ”€â”€ types/              # TypeScript type definitions
â”œâ”€â”€ utils/              # Helper functions and utilities
â””â”€â”€ navigation/         # Navigation configuration
```

### Data Layer Design

- **Local Database**: WatermelonDB with reactive queries for offline-first operations
- **State Management**: Zustand stores for UI state and app-level data
- **Local Operations**: All CRUD operations work instantly without connectivity
- **Caching**: Automatic query caching through WatermelonDB observables

### Security Implementation

- **Local Authentication**: Device-based authentication with MMKV encrypted storage
- **Data Encryption**: MMKV encryption for sensitive local data
- **Privacy First**: All data remains local unless user explicitly chooses to sync
- **File Security**: Local file operations with proper validation

## ðŸ–¥ï¸ Future Backend Architecture

### When Sync is Added Later

- **Optional Sync Service** - User-controlled server synchronization
- **Privacy-First API** - End-to-end encryption, minimal data exposure
- **Manual Sync Control** - User decides when and what to sync
- **Local-First Priority** - Server always secondary to local data

### Planned API Design

- **RESTful** - Standard HTTP methods and status codes when implemented
- **User-Controlled** - All sync operations require explicit user consent
- **Privacy-Focused** - Minimal data collection, maximum user control
- **Backward Compatible** - Local-first app continues working without server

### Voice Input API (Post-MVP)

**Endpoint:** `POST /api/v1/speech-to-text`

**Purpose:** Convert audio recordings to text for transaction entry using Google Cloud Speech-to-Text

**Request:**
- Content-Type: multipart/form-data
- Body: audio file (.m4a, .wav, .mp3, .aac), language code (vi-VN)
- Max file size: 10MB
- Max duration: 30 seconds

**Response:**
- Success: transcript text, confidence score, language detected
- Errors: AUDIO_TOO_LARGE, INVALID_FORMAT, TRANSCRIPTION_FAILED, RATE_LIMIT_EXCEEDED

**Implementation:**
- Node.js/Express with Multer for file uploads
- Google Cloud Speech-to-Text API integration
- Audio files temporarily stored, deleted after processing
- Rate limiting: 100 requests/user/day

**Privacy & Security:**
- Audio temporarily uploaded to backend server
- Processed by Google Cloud Speech-to-Text API
- No long-term storage of audio files
- Requires explicit user consent before first use
- Users can disable feature in Settings

**Cost:** ~$2-4/month for 1000 voice transactions (after 60 min free tier)

### Future Services

- **Optional Sync Service** - Background data synchronization when requested
- **Backup Service** - User-controlled data backup and restore
- **Export Service** - Server-side data export and sharing
- **Voice-to-Text Service** - Speech recognition for quick transaction entry (Post-MVP)

## ðŸ—„ï¸ Local Database Design

### Core Entities (Local Storage)

- **Categories** - Income/expense categorization stored locally
- **Transactions** - Core financial transactions with local storage
- **Settings** - User preferences and app configuration
- **Local Auth** - Device-based authentication state
- **App State** - UI preferences and temporary data

### Data Relationships (Local)

- **Categories â†' Transactions** (One-to-Many)
- **Settings â†' User Preferences** (One-to-One)
- **Local Auth â†' User Session** (One-to-One)
- **App State â†' UI Preferences** (One-to-One)

### Security Model (Local)

- **Local Isolation** - All data stored locally on user device
- **Device Security** - Leverages OS-level security and encryption
- **Privacy First** - No data leaves device unless explicitly requested by user
- **Local Validation** - Client-side validation for all inputs
- **Audit Trail** - Created/updated timestamps on all local records

## 🔮 Future Synchronization Strategy

### Future Sync Architecture

- **Local-First Always** - All operations continue working locally even when sync is added
- **User-Controlled Sync** - Manual sync trigger in Settings screen
- **Privacy-Preserving** - End-to-end encryption when sync is implemented
- **Optional Feature** - App fully functional without any sync

### Planned Sync Process (Future)

1. **Manual Trigger** - User initiates sync from Settings
2. **Consent Check** - Confirm user wants to share data with server
3. **Local Backup** - Create local backup before sync
4. **Secure Upload** - Encrypted data transmission
5. **Conflict Resolution** - User-controlled resolution when conflicts occur
6. **Local Priority** - Local data always takes precedence

### Future Sync Benefits

- **Multi-device Access** - Optional data sharing between devices
- **Cloud Backup** - User-controlled data backup
- **Export Options** - Additional export formats via server

## ðŸš€ Deployment Strategy

### Development Environment

- **Local Development** - Metro bundler with fast refresh
- **Local Database** - WatermelonDB with JSI-enabled SQLite
- **Local Testing** - All functionality works offline
- **Device Testing** - Physical devices and simulators (iOS/Android)

### Production Deployment

- **Mobile Only** - Native builds for app store distribution (iOS/Android)
- **Build System** - React Native CLI with CocoaPods (iOS) and Gradle (Android)
- **Local Storage** - All data remains on user device
- **Offline-First** - No server dependencies
- **Monitoring** - Local error tracking and performance monitoring

### Environment Management

- **Local Configuration** - Device-specific settings and preferences
- **Privacy Management** - All data stays local unless user explicitly shares
- **Feature Flags** - Local feature toggles for beta testing
- **Rollback Strategy** - App store rollback for critical issues

## ðŸ”§ Development Workflow

### Code Quality Standards

- **TypeScript** - Strict type checking enabled
- **Linting** - ESLint with React Native and TypeScript rules
- **Formatting** - Prettier for consistent code style
- **Git Hooks** - Pre-commit validation

### Testing Strategy

- **Unit Tests** - Core business logic and utilities
- **Integration Tests** - API endpoints and database operations
- **Component Tests** - React Native component behavior
- **E2E Tests** - Critical user flows (limited for MVP)

### Version Control

- **Git Flow** - Feature branches with main branch protection
- **Commit Messages** - Conventional commit format
- **Code Reviews** - Required for all changes
- **Documentation** - Code comments and README updates

## ðŸŽ¯ MVP Implementation Phases

### Phase 1: Core Foundation (Week 1-2)

- Project setup and basic architecture
- User authentication flow
- Basic account and transaction management
- Simple dashboard with key metrics

### Phase 2: Data Management (Week 3-4)

- Offline-first database implementation
- Synchronization with server
- Receipt photo capture and storage
- Transaction categorization and filtering

### Phase 3: Advanced Features (Week 5-6)

- Bill splitting calculator
- Warranty tracking system
- Budget management
- Data export functionality

### Phase 4: Polish & Optimization (Week 7-8)

- Performance optimization
- Error handling improvements
- User experience refinements
- Production deployment preparation

## âš ï¸ Technical Constraints & Mitigations

### Free Tier Limitations

- **MMKV Storage**: Local encrypted storage with no cloud dependencies
- **Render.com**: 750 hours/month, sleeps after 15 minutes inactivity (when backend is added)
- **Native Builds**: Manual builds via React Native CLI (no build service costs)

### Mitigation Strategies

- **Database Size**: Efficient schema design, data archiving
- **Server Sleep**: Accept cold starts or implement keep-alive (when backend is added)
- **Native Performance**: JSI-enabled WatermelonDB for optimal database performance
- **Storage**: Image compression, periodic cleanup, MMKV for fast key-value operations

### Scaling Considerations

- **Database**: Migration path to cloud database when needed
- **Backend**: Container orchestration for horizontal scaling
- **Mobile**: App store optimization for wider distribution
- **Monitoring**: Implementation of comprehensive analytics

## ðŸ“Š Performance Requirements

### Response Time Targets

- **Local Operations**: <100ms (database queries)
- **API Calls**: <2s (with loading states)
- **Sync Operations**: <30s (background)
- **App Launch**: <3s (cold start)

### Resource Utilization

- **Memory Usage**: <200MB typical usage
- **Storage**: <100MB app size, efficient local database
- **Battery**: Background sync optimization
- **Network**: Minimal data usage with sync optimization

---

_This document serves as the technical foundation for MVP development and future scaling decisions._
