/**
 * Daily Performance Score Calculator
 *
 * Formula: Score = (Nutrition × Energy × Activity × Recovery) × 10
 * Result: 1-10 scale
 */

/**
 * Calculate Nutrition score
 * Nutrition = (Protein ÷ Calories) × 10
 *
 * @param {number} protein - Grams of protein consumed
 * @param {number} calories - Total calories consumed
 * @returns {number} Nutrition score
 */
export const calculateNutrition = (protein, calories) => {
  if (!calories || calories === 0) return 0;
  return (protein / calories) * 10;
};

/**
 * Calculate Energy score based on calorie balance vs maintenance
 *
 * @param {number} calories - Calories consumed
 * @param {number} maintenance - Maintenance calories
 * @param {string} goal - 'deficit', 'maintenance', or 'surplus'
 * @returns {number} Energy score (0.8 - 1.0)
 */
export const calculateEnergy = (calories, maintenance, goal = 'maintenance') => {
  if (!maintenance || maintenance === 0) return 0;

  const ratio = calories / maintenance;

  // Define target ranges based on goal
  let targetMin, targetMax;
  switch (goal) {
    case 'deficit':
      targetMin = 0.75; // 75% of maintenance
      targetMax = 0.90; // 90% of maintenance
      break;
    case 'surplus':
      targetMin = 1.10; // 110% of maintenance
      targetMax = 1.25; // 125% of maintenance
      break;
    case 'maintenance':
    default:
      targetMin = 0.95; // 95% of maintenance
      targetMax = 1.05; // 105% of maintenance
      break;
  }

  // Within target range
  if (ratio >= targetMin && ratio <= targetMax) {
    return 1.0;
  }

  // Slightly off target
  const slightlyOffMin = targetMin - 0.10;
  const slightlyOffMax = targetMax + 0.10;
  if (ratio >= slightlyOffMin && ratio <= slightlyOffMax) {
    return 0.9;
  }

  // Too far off target
  return 0.8;
};

/**
 * Calculate Activity score based on steps and workout type
 *
 * @param {number} steps - Daily step count
 * @param {boolean} didLift - Whether weight lifting was done
 * @param {boolean} didCardio - Whether cardio was done
 * @returns {number} Activity score (0.9 - 1.2)
 */
export const calculateActivity = (steps, didLift = false, didCardio = false) => {
  const hasWorkout = didLift || didCardio;

  if (steps < 5000) {
    return 0.9;
  } else if (steps >= 5000 && steps < 8000) {
    return 1.0;
  } else if (steps >= 8000 && steps < 12000) {
    return hasWorkout ? 1.1 : 1.0;
  } else { // steps >= 12000
    return hasWorkout ? 1.2 : 1.1;
  }
};

/**
 * Calculate Recovery score based on sleep hours and stress level
 *
 * @param {number} sleepHours - Hours of sleep
 * @param {boolean} highStress - Whether stress level is high
 * @returns {number} Recovery score (0.8 - 1.0)
 */
export const calculateRecovery = (sleepHours, highStress = false) => {
  if (highStress || sleepHours < 6) {
    return 0.8;
  } else if (sleepHours >= 6 && sleepHours < 7) {
    return 0.9;
  } else if (sleepHours >= 7 && sleepHours <= 8) {
    return 1.0;
  } else { // More than 8 hours
    return 0.95; // Slightly reduce for oversleeping
  }
};

/**
 * Calculate the Daily Performance Score
 *
 * @param {Object} data - Daily metrics
 * @param {number} data.protein - Grams of protein
 * @param {number} data.calories - Total calories
 * @param {number} data.maintenance - Maintenance calories
 * @param {string} data.goal - Goal type: 'deficit', 'maintenance', or 'surplus'
 * @param {number} data.steps - Daily step count
 * @param {boolean} data.didLift - Whether weight lifting was done
 * @param {boolean} data.didCardio - Whether cardio was done
 * @param {number} data.sleepHours - Hours of sleep
 * @param {boolean} data.highStress - Whether stress level is high
 * @returns {Object} Score breakdown and total
 */
export const calculateDailyPerformanceScore = (data) => {
  const {
    protein = 0,
    calories = 0,
    maintenance = 2000,
    goal = 'maintenance',
    steps = 0,
    didLift = false,
    didCardio = false,
    sleepHours = 7,
    highStress = false
  } = data;

  const nutrition = calculateNutrition(protein, calories);
  const energy = calculateEnergy(calories, maintenance, goal);
  const activity = calculateActivity(steps, didLift, didCardio);
  const recovery = calculateRecovery(sleepHours, highStress);

  // Calculate final score
  const score = (nutrition * energy * activity * recovery) * 10;

  // Clamp to 1-10 range
  const finalScore = Math.max(1, Math.min(10, score));

  return {
    score: finalScore,
    breakdown: {
      nutrition: nutrition.toFixed(2),
      energy: energy.toFixed(2),
      activity: activity.toFixed(2),
      recovery: recovery.toFixed(2)
    },
    raw: {
      nutrition,
      energy,
      activity,
      recovery
    }
  };
};
