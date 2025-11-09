/**
 * Calculate rolling averages for different metrics
 */

/**
 * Calculate rolling average score for a specific section over the last N days
 *
 * @param {Object} allLogs - All daily logs
 * @param {string} section - Section name: 'nutrition', 'energy', 'activity', 'recovery'
 * @param {number} days - Number of days to include (default: 7)
 * @returns {number} Rolling average score (0-10)
 */
export const calculateRollingAverage = (allLogs, section, days = 7) => {
  if (!allLogs || Object.keys(allLogs).length === 0) {
    return 0;
  }

  // Get sorted dates (most recent first)
  const sortedDates = Object.keys(allLogs).sort().reverse();

  // Get the last N days that have score data
  const recentLogs = sortedDates
    .slice(0, days)
    .filter(date => allLogs[date]?.scoreData?.breakdown?.[section])
    .map(date => parseFloat(allLogs[date].scoreData.breakdown[section]));

  if (recentLogs.length === 0) {
    return 0;
  }

  // Calculate average
  const sum = recentLogs.reduce((acc, val) => acc + val, 0);
  const avg = sum / recentLogs.length;

  // Convert to 0-10 scale (scores are stored as 0.8-1.2 range typically)
  // For display purposes, we'll normalize to 0-10
  return parseFloat((avg * 10).toFixed(1));
};

/**
 * Calculate all section rolling averages
 *
 * @param {Object} allLogs - All daily logs
 * @param {number} days - Number of days to include (default: 7)
 * @returns {Object} Object with rolling averages for each section
 */
export const calculateAllRollingAverages = (allLogs, days = 7) => {
  return {
    nutrition: calculateRollingAverage(allLogs, 'nutrition', days),
    energy: calculateRollingAverage(allLogs, 'energy', days),
    activity: calculateRollingAverage(allLogs, 'activity', days),
    recovery: calculateRollingAverage(allLogs, 'recovery', days),
  };
};

/**
 * Calculate overall rolling average score
 *
 * @param {Object} allLogs - All daily logs
 * @param {number} days - Number of days to include (default: 7)
 * @returns {number} Overall rolling average score (0-10)
 */
export const calculateOverallRollingAverage = (allLogs, days = 7) => {
  if (!allLogs || Object.keys(allLogs).length === 0) {
    return 0;
  }

  const sortedDates = Object.keys(allLogs).sort().reverse();

  const recentScores = sortedDates
    .slice(0, days)
    .filter(date => allLogs[date]?.scoreData?.score)
    .map(date => allLogs[date].scoreData.score);

  if (recentScores.length === 0) {
    return 0;
  }

  const sum = recentScores.reduce((acc, val) => acc + val, 0);
  return parseFloat((sum / recentScores.length).toFixed(1));
};

/**
 * Get score color based on value
 *
 * @param {number} score - Score value (0-10)
 * @returns {string} Color hex code
 */
export const getScoreColor = (score) => {
  if (score >= 9) return '#4CAF50'; // Green
  if (score >= 7) return '#8BC34A'; // Light green
  if (score >= 5) return '#FFC107'; // Amber
  if (score >= 3) return '#FF9800'; // Orange
  return '#F44336'; // Red
};
