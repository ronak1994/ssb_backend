import {
  Blockchain,
  GlobalSupply,
  Phase
} from '../models/blockchain.model.js';
import User from '../models/user.model.js';
import TransactionHistory from '../models/transactions.model.js';
import InvestorBonus from '../models/investorBonus.model.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), ".env");

dotenv.config({ path: envPath });



/**
* Calculate Phase Bonus based on the active phase and given blockchainId.
* 
*/
export const calculatePhaseBonus = async (blockchainId) => {
  try {
      // Step 1: Fetch the active phase
      const activePhase = await Phase.findOne({
          isActive: true
      }).lean();
      if (!activePhase) {
          throw new Error('No active phase found');
      }

      // Step 2: Fetch the blockchain details
      const blockchain = await Blockchain.findById(blockchainId);
      if (!blockchain) {
          throw new Error('Invalid blockchainId');
      }

      // Step 3: Find the corresponding phase bonus from the blockchain data
      const phaseData = await blockchain.phaseWiseBonuses.find(
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

const saveSwapTransaction = async (transactionData) => {
    const {
        userId,
        senderWalletId,
        transactionHash,
        amount,
        currency
    } = transactionData;

    // **Ensure amount is a valid number**
    const amount1 = Number(amount);
    if (isNaN(amount1)) {
        throw new Error('Amount must be a valid number');
    }

    const purchase = await TransactionHistory.create({
        userId,
        transactionType: "swap",
        senderWalletId,
        receiverWalletId:"company_wallet",
        amount: amount1,
        currency,
        transactionHash
    });

    return purchase;
}



const savePurchaseTransaction = async (transactionData) => {

  const {
      userId,
      blockchainId,
      senderWalletId,
      receiverWalletId,
      transactionHash,
      amount,
      currency,
      nftAddress,
      tokenId,
      welcomeBonusAmount,
      referralBonusAmount,
      referrerWalletId,
      referrerNftAddress,
      referrerUserId
  } = transactionData;



  // Step 1: Fetch Blockchain Data
  const blockchain = await Blockchain.findById(blockchainId).lean();
  if (!blockchain) {
      throw new Error('Invalid blockchainId');
  }

  // **Ensure amount is a valid number**
  const amount1 = Number(amount);
  if (isNaN(amount1)) {
      throw new Error('Amount must be a valid number');
  }


  //Step 2: Fetch User Data
  const user = await User.findById(userId);
  if (!user) {
      throw new Error('User not found');
  }

  //Step 3: Add blockchainId to User's `blockchains` array and update activeBlockchainId
  user.blockchainIds.push({
      blockchainId,
      tokenId
  });
  await user.save();

   // Step 4: Save purchase Transaction    
  const purchase = await TransactionHistory.create({
      userId,
      transactionType: "purchase",
      blockchainId,
      senderWalletId,
      receiverWalletId,
      amount: amount1,
      currency,
      transactionHash
  });

  // Step 6: Save Investor Bonus Transaction (if applicable)

  const phaseBonusAmount = await calculatePhaseBonus(blockchainId); // ✅ Await the async function

  await TransactionHistory.create({
      userId,
      transactionType: "phase_bonus",
      blockchainId,
      senderWalletId: "company_wallet",
      receiverWalletId: senderWalletId,
      amount: phaseBonusAmount,
      currency: "SSBT",
      transactionHash
  });

   // Step 7: Save Refferal Bonus Transaction (if applicable)
   const refferalPercent = {
    "0xAa84dd899F0831A956210b7016cC3817Ab537B1a": ".07",
    "0x7f70F3737f856a07bD428dfc1038957F976F1562": ".07",
    "0x3DaD996bC84ABcB22dbbB2a9e2a2Bf994eA8B93c": ".08",
    "0x7E3e103853E23F78cfCC43B3309cE2E6659C072A": ".10",
    "0x400fBDE10146750d64bbA3DD5f1bE177F2822BB3": ".15"
  };
   const refPecent = refferalPercent[referrerNftAddress];
   
   const referralBonusAmount1 = amount1 * refPecent ;
   
   if(referrerUserId){
    await TransactionHistory.create({
      userId:referrerUserId,
      transactionType: "referral_bonus",
      blockchainId,
      senderWalletId: "company_wallet",
      receiverWalletId: referrerWalletId,
      amount: referralBonusAmount1,
      currency: "SSBT",
      transactionHash
  });
   }  
   

  // Step 7: Save 30 days bonus pool
  await InvestorBonus.create({
    userId,
    blockchainId,
    nftAddress,
    decentralizedWalletAddress:senderWalletId,
    tokenId
  });

  return user;

};


/**
* Fetch the latest global supply data.
*/
const getGlobalSupplyData = async () => {
  try {
      const globalSupply = await GlobalSupply.findOne().sort({
          createdAt: -1
      });
      return globalSupply || {
          message: "No global supply data found"
      };
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
      const activePhase = await Phase.findOne({
          isActive: true
      });
      if (!activePhase) {
          throw new Error("No active phase found.");
      }
      return activePhase;
  } catch (error) {
      throw new Error(`Error fetching active phase: ${error.message}`);
  }
};




export {
  getAllBlockchains,
  fetchAllPhases,
  fetchActivePhase,
  getBlockchainById,
  getGlobalSupplyData,
  saveSwapTransaction,
  savePurchaseTransaction
};