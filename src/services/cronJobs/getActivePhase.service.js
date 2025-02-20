import Web3 from 'web3';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import cron from 'node-cron';
import { Phase } from '../../models/blockchain.model.js'; // Import Phase model
import logger from '../../config/logger.js';

dotenv.config();

// Load ABI from the file (Ensure the file exists)
const ABI = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'contractABI.json'), 'utf-8'));

// Define contract details
const CONTRACT_ADDRESS = "0xa40c02AF413204B81718c8A982E00a85E1f21694"; // Replace with your contract address
const WEB3_PROVIDER = "https://data-seed-prebsc-1-s1.binance.org:8545/"; // Use correct provider URL

// Initialize Web3
const web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER));
const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS); // Initialize contract

/**
 * Fetches the active phase from the blockchain and updates the database.
 */
const updateActivePhase = async () => {
  try {
    logger.info("🔄 Fetching active phase from blockchain...");
    
    // Fetch current phase from smart contract
    const activePhase = await contract.methods.currentPhase().call();

    if (activePhase === null) {
      logger.warn("⚠️ No active phase found.");
      return;
    }

    // Convert BigInt to Number
    const phaseIndex = Number(activePhase);

    // Define phase mapping
    const phaseNames = ['A','B','C','D','E'];
    const phaseName = phaseNames[phaseIndex] || 'Unknown Phase';

    logger.info(`📌 Active Phase from Blockchain: ${phaseName}`);

    // Deactivate all existing phases first
    await Phase.updateMany({}, { isActive: false });

    // Find or create phase and update it as active
    const updatedPhase = await Phase.findOneAndUpdate(
      { name: phaseName },
      { isActive: true },
      { new: true, upsert: true }
    );

    logger.info(`✅ Active Phase Updated: ${updatedPhase.name}`);
  } catch (error) {
    logger.error(`❌ Error updating active phase: ${error.message}`);
  }
};

// 🕒 Schedule job to run **every 6 hours**
cron.schedule('0 */6 * * *', async () => {
  logger.info('⏳ Running Active Phase Update Cron Job...');
  await updateActivePhase();
});

export default updateActivePhase;
