import UserFitness from '../models/userFitness.mode.js';
import moment from 'moment';


/**
 * Fetch user's step data
 */
const getUserStepData = async (userId, date, monthYear) => {
  const currentMonth = monthYear || moment().format('YYYY-MM'); // Default to current month

  const userFitness = await UserFitness.findOne({ userId, monthYear: currentMonth });

  if (!userFitness) {
    return { message: 'No step data found for the given period' };
  }

  if (date) {
    // Return stepHistory for the specific date
    return {
      date,
      steps: userFitness.stepHistory[date] || [],
    };
  }

  // Return entire month's step data
  return {
    monthYear: currentMonth,
    dailyWalkingSteps: userFitness.dailyWalkingSteps,
    dailyRealSteps: userFitness.dailyRealSteps,
    stepHistory: userFitness.stepHistory,
  };
};


/**
 * Update user's step count
 */
const updateStepHistory = async (userId, walkingSteps, rewardSteps) => {
  const currentDate = moment().format('DD/MM/YY'); // Get today's date
  const currentMonth = moment().format('YYYY-MM'); // Get current month

  let userFitness = await UserFitness.findOne({ userId, monthYear: currentMonth });

  if (!userFitness) {
    // If no record for the current month, create a new one
    userFitness = new UserFitness({
      userId,
      monthYear: currentMonth,
      dailyWalkingSteps: 0,
      dailyRealSteps: 0,
      stepHistory: {},
    });
  }

  // Ensure stepHistory entry exists for today
  if (!userFitness.stepHistory[currentDate]) {
    userFitness.stepHistory[currentDate] = [];
  }

  // Append new step entry
  userFitness.stepHistory[currentDate].push({
    timestamp: new Date(),
    walkingSteps,
    rewardSteps,
  });

  // Update daily summaries
  userFitness.dailyWalkingSteps += walkingSteps;
  userFitness.dailyRealSteps += rewardSteps;
  userFitness.lastStepUpdate = new Date();

  await userFitness.save();
};

export { updateStepHistory, getUserStepData };
