import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import { savePoolEntry } from '../services/pools.service.js';
import { getUserStepData } from '../services/fitness.service.js'; // Fetch steps from DB

const saveDailyPoolA = catchAsync(async (req, res) => {
  //const userId = req.user.id;
  const userId = req.body.userId;

  // Fetch user's step data from database
  const userFitness = await getUserStepData(userId);

  if (!userFitness) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: 'User fitness data not found' });
  }

  if (userFitness.dailyWalkingSteps >= 1500) {
    // If step condition is met, save Pool A entry
    const response = await savePoolEntry(userId, 'PoolA', userFitness.dailyWalkingSteps);
    res.status(httpStatus.CREATED).json(response);
  } else {
    res.status(httpStatus.BAD_REQUEST).json({ message: 'Insufficient steps for Pool A' });
  }
});

const saveDailyPoolB = catchAsync(async (req, res) => {
  // const userId = req.user.id;
  const userId = req.body.userId;
  // Fetch user's step data from database
  const userFitness = await getUserStepData(userId);

  if (!userFitness) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: 'User fitness data not found' });
  }

  if (userFitness.dailyWalkingSteps >= 10000) {
    // If step condition is met, save Pool B entry
    const response = await savePoolEntry(userId, 'PoolB', userFitness.dailyWalkingSteps);
    res.status(httpStatus.CREATED).json(response);
  } else {
    res.status(httpStatus.BAD_REQUEST).json({ message: 'Insufficient steps for Pool B' });
  }
});

export { saveDailyPoolA, saveDailyPoolB };
