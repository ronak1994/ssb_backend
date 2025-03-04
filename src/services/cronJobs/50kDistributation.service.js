import dotenv from 'dotenv';
import Web3 from 'web3';
import cron from 'node-cron';
import mongoose from 'mongoose';
import DailyReward from "../../models/dailyrewards.model.js"
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '../../../.env') });
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const MAX_BATCH_SIZE = 100; // 100 per pool (Pool A + Pool B = 200 total per call)

// Ensure Private Key is Valid
if (!PRIVATE_KEY || PRIVATE_KEY.length !== 64) {
    throw new Error("❌ Invalid PRIVATE_KEY! It must be a 64-character hex string without '0x'.");
  }
  

// Define contract details
const WEB3_PROVIDER = process.env.WEB3_PROVIDER;
const nftAddresses = {
    Green: process.env.GREEN_NFT,
    Gold: process.env.GOLD_NFT,
    Silver: process.env.SILVER_NFT,
    Black: process.env.WHITE_NFT,
    White: process.env.BLACK_NFT,
};

// Load ABI from the file (Ensure the file exists)
const ABI = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'DistributionABI.json'), 'utf-8'));
// Web3 Setup
const web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER));

const contractAddress = "0x8dF91e8A12FD54D5850629b8e4c13D5ab8134977"; //process.env.DISTRIBUATION;

const formattedPrivateKey = `0x${PRIVATE_KEY}`; // Ensure correct prefix

const contract = new web3.eth.Contract(ABI, contractAddress);
const account = web3.eth.accounts.privateKeyToAccount(formattedPrivateKey);

web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

console.log(`✅ Successfully loaded private key for account: ${account.address}`);




async function distributeBonusForAllNFTs(contract) {
    for (const [key, nftAddress] of Object.entries(nftAddresses)) {
        if (nftAddress) {  // Ensure the address is not undefined or null
            try {
                console.log(`Distributing bonus for ${key} NFT at ${nftAddress}`);
                const receipt =  await sendTransaction(contract.methods.distributeInvestorBonusDaily(nftAddress));
                
                if (receipt) {
                    console.log(`Transaction successful for ${key}!`);
                    console.log(`Transaction Hash: ${receipt.transactionHash}`);
                } else {
                    console.log(`Transaction failed or reverted for ${key}`);
                }
            } catch (error) {
                console.error(`Error distributing bonus for ${key}:`, error);
            }
        }
    }
}



// const sendTransaction = async (tx) => {
//     try {
//         const gasLimit = 200000; // Set a higher gas limit manually
//         const gasPrice = await web3.eth.getGasPrice();

//         const txData = {
//             from: account.address,
//             to: contractAddress,
//             gas: gasLimit,
//             gasPrice,
//             data: tx.encodeABI(),
//         };

//         const signedTx = await web3.eth.accounts.signTransaction(txData, formattedPrivateKey);
//         const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

//         console.log('Transaction Hash:', receipt.transactionHash);
//         return receipt;
//     } catch (error) {
//         console.error('Error sending transaction:', error);
//     }
// };

const sendTransaction = async (tx) => {
    try {
        const gasPrice = BigInt(await web3.eth.getGasPrice()); // Ensure gas price is a BigInt
        const estimatedGas = BigInt(await tx.estimateGas({ from: account.address })); // Ensure gas limit is a BigInt

        console.log(`Estimated Gas: ${estimatedGas}`);
        console.log(`Gas Price: ${gasPrice}`);

        const gasLimit = estimatedGas * BigInt(12) / BigInt(10); // Adding 20% buffer

        const txData = {
            from: account.address,
            to: contractAddress,
            gas: Number(gasLimit), // Convert BigInt to Number for compatibility
            gasPrice: gasPrice.toString(), // Ensure gas price is in correct format
            data: tx.encodeABI(),
        };

        const signedTx = await web3.eth.accounts.signTransaction(txData, formattedPrivateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        console.log('Transaction Hash:', receipt.transactionHash);
        return receipt;
    } catch (error) {
        console.error('Error sending transaction:', error);
    }
};









// Schedule jobs to run daily at midnight (GMT+00)
//cron.schedule('0 0 * * *', async () => {
cron.schedule("*/10 * * * * *", async () => {
   // console.log('Executing daily rewards distribution at GMT+00...');
   // const receipt =  await sendTransaction(contract.methods.distributeInvestorBonusDaily("0xd0d6DB480C2Db70244Ca530bA78958ABf54Dc3e2")); 
    //console.log(receipt);
    //    await distributeBonusForAllNFTs(contract);
});

setTimeout(async () => {
    console.log('Executing daily rewards distribution at GMT+00...');
  //  const receipt =  await sendTransaction(contract.methods.distributeInvestorBonusDaily("0x785D9267A1356355e3d995690586fFC1d464DC09")); 
   // console.log(receipt);
    console.log("This function runs only once after 10 seconds");
}, 10000); // 10 seconds

console.log('Cron jobs set to run daily at midnight GMT+00.');


