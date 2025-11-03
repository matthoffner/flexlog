import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  DAILY_LOGS: '@flexlog_daily_logs',
  USER_SETTINGS: '@flexlog_user_settings',
  WORKOUTS: '@flexlog_workouts',
  NUTRITION_LOGS: '@flexlog_nutrition_logs',
  WEEKLY_GOALS: '@flexlog_weekly_goals',
  BADGES: '@flexlog_badges'
};

/**
 * Save daily log data
 */
export const saveDailyLog = async (date, data) => {
  try {
    const logs = await getDailyLogs();
    logs[date] = {
      ...data,
      timestamp: new Date().toISOString()
    };
    await AsyncStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
    return true;
  } catch (error) {
    console.error('Error saving daily log:', error);
    return false;
  }
};

/**
 * Get all daily logs
 */
export const getDailyLogs = async () => {
  try {
    const logs = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
    return logs ? JSON.parse(logs) : {};
  } catch (error) {
    console.error('Error getting daily logs:', error);
    return {};
  }
};

/**
 * Get daily log for a specific date
 */
export const getDailyLog = async (date) => {
  try {
    const logs = await getDailyLogs();
    return logs[date] || null;
  } catch (error) {
    console.error('Error getting daily log:', error);
    return null;
  }
};

/**
 * Save user settings
 */
export const saveUserSettings = async (settings) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving user settings:', error);
    return false;
  }
};

/**
 * Get user settings
 */
export const getUserSettings = async () => {
  try {
    const settings = await AsyncStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
    return settings ? JSON.parse(settings) : {
      maintenance: 2000,
      goal: 'maintenance'
    };
  } catch (error) {
    console.error('Error getting user settings:', error);
    return {
      maintenance: 2000,
      goal: 'maintenance'
    };
  }
};

/**
 * Save workout data
 */
export const saveWorkout = async (date, workoutData) => {
  try {
    const workouts = await getWorkouts();
    if (!workouts[date]) {
      workouts[date] = [];
    }
    workouts[date].push({
      ...workoutData,
      timestamp: new Date().toISOString()
    });
    await AsyncStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
    return true;
  } catch (error) {
    console.error('Error saving workout:', error);
    return false;
  }
};

/**
 * Get all workouts
 */
export const getWorkouts = async () => {
  try {
    const workouts = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUTS);
    return workouts ? JSON.parse(workouts) : {};
  } catch (error) {
    console.error('Error getting workouts:', error);
    return {};
  }
};

/**
 * Get workouts for a specific date
 */
export const getWorkoutsForDate = async (date) => {
  try {
    const workouts = await getWorkouts();
    return workouts[date] || [];
  } catch (error) {
    console.error('Error getting workouts for date:', error);
    return [];
  }
};

/**
 * Clear all data
 */
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.DAILY_LOGS,
      STORAGE_KEYS.USER_SETTINGS,
      STORAGE_KEYS.WORKOUTS,
      STORAGE_KEYS.NUTRITION_LOGS,
      STORAGE_KEYS.WEEKLY_GOALS,
      STORAGE_KEYS.BADGES
    ]);
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

/**
 * Save nutrition log entry (supports multiple per day)
 */
export const saveNutritionLog = async (date, nutritionData) => {
  try {
    const logs = await getNutritionLogs();
    if (!logs[date]) {
      logs[date] = [];
    }
    logs[date].push({
      ...nutritionData,
      timestamp: new Date().toISOString()
    });
    await AsyncStorage.setItem(STORAGE_KEYS.NUTRITION_LOGS, JSON.stringify(logs));
    return true;
  } catch (error) {
    console.error('Error saving nutrition log:', error);
    return false;
  }
};

/**
 * Get all nutrition logs
 */
export const getNutritionLogs = async () => {
  try {
    const logs = await AsyncStorage.getItem(STORAGE_KEYS.NUTRITION_LOGS);
    return logs ? JSON.parse(logs) : {};
  } catch (error) {
    console.error('Error getting nutrition logs:', error);
    return {};
  }
};

/**
 * Get nutrition logs for a specific date
 */
export const getNutritionLogsForDate = async (date) => {
  try {
    const logs = await getNutritionLogs();
    return logs[date] || [];
  } catch (error) {
    console.error('Error getting nutrition logs for date:', error);
    return [];
  }
};

/**
 * Get all unique activity names from workout history
 */
export const getUniqueActivityNames = async () => {
  try {
    const workouts = await getWorkouts();
    const names = new Set();
    Object.values(workouts).forEach(dayWorkouts => {
      dayWorkouts.forEach(workout => {
        if (workout.exercise) {
          names.add(workout.exercise);
        }
      });
    });
    return Array.from(names).sort();
  } catch (error) {
    console.error('Error getting unique activity names:', error);
    return [];
  }
};

/**
 * Save weekly goals
 */
export const saveWeeklyGoals = async (goals) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.WEEKLY_GOALS, JSON.stringify(goals));
    return true;
  } catch (error) {
    console.error('Error saving weekly goals:', error);
    return false;
  }
};

/**
 * Get weekly goals
 */
export const getWeeklyGoals = async () => {
  try {
    const goals = await AsyncStorage.getItem(STORAGE_KEYS.WEEKLY_GOALS);
    return goals ? JSON.parse(goals) : {
      workouts: 0,
      totalReps: 0,
      protein: 0,
      calories: 0
    };
  } catch (error) {
    console.error('Error getting weekly goals:', error);
    return {
      workouts: 0,
      totalReps: 0,
      protein: 0,
      calories: 0
    };
  }
};

/**
 * Save badges
 */
export const saveBadges = async (badges) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
    return true;
  } catch (error) {
    console.error('Error saving badges:', error);
    return false;
  }
};

/**
 * Get badges
 */
export const getBadges = async () => {
  try {
    const badges = await AsyncStorage.getItem(STORAGE_KEYS.BADGES);
    return badges ? JSON.parse(badges) : [];
  } catch (error) {
    console.error('Error getting badges:', error);
    return [];
  }
};
