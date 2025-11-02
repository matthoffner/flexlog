import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  DAILY_LOGS: '@flexlog_daily_logs',
  USER_SETTINGS: '@flexlog_user_settings',
  WORKOUTS: '@flexlog_workouts'
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
      STORAGE_KEYS.WORKOUTS
    ]);
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};
