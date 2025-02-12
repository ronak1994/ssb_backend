import {Blockchain, GlobalSupply, Phase} from '../models/blockchain.model.js';
import { updateUserById } from './user.service.js';
import { saveTransaction } from './transaction.service.js';


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
    transactionId,
    paymentStatus,
    totalAmount,
    currency,
    paymentGateway,
  } = transactionData;

  // Step 1: Fetch Blockchain Data
  const blockchain = await Blockchain.findById(blockchainId);
  if (!blockchain) {
    throw new Error('Invalid blockchainId');
  }

  // Step 2: Update User Profile with Purchased Blockchain
  await updateUserById(userId, { blockchainId: blockchainId });

  //update transaction done in company wallet
  await saveTransaction(
    userId,
    {transactionType:"deposite_against_purchase"},
    {amount:""},
    {currency:"SSBT"},
    {transactionStatus:"completed"},
    {transactionHash:""},
    {senderWalletId:""},
    {receiverWalletId:""}

   );

    //update Phase Bonus in buyer wallet
    await saveTransaction(
      userId,
      {transactionType:"phase_bonus"},
      {amount:""},
      {currency:"SSBT"},
      {transactionStatus:"completed"},
      {transactionHash:""},
      {senderWalletId:""},
      {receiverWalletId:""}
  
     );
  
     //update referal Bonus in referer wallet
     await saveTransaction(
      userId,
      {transactionType:"referral_bonus"},
      {amount:""},
      {currency:"SSBT"},
      {transactionStatus:"completed"},
      {transactionHash:""},
      {senderWalletId:""},
      {receiverWalletId:""}
  
     );

      //update user in 30 day investor bonus database
      
  return transaction;
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
