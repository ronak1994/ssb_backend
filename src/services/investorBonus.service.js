import InvestorBonus from "../models/InvestorBonus.model.js";

/**
 * Fetch all records from the investor_bonuses collection.
 * @returns {Array} - List of all investor bonus records.
 */
export const getAllInvestorBonuses = async () => {
    try {
        // Fetch all records
        const records = await InvestorBonus.find({})
            .select("userId blockchainId totalDays daysRemaining status nftAddress decentralizedWalletAddress tokenId lastProcessedDate createdAt")
            .lean();

        if (!records.length) {
            console.log("⚠️ No investor bonuses found.");
            return [];
        }

        console.log("✅ Investor bonuses fetched successfully:", records);
        return records;
    } catch (error) {
        console.error("❌ Error fetching investor bonuses:", error.message);
        throw error;
    }
};
