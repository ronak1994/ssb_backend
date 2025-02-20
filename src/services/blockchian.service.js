import {Blockchain, GlobalSupply, Phase} from '../models/blockchain.model.js';
import User from '../models/user.model.js';
import TransactionHistory from '../models/transactions.model.js';
import InvestorBonus from '../models/investorBonus.model.js';

/**
 * Calculate Phase Bonus based on the active phase and given blockchainId.
 * 
 */
export const calculatePhaseBonus = async (blockchainId) => {
  try {
    // Step 1: Fetch the active phase
    const activePhase = await Phase.findOne({ isActive: true }).lean();
    if (!activePhase) {
      throw new Error('No active phase found');
    }

    // Step 2: Fetch the blockchain details
    const blockchain = await Blockchain.findById(blockchainId);
    if (!blockchain) {
      throw new Error('Invalid blockchainId');
    }

   // Step 3: Find the corresponding phase bonus from the blockchain data
     const phaseData = blockchain.phaseWiseBonuses.find(
       (phase) => phase.phaseName === activePhase.name
     );

     if (!phaseData) {
      throw new Error(`Phase bonus not found for phase: ${activePhase.name}`);
    }

    console.log(`📌 Phase Bonus for Blockchain ${blockchainId}:`, phaseData.phaseBonus);
    return phaseData.phaseBonus;

  } catch (error) {
    console.error('❌ Error calculating phase bonus:', error);
    return 0;
  }
};

/**
 * Get all blockchains
 */
const getAllBlockchains = async () => {
  return Blockchain.find({});
};

/**
 * Get blockchain by ID
 */
const getBlockchainById = async (blockchainId) => {
  return Blockchain.findById(blockchainId);
};


const savePurchaseTransaction = async (transactionData) => {

  const {
    userId,
    blockchainId,
    senderWalletId,
    receiverWalletId,
    transactionHash,
    amount,
    currency,
    nftAddress
  } = transactionData;

  // Step 1: Fetch Blockchain Data
  const blockchain = await Blockchain.findById(blockchainId);
  if (!blockchain) {
    throw new Error('Invalid blockchainId');
  }

   // Step 2: Fetch User Data
   const user = await User.findById(userId);
   if (!user) {
     throw new Error('User not found');
   }

   // Step 3: Add blockchainId to User's `blockchains` array and update activeBlockchainId
    user.blockchainIds.push(blockchainId);
    await user.save();
  
    // Step 4: Save Purchase Transaction

   
    const purchase = await TransactionHistory.create({
      userId,
      transactionType:"purchase",
      blockchainId,
      senderWalletId,
      receiverWalletId,
      amount,
      currency,
      transactionHash
    });
      
  // Step 5: Save Investor Bonus Transaction (if applicable)
  
  
 
 

  

  await TransactionHistory.create({
    userId,
    transactionType:"phase_bonus",
    blockchainId,
    senderWalletId:"company_wallet",
    receiverWalletId:senderWalletId,
    amount:calculatePhaseBonus(blockchainId),
    currency:"SSBT",
    transactionHash
  });

  // Step 7: Save 30-Day Bonus Pool Transaction
  await InvestorBonus.create({
    userId,
    blockchainId,
    nftAddress,
    decentralizedWalletAddress:senderWalletId
  });

  return user;

};


/**
 * Fetch the latest global supply data.
 */
const getGlobalSupplyData = async () => {
  try {
    const globalSupply = await GlobalSupply.findOne().sort({ createdAt: -1 });
    return globalSupply || { message: "No global supply data found" };
  } catch (error) {
    throw new Error("Error fetching global supply data: " + error.message);
  }
};


/**
 * Fetch all phases
 */
 const fetchAllPhases = async () => {
  try {
    return await Phase.find({});
  } catch (error) {
    throw new Error(`Error fetching phases: ${error.message}`);
  }
};

/**
 * Fetch active phase
 */
const fetchActivePhase = async () => {
  try {
    const activePhase = await Phase.findOne({ isActive: true });
    if (!activePhase) {
      throw new Error("No active phase found.");
    }
    return activePhase;
  } catch (error) {
    throw new Error(`Error fetching active phase: ${error.message}`);
  }
};


export { getAllBlockchains, fetchAllPhases, fetchActivePhase, getBlockchainById, getGlobalSupplyData, savePurchaseTransaction };
