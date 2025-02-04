import dotenv from 'dotenv';
import Web3 from 'web3';
import cron from 'node-cron';

dotenv.config();

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL));

const contractABI = [
    // Replace this with the actual ABI of NFTDistribution contract
];
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(contractABI, contractAddress);

const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

const MAX_BATCH_SIZE = 100; // 100 per pool (Pool A + Pool B = 200 total per call)

/**
 * Fetches eligible Pool A & Pool B users from the database.
 * Replace with actual logic to fetch users who walked required steps.
 */
async function getEligibleUsers() {
    try {
        const users = await fetchUsersFromDatabase(); // Mock function
        let poolA = [];
        let poolB = [];

        users.forEach(user => {
            if (user.steps >= 1500) {
                poolA.push(user.wallet);
            }
            if (user.steps >= 10000) {
                poolB.push(user.wallet);
            }
        });

        return { poolA, poolB };
    } catch (error) {
        console.error('Error fetching eligible users:', error);
        return { poolA: [], poolB: [] };
    }
}

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

/**
 * Calls distribute50kDailyDistribution function on the contract in batches
 */
const distribute50kDailyRewards = async () => {
    try {
        const { poolA, poolB } = await getEligibleUsers();

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
            await sendTransaction(contract.methods.distribute50kDailyDistribution(batchA, batchB));
        }

    } catch (error) {
        console.error('Error distributing daily 50k rewards:', error);
    }
};

/**
 * Calls distributeInvestorBonusDaily function on the contract
 */
const distributeInvestorBonusDaily = async () => {
    try {
        console.log("Distributing daily investor bonuses...");
        const tx = contract.methods.distributeInvestorBonusDaily();
        await sendTransaction(tx);
    } catch (error) {
        console.error('Error distributing investor bonuses:', error);
    }
};

/**
 * Signs and sends a transaction to the blockchain
 */
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

        const signedTx = await web3.eth.accounts.signTransaction(txData, process.env.PRIVATE_KEY);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log('Transaction Hash:', receipt.transactionHash);
    } catch (error) {
        console.error('Error sending transaction:', error);
    }
};

// Schedule jobs to run daily at midnight (GMT+00)
cron.schedule('0 0 * * *', async () => {
    console.log('Executing daily rewards distribution at GMT+00...');
    await distribute50kDailyRewards();
    await distributeInvestorBonusDaily();
});

console.log('Cron jobs set to run daily at midnight GMT+00.');
