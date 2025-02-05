import Pool from '../models/pools.model.js';
import moment from 'moment';

/**
 * Save Pool Entry for a User
 */
const savePoolEntry = async (userId, poolType, stepsRecorded) => {
  const today = moment().format('YYYY-MM-DD');

  // Check if the user has already entered this pool today
  const existingEntry = await Pool.findOne({ userId, poolType, date: today });
  if (existingEntry) {
    return { message: `User has already entered ${poolType} for today.` };
  }

  // Save the pool entry
  const newPoolEntry = await Pool.create({
    userId,
    poolType,
    date: today,
    stepsRecorded,
    rewardTokens: calculateRewards(poolType),
  });

  return { message: `${poolType} entry saved successfully.`, data: newPoolEntry };
};

/**
 * Calculate rewards based on pool type
 */
const calculateRewards = (poolType) => {
  if (poolType === 'PoolA') return 50; // Example: 50 tokens for Pool A
  if (poolType === 'PoolB') return 100; // Example: 100 tokens for Pool B
  return 0;
};

export { savePoolEntry };
