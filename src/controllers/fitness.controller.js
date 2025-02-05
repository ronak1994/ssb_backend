import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import { updateStepHistory } from '../services/fitness.service.js';

/**
 * API to update user's step count
 */
const updateSteps = catchAsync(async (req, res) => {
  const { steps, rewardSteps, source, userId } = req.body;
 // const userId = req.user.id; // Extract user from JWT auth
  const result = await updateStepHistory(userId, steps, rewardSteps, source);
  res.status(httpStatus.OK).json({ message: 'Steps updated successfully', data: result });
});

export { updateSteps };
