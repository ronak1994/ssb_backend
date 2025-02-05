import UserFitness from '../models/userWallet.model.js';

/**
 * Update user's step history and daily step count
 */
const updateStepHistory = async (userId, steps, rewardSteps, source) => {
  const currentDate = new Date();
  const monthYear = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;

  // Find the user fitness record for the current month or create a new one
  let userFitness = await UserFitness.findOne({ userId, monthYear });

  if (!userFitness) {
    userFitness = new UserFitness({ userId, monthYear, stepHistory: [] });
  }

  // Update step history
  const newStepEntry = {
    timestamp: currentDate,
    walkingSteps: steps,
    rewardSteps: rewardSteps,
    poolAEligible: steps >= 0 && steps <= 1500,
    poolBEligible: steps > 1500 && steps <= 10000,
  };

  userFitness.stepHistory.push(newStepEntry);
  userFitness.dailyWalkingSteps += steps;
  userFitness.dailyRealSteps += rewardSteps;
  userFitness.fitnessSource = source;
  userFitness.lastStepUpdate = currentDate;

  await userFitness.save();
  return userFitness;
};

export { updateStepHistory };
