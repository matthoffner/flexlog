# Maestro Testing Guide

This document explains how to run and write Maestro E2E tests for FlexLog.

## Test Files

### 1. smoke-test.yaml
Quick test to verify the app launches and all major UI elements are visible.

**What it tests:**
- App launches successfully
- All sections are visible (Settings, Nutrition, Activity, Recovery)
- Main buttons and inputs exist
- Calculate Score button is present

**Run time:** ~30 seconds

### 2. app-flow.yaml
Complete user flow from input to score calculation.

**What it tests:**
- Setting maintenance calories
- Selecting goal type
- Entering nutrition data (protein, calories)
- Entering activity data (steps)
- Entering recovery data (sleep hours)
- Calculating the Daily Performance Score
- Verifying score display

**Run time:** ~1-2 minutes

### 3. workout-logger.yaml
Tests the workout logging functionality.

**What it tests:**
- Navigating to workout logger
- Adding exercise name, sets, reps, and weight
- Verifying workout appears in the list

**Run time:** ~45 seconds

## Running Tests Locally

### Prerequisites
1. Install Maestro CLI:
   ```bash
   curl -Ls "https://get.maestro.mobile.dev" | bash
   ```

2. Start your app:
   ```bash
   npm start
   ```

3. Open the app on a device/simulator:
   - iOS: Press `i` in the terminal
   - Android: Press `a` in the terminal
   - Physical device: Scan QR code with Expo Go

### Run Tests

```bash
# Run all tests
maestro test .maestro/

# Run specific test
maestro test .maestro/smoke-test.yaml

# Run with continuous mode (auto-restart on changes)
maestro test --continuous .maestro/smoke-test.yaml

# Run with debug output
maestro test --debug-output .maestro/app-flow.yaml
```

## Test ID Reference

Components have been enhanced with testID props for reliable testing:

### NumericInput Components
- Auto-generated from label: `label.toLowerCase().replace(/\s+/g, '-')`
- Examples:
  - "Maintenance Calories" → `maintenance-calories`
  - "Total Calories" → `total-calories`
  - "Sleep Hours" → `sleep-hours`

### WorkoutLogger Components
- `exercise-name-input` - Exercise name field
- `sets-input` - Sets field
- `reps-input` - Reps field
- `weight-input` - Weight field
- `add-exercise-button` - Add exercise button

## Writing New Tests

### Basic Test Structure

```yaml
appId: host.exp.Exponent
---
- launchApp
- extendedWaitUntil:
    visible: "FlexLog"
    timeout: 15000

# Your test steps here
```

### Best Practices

1. **Always wait for app to load:**
   ```yaml
   - extendedWaitUntil:
       visible: "FlexLog"
       timeout: 15000
   ```

2. **Use scrollUntilVisible for off-screen elements:**
   ```yaml
   - scrollUntilVisible:
       element:
         text: "Recovery"
       direction: DOWN
   ```

3. **Tap inputs using position relative to labels:**
   ```yaml
   - tapOn:
       below:
         text: "Protein"
   - inputText: "150"
   ```

4. **Use testID when available:**
   ```yaml
   - tapOn:
       id: "exercise-name-input"
   ```

5. **Add waits between critical actions:**
   ```yaml
   - tapOn: "Calculate Score"
   - extendedWaitUntil:
       visible: "Daily Performance Score"
       timeout: 5000
   ```

## Common Issues and Solutions

### Issue: Element not found
**Solution:** Use `scrollUntilVisible` instead of assuming element position

### Issue: Input not accepting text
**Solution:** Use `tapOn` with `below:` or `id:` selector first, then `inputText`

### Issue: Timing issues
**Solution:** Add `extendedWaitUntil` between actions

### Issue: Test works locally but fails in CI
**Solution:** Increase timeout values and add more explicit waits

## CI/CD Integration

### Current Setup
The CI workflow validates test syntax and builds the web app. It does NOT run tests on emulators by default.

### Why?
- Setting up emulators in CI is complex and slow
- Maestro Cloud provides better reliability
- Local testing is fast and effective for development

### Using Maestro Cloud (Recommended for CI)
1. Sign up at [cloud.mobile.dev](https://cloud.mobile.dev/)
2. Get your API key
3. Add to GitHub secrets as `MAESTRO_CLOUD_API_KEY`
4. Set repository variable `MAESTRO_CLOUD_ENABLED=true`
5. Trigger workflow manually or on specific branches

### Benefits of Maestro Cloud
- Real device testing
- Video recordings of test runs
- Parallel test execution
- No emulator setup required
- Better reliability

## Debugging Tests

### View test execution
```bash
maestro test --debug-output .maestro/app-flow.yaml
```

### Take screenshots during test
```yaml
- takeScreenshot: screenshot-name
```

### Add delays for debugging
```yaml
- inputText: "test"
- waitForAnimationToEnd:
    timeout: 2000
```

### Use Maestro Studio for interactive testing
```bash
maestro studio
```
Then interact with your app while Maestro records your actions.

## Resources

- [Maestro Documentation](https://maestro.mobile.dev/docs)
- [Maestro CLI Reference](https://maestro.mobile.dev/cli/cli-reference)
- [Maestro Cloud](https://cloud.mobile.dev/)
- [Best Practices](https://maestro.mobile.dev/docs/best-practices)
