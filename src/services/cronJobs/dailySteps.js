import cron from 'node-cron';
import UserFitness from '../models/userFitness.model.js';

/**
 * Resets daily walking steps and real steps every GMT 00:00
 */
const resetDailySteps = async () => {
  try {
    console.log('🚀 Running daily step reset job...');
    await UserFitness.updateMany({}, { dailyWalkingSteps: 0, dailyRealSteps: 0 });
    console.log('✅ Daily step reset completed');
  } catch (error) {
    console.error('❌ Error resetting daily steps:', error);
  }
};

// Schedule job to run at 00:00 GMT every day
cron.schedule('0 0 * * *', resetDailySteps, {
  scheduled: true,
  timezone: 'Etc/GMT',
});

export default resetDailySteps;
