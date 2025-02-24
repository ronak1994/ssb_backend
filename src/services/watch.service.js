import User from '../models/user.model.js';
import Watch from '../models/watch.model.js';

const nftLimits = {
    Green: 250,
    Gold: 500,
    Silver: 1000,
};

// Mapping NFT addresses to watch types
const nftAddresses = {
    Green: "0x400fBDE10146750d64bbA3DD5f1bE177F2822BB3",
    Gold: "0x7E3e103853E23F78cfCC43B3309cE2E6659C072A",
    Silver: "0x3DaD996bC84ABcB22dbbB2a9e2a2Bf994eA8B93c",
    Black: "0x7f70F3737f856a07bD428dfc1038957F976F1562",
    White: "0xAa84dd899F0831A956210b7016cC3817Ab537B1a",
};

// Function to determine watch type from NFT address
const getWatchTypeFromAddress = (nftAddress) => {
    return Object.keys(nftAddresses).find(watchType => nftAddresses[watchType] === nftAddress) || null;
};

 const saveWatchTransaction = async (userId, nftAddress, tokenId) => {
    try {
        // Determine watch type from NFT address
        const watchType = getWatchTypeFromAddress(nftAddress);

        if (!watchType || !(watchType in nftLimits)) {
            console.log(`❌ No matching watch type for NFT address: ${nftAddress}`);
            return false;
        }

        // Convert tokenId to a number
        const tokenIdNum = Number(tokenId);
        if (isNaN(tokenIdNum)) {
            console.error(`❌ Invalid tokenId format: ${tokenId}`);
            return false;
        }

        // Check if tokenId is within allowed range
        if (tokenIdNum >= nftLimits[watchType]) {
            console.log(`❌ ${watchType} NFT tokenId ${tokenId} exceeds limit (${nftLimits[watchType]})`);
            return false;
        }

        // Validate if user exists
        const user = await User.findById(userId);
        if (!user) {
            console.error('❌ User not found');
            return false;
        }

        // Check if this tokenId already exists (to prevent duplicates)
        const existingTransaction = await Watch.findOne({ tokenId });
        if (existingTransaction) {
            console.log('❌ Token ID already exists for another transaction');
            return false;
        }

        // Create and save the transaction
        const newTransaction = new Watch({
            userId,
            watchType,
            nftAddress,
            tokenId,
        });

        await newTransaction.save();
        console.log("✅ Watch transaction saved successfully:", newTransaction);
        return newTransaction;
    } catch (error) {
        console.error("❌ Error saving watch transaction:", error.message);
        return false;
    }
};

export { saveWatchTransaction }