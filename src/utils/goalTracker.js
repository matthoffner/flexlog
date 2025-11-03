/**
 * Get the start and end dates of the current week (Monday to Sunday)
 */
export const getCurrentWeekDates = (date = new Date()) => {
  const current = new Date(date);
  const dayOfWeek = current.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust if Sunday

  const monday = new Date(current);
  monday.setDate(current.getDate() + diff);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return {
    start: monday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0]
  };
};

/**
 * Calculate weekly progress for goals
 */
export const calculateWeeklyProgress = (workouts, nutritionLogs) => {
  const { start, end } = getCurrentWeekDates();

  let totalWorkouts = 0;
  let totalReps = 0;
  let totalProtein = 0;
  let totalCalories = 0;

  // Calculate workout stats
  Object.entries(workouts).forEach(([date, dayWorkouts]) => {
    if (date >= start && date <= end) {
      totalWorkouts += dayWorkouts.length;
      dayWorkouts.forEach(workout => {
        totalReps += (workout.sets || 0) * (workout.reps || 0);
      });
    }
  });

  // Calculate nutrition stats
  Object.entries(nutritionLogs).forEach(([date, dayLogs]) => {
    if (date >= start && date <= end) {
      dayLogs.forEach(log => {
        totalProtein += log.protein || 0;
        totalCalories += log.calories || 0;
      });
    }
  });

  return {
    workouts: totalWorkouts,
    totalReps,
    protein: Math.round(totalProtein),
    calories: Math.round(totalCalories)
  };
};

/**
 * Check if all goals are met
 */
export const checkGoalsComplete = (progress, goals) => {
  if (goals.workouts === 0 && goals.totalReps === 0 && goals.protein === 0 && goals.calories === 0) {
    return false; // No goals set
  }

  const workoutsGoalMet = goals.workouts === 0 || progress.workouts >= goals.workouts;
  const repsGoalMet = goals.totalReps === 0 || progress.totalReps >= goals.totalReps;
  const proteinGoalMet = goals.protein === 0 || progress.protein >= goals.protein;
  const caloriesGoalMet = goals.calories === 0 || progress.calories >= goals.calories;

  return workoutsGoalMet && repsGoalMet && proteinGoalMet && caloriesGoalMet;
};

/**
 * Determine badge level based on consecutive weeks of goal completion
 */
export const determineBadgeLevel = (consecutiveWeeks) => {
  if (consecutiveWeeks >= 12) return 'DIAMOND';
  if (consecutiveWeeks >= 8) return 'PLATINUM';
  if (consecutiveWeeks >= 4) return 'GOLD';
  if (consecutiveWeeks >= 2) return 'SILVER';
  return 'BRONZE';
};

/**
 * Award badge for completing weekly goals
 */
export const awardBadgeIfEligible = (badges, consecutiveWeeks) => {
  const weekKey = getCurrentWeekDates().start;

  // Check if badge already awarded for this week
  const existingBadge = badges.find(badge => badge.weekKey === weekKey);
  if (existingBadge) {
    return badges; // Already awarded
  }

  const level = determineBadgeLevel(consecutiveWeeks);
  const newBadge = {
    name: `Week ${consecutiveWeeks} Goals`,
    level,
    earnedDate: new Date().toISOString(),
    weekKey,
    consecutiveWeeks
  };

  return [...badges, newBadge];
};

/**
 * Calculate consecutive weeks of goal completion
 */
export const calculateConsecutiveWeeks = (workouts, nutritionLogs, goals) => {
  let consecutive = 0;
  let currentDate = new Date();

  // Check current week first
  const currentProgress = calculateWeeklyProgress(workouts, nutritionLogs);
  if (!checkGoalsComplete(currentProgress, goals)) {
    return consecutive; // Current week not complete
  }
  consecutive++;

  // Check previous weeks (up to 52 weeks)
  for (let i = 1; i < 52; i++) {
    currentDate.setDate(currentDate.getDate() - 7);
    const weekDates = getCurrentWeekDates(currentDate);

    let weekWorkouts = 0;
    let weekReps = 0;
    let weekProtein = 0;
    let weekCalories = 0;

    // Calculate stats for this week
    Object.entries(workouts).forEach(([date, dayWorkouts]) => {
      if (date >= weekDates.start && date <= weekDates.end) {
        weekWorkouts += dayWorkouts.length;
        dayWorkouts.forEach(workout => {
          weekReps += (workout.sets || 0) * (workout.reps || 0);
        });
      }
    });

    Object.entries(nutritionLogs).forEach(([date, dayLogs]) => {
      if (date >= weekDates.start && date <= weekDates.end) {
        dayLogs.forEach(log => {
          weekProtein += log.protein || 0;
          weekCalories += log.calories || 0;
        });
      }
    });

    const weekProgress = {
      workouts: weekWorkouts,
      totalReps: weekReps,
      protein: Math.round(weekProtein),
      calories: Math.round(weekCalories)
    };

    if (checkGoalsComplete(weekProgress, goals)) {
      consecutive++;
    } else {
      break; // Streak broken
    }
  }

  return consecutive;
};
