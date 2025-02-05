import mongoose from 'mongoose';

const investorBonusSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    blockchainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blockchain',
      required: true,
      index: true,
    },
    dailyBonusAmount: {
      type: mongoose.Schema.Types.Decimal128, // SSB token amount per day
      required: true,
    },
    totalDays: {
      type: Number, // Total days the bonus is valid
      required: true,
      default: 30,
    },
    daysRemaining: {
      type: Number, // Days left for the bonus
      required: true,
      default: 30,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'expired'],
      default: 'active',
    },
    lastProcessedDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, collection: 'investor_bonuses' }
);

investorBonusSchema.index({ userId: 1, blockchainId: 1 }, { unique: true });

const InvestorBonus = mongoose.model('InvestorBonus', investorBonusSchema);

export default InvestorBonus;
