import dotenv from 'dotenv';
import Web3 from 'web3';
import cron from 'node-cron';

import { getAllInvestorBonuses } from "../investorBonus.service.js";

dotenv.config();

const nftAddress = "0x400fBDE10146750d64bbA3DD5f1bE177F2822BB3";

getAllInvestorBonuses(nftAddress)
    .then(wallets => console.log("✅ Unique Wallets:", wallets))
    .catch(error => console.error("❌ Error:", error.message));

