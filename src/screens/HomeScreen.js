import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NumericInput } from '../components/NumericInput';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { WorkoutLogger } from '../components/WorkoutLogger';
import { NutritionLogger } from '../components/NutritionLogger';
import { WeeklyGoals } from '../components/WeeklyGoals';
import { Badges } from '../components/Badges';
import { DateNavigation } from '../components/DateNavigation';
import { DailyComparison } from '../components/DailyComparison';
import { TrendChart } from '../components/TrendChart';
import { calculateDailyPerformanceScore } from '../utils/scoreCalculator';
import {
  calculateWeeklyProgress,
  checkGoalsComplete,
  calculateConsecutiveWeeks,
  awardBadgeIfEligible
} from '../utils/goalTracker';
import {
  saveDailyLog,
  getDailyLog,
  getDailyLogs,
  saveUserSettings,
  getUserSettings,
  saveWorkout,
  getWorkoutsForDate,
  saveNutritionLog,
  getNutritionLogsForDate,
  getNutritionLogs,
  getWorkouts,
  getUniqueActivityNames,
  getWeeklyGoals,
  saveWeeklyGoals,
  getBadges,
  saveBadges
} from '../utils/storage';

export const HomeScreen = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // User settings
  const [maintenance, setMaintenance] = useState('2000');
  const [goal, setGoal] = useState('maintenance');

  // Daily metrics
  const [protein, setProtein] = useState('');
  const [calories, setCalories] = useState('');
  const [steps, setSteps] = useState('');
  const [sleepMinutes, setSleepMinutes] = useState('');

  // Toggles
  const [didLift, setDidLift] = useState(false);
  const [didCardio, setDidCardio] = useState(false);
  const [highStress, setHighStress] = useState(false);

  // Workouts
  const [workouts, setWorkouts] = useState([]);
  const [activityNames, setActivityNames] = useState([]);

  // Nutrition logs
  const [nutritionLogs, setNutritionLogs] = useState([]);

  // Weekly goals
  const [weeklyGoals, setWeeklyGoals] = useState({
    workouts: 0,
    totalReps: 0,
    protein: 0,
    calories: 0
  });
  const [weeklyProgress, setWeeklyProgress] = useState({
    workouts: 0,
    totalReps: 0,
    protein: 0,
    calories: 0
  });

  // Badges
  const [badges, setBadges] = useState([]);

  // Score
  const [scoreData, setScoreData] = useState(null);

  // Historical data
  const [allLogs, setAllLogs] = useState({});
  const [yesterdayLog, setYesterdayLog] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadData();
  }, [date]);

  const loadData = async () => {
    // Load user settings
    const settings = await getUserSettings();
    setMaintenance(settings.maintenance.toString());
    setGoal(settings.goal);

    // Load all logs for historical data
    const logs = await getDailyLogs();
    setAllLogs(logs);

    // Load current date's log
    const log = await getDailyLog(date);
    if (log) {
      setProtein(log.protein?.toString() || '');
      setCalories(log.calories?.toString() || '');
      setSteps(log.steps?.toString() || '');
      setSleepMinutes(log.sleepMinutes?.toString() || '');
      setDidLift(log.didLift || false);
      setDidCardio(log.didCardio || false);
      setHighStress(log.highStress || false);
      if (log.scoreData) {
        setScoreData(log.scoreData);
      }
    } else {
      // Clear form if no data for selected date
      setProtein('');
      setCalories('');
      setSteps('');
      setSleepMinutes('');
      setDidLift(false);
      setDidCardio(false);
      setHighStress(false);
      setScoreData(null);
    }

    // Load yesterday's log for comparison
    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split('T')[0];
    const yesterdayData = await getDailyLog(yesterdayDate);
    setYesterdayLog(yesterdayData);

    // Load workouts
    const dayWorkouts = await getWorkoutsForDate(date);
    setWorkouts(dayWorkouts);

    // Load activity names for autocomplete
    const names = await getUniqueActivityNames();
    setActivityNames(names);

    // Load nutrition logs
    const dayNutrition = await getNutritionLogsForDate(date);
    setNutritionLogs(dayNutrition);

    // Load weekly goals
    const goals = await getWeeklyGoals();
    setWeeklyGoals(goals);

    // Calculate weekly progress
    const allWorkouts = await getWorkouts();
    const allNutrition = await getNutritionLogs();
    const progress = calculateWeeklyProgress(allWorkouts, allNutrition);
    setWeeklyProgress(progress);

    // Load badges
    const userBadges = await getBadges();
    setBadges(userBadges);

    // Check and award badges if goals are complete
    if (checkGoalsComplete(progress, goals)) {
      const consecutiveWeeks = calculateConsecutiveWeeks(allWorkouts, allNutrition, goals);
      const updatedBadges = awardBadgeIfEligible(userBadges, consecutiveWeeks);
      if (updatedBadges.length > userBadges.length) {
        setBadges(updatedBadges);
        await saveBadges(updatedBadges);
      }
    }
  };

  const handleCalculateScore = async () => {
    const data = {
      protein: parseFloat(protein) || 0,
      calories: parseFloat(calories) || 0,
      maintenance: parseFloat(maintenance) || 2000,
      goal,
      steps: parseInt(steps) || 0,
      didLift,
      didCardio,
      sleepMinutes: parseFloat(sleepMinutes) || 420,
      highStress
    };

    const result = calculateDailyPerformanceScore(data);
    setScoreData(result);

    // Save to storage
    await saveDailyLog(date, {
      ...data,
      scoreData: result
    });

    // Save settings
    await saveUserSettings({
      maintenance: parseFloat(maintenance),
      goal
    });
  };

  const handleAddWorkout = async (workout) => {
    await saveWorkout(date, workout);
    const updatedWorkouts = await getWorkoutsForDate(date);
    setWorkouts(updatedWorkouts);
    setDidLift(true); // Auto-set lift toggle when workout is added

    // Refresh activity names for autocomplete
    const names = await getUniqueActivityNames();
    setActivityNames(names);

    // Recalculate weekly progress
    const allWorkouts = await getWorkouts();
    const allNutrition = await getNutritionLogs();
    const progress = calculateWeeklyProgress(allWorkouts, allNutrition);
    setWeeklyProgress(progress);
  };

  const handleAddNutrition = async (nutrition) => {
    await saveNutritionLog(date, nutrition);
    const updatedNutrition = await getNutritionLogsForDate(date);
    setNutritionLogs(updatedNutrition);

    // Recalculate weekly progress
    const allWorkouts = await getWorkouts();
    const allNutrition = await getNutritionLogs();
    const progress = calculateWeeklyProgress(allWorkouts, allNutrition);
    setWeeklyProgress(progress);
  };

  const handleSaveWeeklyGoals = async (goals) => {
    await saveWeeklyGoals(goals);
    setWeeklyGoals(goals);
  };

  // Prepare chart data from historical logs
  const prepareChartData = (metric) => {
    const sortedDates = Object.keys(allLogs).sort();
    return sortedDates.map(d => ({
      date: d,
      value: metric === 'score'
        ? allLogs[d].scoreData?.score || 0
        : allLogs[d][metric] || 0
    })).filter(d => d.value > 0);
  };

  const getCurrentLog = () => {
    return {
      protein: parseFloat(protein) || 0,
      calories: parseFloat(calories) || 0,
      steps: parseInt(steps) || 0,
      sleepMinutes: parseFloat(sleepMinutes) || 0,
      scoreData
    };
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>FlexLog</Text>
          <Text style={styles.subtitle}>Daily Performance Tracker</Text>
        </View>

        <DateNavigation currentDate={date} onDateChange={setDate} />

        <Badges badges={badges} />

        <WeeklyGoals
          goals={weeklyGoals}
          progress={weeklyProgress}
          onSaveGoals={handleSaveWeeklyGoals}
        />

        {scoreData && (
          <ScoreDisplay score={scoreData.score} breakdown={scoreData.breakdown} />
        )}

        {yesterdayLog && (
          <DailyComparison today={getCurrentLog()} yesterday={yesterdayLog} />
        )}

        <TrendChart
          data={prepareChartData('score')}
          label="Performance Score Trend"
          color="#2196F3"
          suffix="/10"
        />

        <TrendChart
          data={prepareChartData('sleepMinutes')}
          label="Sleep Minutes Trend"
          color="#9C27B0"
          suffix="m"
        />

        <TrendChart
          data={prepareChartData('steps')}
          label="Steps Trend"
          color="#4CAF50"
          suffix=""
        />

        <View style={styles.divider}>
          <Text style={styles.dividerText}>Daily Inputs</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <NumericInput
            label="Maintenance Calories"
            value={maintenance}
            onChangeText={setMaintenance}
            placeholder="2000"
            unit="kcal"
          />
          <Text style={styles.label}>Goal</Text>
          <View style={styles.goalButtons}>
            {['deficit', 'maintenance', 'surplus'].map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.goalButton, goal === g && styles.goalButtonActive]}
                onPress={() => setGoal(g)}
              >
                <Text style={[styles.goalButtonText, goal === g && styles.goalButtonTextActive]}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <NutritionLogger
          onAddNutrition={handleAddNutrition}
          nutritionLogs={nutritionLogs}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Nutrition Summary (for score calculation)</Text>
          <NumericInput
            label="Protein"
            value={protein}
            onChangeText={setProtein}
            placeholder="150"
            unit="g"
          />
          <NumericInput
            label="Total Calories"
            value={calories}
            onChangeText={setCalories}
            placeholder="2000"
            unit="kcal"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity</Text>
          <NumericInput
            label="Steps"
            value={steps}
            onChangeText={setSteps}
            placeholder="10000"
            unit="steps"
          />
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Weight Lifting</Text>
            <Switch value={didLift} onValueChange={setDidLift} />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Cardio</Text>
            <Switch value={didCardio} onValueChange={setDidCardio} />
          </View>
        </View>

        <WorkoutLogger
          onAddWorkout={handleAddWorkout}
          workouts={workouts}
          activityNames={activityNames}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recovery</Text>
          <NumericInput
            label="Sleep Last Night (Yesterday's Sleep)"
            value={sleepMinutes}
            onChangeText={setSleepMinutes}
            placeholder="450"
            unit="minutes"
          />
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>High Stress</Text>
            <Switch value={highStress} onValueChange={setHighStress} />
          </View>
        </View>

        <TouchableOpacity style={styles.calculateButton} onPress={handleCalculateScore}>
          <Text style={styles.calculateButtonText}>Calculate Score</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Formula: Score = (Nutrition × Energy × Activity × Recovery) × 10
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  divider: {
    marginVertical: 24,
    alignItems: 'center',
  },
  dividerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  goalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  goalButtonActive: {
    backgroundColor: '#2196F3',
  },
  goalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  goalButtonTextActive: {
    color: '#fff',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  toggleLabel: {
    fontSize: 16,
    color: '#333',
  },
  calculateButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 24,
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
