# FlexLog - Daily Performance Tracker

A React Native app to track fitness metrics and calculate your Daily Performance Score based on nutrition, energy balance, activity, and recovery.

## Features

- **Daily Performance Score**: Calculate a 1-10 score based on your daily metrics
- **Nutrition Tracking**: Log protein and calorie intake
- **Activity Monitoring**: Track steps, weight lifting, and cardio
- **Workout Logger**: Record exercises with sets, reps, and weight
- **Recovery Tracking**: Monitor sleep hours and stress levels
- **Goal Setting**: Set and track deficit, maintenance, or surplus goals
- **Data Persistence**: All data is stored locally on your device

## Score Formula

```
Score = (Nutrition × Energy × Activity × Recovery) × 10
```

Where:
- **Nutrition** = (Protein ÷ Calories) × 10
- **Energy** = Calorie balance vs maintenance
  - 1.0 → within target range
  - 0.9 → slightly off
  - 0.8 → too low or too high
- **Activity** = Based on steps and workout type
  - 0.9 → <5k steps
  - 1.0 → 5-8k steps
  - 1.1 → 8-12k steps + lift
  - 1.2 → >12k steps + lift/cardio
- **Recovery** = Based on sleep and stress
  - 1.0 → 7-8h sleep
  - 0.9 → 6-7h sleep
  - 0.8 → <6h sleep or high stress

Result: 1-10 scale

## Installation

```bash
# Install dependencies
npm install

# Start the app
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web
```

## Usage

1. **Set Your Settings**: Enter your maintenance calories and goal (deficit, maintenance, or surplus)
2. **Track Nutrition**: Log your daily protein intake and total calories
3. **Monitor Activity**: Enter your step count and toggle weight lifting/cardio
4. **Log Workouts**: Add exercises with sets, reps, and weight
5. **Track Recovery**: Enter sleep hours and stress level
6. **Calculate Score**: Tap "Calculate Score" to see your Daily Performance Score

## Project Structure

```
flexlog/
├── src/
│   ├── components/
│   │   ├── NumericInput.js      # Reusable numeric input component
│   │   ├── ScoreDisplay.js      # Score visualization component
│   │   └── WorkoutLogger.js     # Workout tracking component
│   ├── screens/
│   │   └── HomeScreen.js        # Main app screen
│   └── utils/
│       ├── scoreCalculator.js   # Score calculation logic
│       └── storage.js           # Data persistence utilities
├── App.js                       # App entry point
└── package.json
```

## Web Deployment

The app can be deployed as a web application using GitHub Pages or any static hosting service.

### Build for Web

```bash
# Build static web app
npm run build:web

# Serve locally for testing
npm run serve
```

The built files will be in the `dist/` directory.

### Automated Deployment

The app includes GitHub Actions workflows for:

1. **Web Deployment** (`.github/workflows/deploy-web.yml`):
   - Automatically deploys to GitHub Pages on push to main/master
   - Builds the web version and publishes it
   - Requires GitHub Pages to be enabled in repository settings

2. **Maestro Tests** (`.github/workflows/maestro-tests.yml`):
   - Runs automated UI tests on Android and iOS
   - Executes on every push and pull request
   - Tests smoke tests, main flow, and workout logger

## Testing

### Maestro E2E Tests

The app includes comprehensive UI tests using [Maestro](https://maestro.mobile.dev/).

#### Test Files

- `.maestro/smoke-test.yaml` - Quick smoke test to verify app launches
- `.maestro/app-flow.yaml` - Complete user flow test
- `.maestro/workout-logger.yaml` - Workout logging functionality test

#### Running Tests Locally

1. Install Maestro:
```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

2. Start the app:
```bash
npm start
```

3. Open app on simulator/emulator or device

4. Run tests:
```bash
# Run all tests
maestro test .maestro/

# Run specific test
maestro test .maestro/smoke-test.yaml

# Run with recording
maestro test --format junit .maestro/app-flow.yaml
```

#### CI/CD Testing

Tests run automatically in GitHub Actions:
- On every push to main/master or PR
- On claude/* branches (for development)
- Manual trigger via workflow_dispatch

Test artifacts (screenshots, videos) are uploaded to GitHub Actions artifacts.

## Technologies

- React Native
- Expo
- AsyncStorage for local data persistence
- Maestro for E2E testing
- GitHub Actions for CI/CD

## License

MIT
