import mongoose from 'mongoose';

const phaseSchema = new mongoose.Schema({
  phase: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'E'],
    required: true,
  },
  totalTokens: {
    type: mongoose.Schema.Types.Decimal128, // Total SSB tokens allocated for this phase
    required: true,
  },
  tokenPrice: {
    type: mongoose.Schema.Types.Decimal128, // Price per SSB token in this phase
    required: true,
  },
  welcomeBonus: {
    type: mongoose.Schema.Types.Decimal128, // Bonus amount for this phase
    required: true,
  },
});

const watchBonusSchema = new mongoose.Schema({
  blockchainTier: {
    type: String,
    enum: ['White', 'Black', 'Silver', 'Gold', 'Green'],
    required: true,
  },
  dailyTokens: {
    type: Number, // Number of tokens given daily
    required: true,
  },
  durationDays: {
    type: Number, // How many days the watch bonus is valid
    required: true,
  },
});

const investorBonusSchema = new mongoose.Schema({
  blockchainTier: {
    type: String,
    enum: ['White', 'Black', 'Silver', 'Gold', 'Green'],
    required: true,
  },
  tokensPerDay: {
    type: Number, // Number of tokens awarded per day
    required: true,
  },
  durationDays: {
    type: Number, // Duration of investor bonus
    required: true,
  },
});

const blockchainSchema = new mongoose.Schema(
  {
    blockchainId: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true, // Automatically generates unique wallet ID
      unique: true,
      required: true,
      index: true, // Allows fast lookups
    },
    name: {
      type: String,
      default: null, // Blockchain name (nullable)
    },
    type: {
      type: String,
      default: null,
    },
    price: {
      type: mongoose.Schema.Types.Decimal128, // Price in USDT/SSB
      default: null,
    },
    referPercentage: {
      type: Number, // Referral bonus percentage
      default: null,
    },

    // Phase-wise Welcome Bonus + Total Tokens + Per Token Price
    phases: [phaseSchema],

    // Watch Bonus
    watchBonuses: [watchBonusSchema],

    // Investor Bonus
    investorBonuses: [investorBonusSchema],

    // Withdrawal Limit per Blockchain
    withdrawalLimit: {
      type: mongoose.Schema.Types.Decimal128, // Maximum withdrawal limit
      required: true,
    },
  },
  { timestamps: true, collection: 'blockchains' }
);

const Blockchain = mongoose.model('Blockchain', blockchainSchema);

export default Blockchain;
