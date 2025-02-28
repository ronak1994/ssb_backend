import dotenv from 'dotenv';
import Web3 from 'web3';
import cron from 'node-cron';
import mongoose from 'mongoose';
import InvestorBonus from "../../models/investorBonus.model.js";
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '../../../.env') });
const PRIVATE_KEY = process.env.PRIVATE_KEY;

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

const contractAddress = process.env.DISTRIBUATION;

const formattedPrivateKey = `0x${PRIVATE_KEY}`; // Ensure correct prefix

const contract = new web3.eth.Contract(ABI, contractAddress);
const account = web3.eth.accounts.privateKeyToAccount(formattedPrivateKey);

web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

console.log(`✅ Successfully loaded private key for account: ${account.address}`);

const getInvestorBonuses = async () => {
    try {
        if (!nftAddress) {
            throw new Error("NFT Address is required");
        }
       // Fetch only `decentralizedWalletAddress` and convert to a plain array
       const wallets = await InvestorBonus.find({ nftAddress })
       .select("decentralizedWalletAddress -_id") // Exclude `_id`
       .lean();

        // Extract only the wallet addresses into an array
        const walletAddresses = wallets.map(bonus => bonus.decentralizedWalletAddress);
        await sendTransaction(contract.methods.distributeInvestorBonusDaily(walletAddresses, nftAddress));
       
        console.log(`✅ Wallets for NFT address ${nftAddress}:`, walletAddresses);
        return walletAddresses;

    } catch (error) {
        console.error("❌ Error fetching investor bonuses:", error.message);
        return [];
    }
};


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







// Schedule jobs to run daily at midnight (GMT+00)
cron.schedule('0 0 * * *', async () => {
//cron.schedule("*/10 * * * * *", async () => {
    console.log('Executing daily rewards distribution at GMT+00...');
    await getInvestorBonuses();
});

console.log('Cron jobs set to run daily at midnight GMT+00.');


