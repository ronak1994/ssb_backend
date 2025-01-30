import mongoose from 'mongoose';

const dailyStepSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    required: true,
    default: Date.now, // Stores both date & exact time of step entry
  },
  steps: {
    type: Number,
    default: 0,
    required: true,
  },
  poolAEligible: {
    type: Boolean,
    default: false,
  },
  poolBEligible: {
    type: Boolean,
    default: false,
  },
});

const userFitnessSchema = new mongoose.Schema(
  {
    userFitnessId: {
          type: mongoose.Schema.Types.ObjectId,
          auto: true, // Automatically generates unique wallet ID
          unique: true,
          required: true,
          index: true, // Allows fast lookups
        },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    monthYear: {
      type: String, // Format: "YYYY-MM", 1 user, 1 month,1 entry. every month 1 new record will be inserted for each user
      required: true,
    },
    dailySteps: {
      type: Number, // it will be summry of the day, overwritten at GMT-00 everyday
      default: 0,
    },
    lastStepUpdate: {
      type: Date,
      default: Date.now,
    },
    fitnessSource: {
      type: String,
      enum: ['Google Fit', 'Apple HealthKit', 'Manual'],
      default: 'Manual',
    },
    stepHistory: [dailyStepSchema], // Stores timestamped step history
  },
  { timestamps: true }
);

userFitnessSchema.index({ userId: 1, monthYear: 1 }, { unique: true });

const UserFitness = mongoose.model('UserFitness', userFitnessSchema);

export default UserFitness;
