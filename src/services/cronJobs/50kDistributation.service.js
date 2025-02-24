import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Web3 from 'web3';
import cron from 'node-cron';
import Pool from "../../models/pools.model.js"
import moment from 'moment';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '../../../.env') });
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Ensure Private Key is Valid
if (!PRIVATE_KEY || PRIVATE_KEY.length !== 64) {
  throw new Error("❌ Invalid PRIVATE_KEY! It must be a 64-character hex string without '0x'.");
}

// Load ABI from the file (Ensure the file exists)
const ABI = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'contractABI.json'), 'utf-8'));


// Web3 Setup
const web3 = new Web3(new Web3.providers.HttpProvider("https://data-seed-prebsc-1-s1.binance.org:8545/"));

const contractAddress = "0xa40c02AF413204B81718c8A982E00a85E1f21694";

const formattedPrivateKey = `0x${PRIVATE_KEY}`; // Ensure correct prefix

const contract = new web3.eth.Contract(ABI, contractAddress);
const account = web3.eth.accounts.privateKeyToAccount(formattedPrivateKey);

web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

console.log(`✅ Successfully loaded private key for account: ${account.address}`);



const sendTransaction = async (tx) => {
    try {
        const gas = await tx.estimateGas({ from: account.address });
        const gasPrice = await web3.eth.getGasPrice();

        const txData = {
            from: account.address,
            to: contractAddress,
            gas,
            gasPrice,
            data: tx.encodeABI(),
        };

        const signedTx = await web3.eth.accounts.signTransaction(txData, formattedPrivateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log('Transaction Hash:', receipt.transactionHash);
    } catch (error) {
        console.error('Error sending transaction:', error);
    }
};


const distribute50kDailyRewards = async () => {
    try {

        const today = moment().format('YYYY-MM-DD');
        const poolA = Pool.findOne({date:today, poolType:"PoolA"});
        const poolB = Pool.findOne({date:today, poolType:"PoolB"});
       

        if (poolA.length === 0 && poolB.length === 0) {
            console.log("No eligible users for Pool A or Pool B today.");
            return;
        }

        console.log(`Total eligible users: Pool A - ${poolA.length}, Pool B - ${poolB.length}`);

        // Create batches where each call includes up to 100 users from Pool A and 100 from Pool B
        const batches = splitBatches(poolA, poolB);

        // Process each batch separately
        for (const { batchA, batchB } of batches) {
            console.log(`Sending batch with Pool A: ${batchA.length}, Pool B: ${batchB.length} users...`);
           // await sendTransaction(contract.methods.distribute50kDailyDistribution(batchA, batchB));
        }

    } catch (error) {
        console.error('Error distributing daily 50k rewards:', error);
    }
};


const MAX_BATCH_SIZE = 100; // 100 per pool (Pool A + Pool B = 200 total per call)



/**
 * Splits the list into smaller chunks of MAX_BATCH_SIZE
 */
function splitBatches(poolA, poolB) {
    const batches = [];
    let index = 0;

    while (index < poolA.length || index < poolB.length) {
        const batchA = poolA.slice(index, index + MAX_BATCH_SIZE);
        const batchB = poolB.slice(index, index + MAX_BATCH_SIZE);
        batches.push({ batchA, batchB });
        index += MAX_BATCH_SIZE;
    }

    return batches;
}



// ✅ Test if Cron Works
cron.schedule('59 23 * * *', async () => {

  //cron.schedule("*/10 * * * * *",async () => {
    console.log('🕒 Running scheduled job at GMT-00:00 - 1 minute (23:59 UTC)');
    await distribute50kDailyRewards();
  }, {
    scheduled: true,
    timezone: "Etc/GMT"
  });
