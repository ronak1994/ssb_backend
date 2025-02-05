import {Blockchain} from '../models/blockchain.model.js';
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


export { getAllBlockchains, getBlockchainById, savePurchaseTransaction };
