import mongoose from 'mongoose';

// Schema for NFT Types
const nftTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  blocks: { type: Number, required: true }
});

// Schema for Phase-wise Bonuses
const phaseWiseBonusSchema = new mongoose.Schema({
  phaseName: { type: String, required: true },
  phaseBonus: { type: Number, required: true },
  investorBonus: {
    days: { type: Number, required: true },
    dailyBonusToken: { type: Number, required: true }
  },
  watchBonus: {
    days: { type: Number, default: null },
    dailyBonusToken: { type: Number, default: null }
  },
  totalWithdrawalLimit: { type: Number, required: true }
});

// Schema for Blockchain
const blockchainSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    nftTypes: [nftTypeSchema],
    phaseWiseBonuses: [phaseWiseBonusSchema],
    dailyMineCap: { type: Number, required: true },
    contractAddress: { type: String, required: true },
    mainNftPrice: { type: Number, required: true },
    referPercentage: { type: Number, required: true }
  },
  { timestamps: true, collection: 'blockchains' }
);

// Schema for Global Supply Data
const globalSupplySchema = new mongoose.Schema({
  totalSupply: { type: Number, required: true },
  totalValidatorSupply: { type: Number, required: true },
  totalStakingSupply: { type: Number, required: true },
  totalTeamSupply: { type: Number, required: true },
  dailyValidatorSupply: { type: Number, required: true },
  dailyStakingSupply: { type: Number, required: true },
  totalInvestorSupply: { type: Number, default: null },
  totalFounderSupply: { type: Number, default: null },
  totalCMESupply: { type: Number, default: null },
  totalPartnershipSupply: { type: Number, default: null }
});

// Schema for Phases
const phaseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalSupply: { type: Number, required: true },
  ssbtPrice: { type: Number, required: true },
  isActive: { type: Boolean, default: false }
});

const Blockchain = mongoose.model('Blockchain', blockchainSchema);
const GlobalSupply = mongoose.model('GlobalSupply', globalSupplySchema);
const Phase = mongoose.model('Phase', phaseSchema);

export { Blockchain, GlobalSupply, Phase };
