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
import { calculateDailyPerformanceScore } from '../utils/scoreCalculator';
import {
  saveDailyLog,
  getDailyLog,
  saveUserSettings,
  getUserSettings,
  saveWorkout,
  getWorkoutsForDate
} from '../utils/storage';

export const HomeScreen = () => {
  const [date] = useState(new Date().toISOString().split('T')[0]);

  // User settings
  const [maintenance, setMaintenance] = useState('2000');
  const [goal, setGoal] = useState('maintenance');

  // Daily metrics
  const [protein, setProtein] = useState('');
  const [calories, setCalories] = useState('');
  const [steps, setSteps] = useState('');
  const [sleepHours, setSleepHours] = useState('');

  // Toggles
  const [didLift, setDidLift] = useState(false);
  const [didCardio, setDidCardio] = useState(false);
  const [highStress, setHighStress] = useState(false);

  // Workouts
  const [workouts, setWorkouts] = useState([]);

  // Score
  const [scoreData, setScoreData] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Load user settings
    const settings = await getUserSettings();
    setMaintenance(settings.maintenance.toString());
    setGoal(settings.goal);

    // Load today's log
    const log = await getDailyLog(date);
    if (log) {
      setProtein(log.protein?.toString() || '');
      setCalories(log.calories?.toString() || '');
      setSteps(log.steps?.toString() || '');
      setSleepHours(log.sleepHours?.toString() || '');
      setDidLift(log.didLift || false);
      setDidCardio(log.didCardio || false);
      setHighStress(log.highStress || false);
      if (log.scoreData) {
        setScoreData(log.scoreData);
      }
    }

    // Load workouts
    const todayWorkouts = await getWorkoutsForDate(date);
    setWorkouts(todayWorkouts);
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
      sleepHours: parseFloat(sleepHours) || 7,
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
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>FlexLog</Text>
          <Text style={styles.subtitle}>Daily Performance Tracker</Text>
          <Text style={styles.date}>{new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</Text>
        </View>

        {scoreData && (
          <ScoreDisplay score={scoreData.score} breakdown={scoreData.breakdown} />
        )}

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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutrition</Text>
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

        <WorkoutLogger onAddWorkout={handleAddWorkout} workouts={workouts} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recovery</Text>
          <NumericInput
            label="Sleep Hours"
            value={sleepHours}
            onChangeText={setSleepHours}
            placeholder="7.5"
            unit="hours"
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
  date: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
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
