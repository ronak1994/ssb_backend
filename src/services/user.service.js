import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import httpStatus from 'http-status';
import crypto from 'crypto';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path'; 
import Web3 from 'web3';

/**
 * Fetch all users who were referred by the given user.
 * @param {string} userId - The ID of the user whose referred users should be fetched.
 * @returns {Array} List of referred users.
 */
const getFollowersService = async (userId) => {
  try {
    // Fetch the user's referral code
    const user = await User.findById(userId);
    if (!user || !user.referralCode) {
      throw new Error('User not found or has no referral code');
    }

    // Find users who signed up using this referral code
    const followers = await User.find({ referredBy: user.referralCode })
      .select('name username email decentralizedWalletAddress createdAt')
      .lean();

    return followers;
  } catch (error) {
    console.error('❌ Error fetching followers:', error);
    return [];
  }
};

const userByRefferalCode = async (refferalCode) => {
  try {
      // Fetch the user's referral code
      const user = await User.findOne({ "referralCode": refferalCode })
          .select("decentralizedWalletAddress userId nftAddress");
      if (!user) {
          throw new Error('User not found or has no referral code');
      }

      // Load ABI from file
      const ABI = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'NFTABI.json'), 'utf-8'));

      // Ensure ABI is an array
      if (!Array.isArray(ABI)) {
          throw new Error("❌ ABI is not an array! Check NFTABI.json format.");
      }

      // Define contract details
      const WEB3_PROVIDER = "https://data-seed-prebsc-1-s1.binance.org:8545/"; // Use correct provider URL
      const nftAddresses = {
          Green: "0x400fBDE10146750d64bbA3DD5f1bE177F2822BB3",
          Gold: "0x7E3e103853E23F78cfCC43B3309cE2E6659C072A",
          Silver: "0x3DaD996bC84ABcB22dbbB2a9e2a2Bf994eA8B93c",
          Black: "0x7f70F3737f856a07bD428dfc1038957F976F1562",
          White: "0xAa84dd899F0831A956210b7016cC3817Ab537B1a",
      };

      // Initialize Web3
      const web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER));

      // Find NFT address of highest priority NFT
      const userWallet = user.decentralizedWalletAddress;
      const nftCounts = {};
      let highestNftAddress = null;

      for (const [nftName, nftAddress] of Object.entries(nftAddresses)) {
          const blockchainContract = new web3.eth.Contract(ABI, nftAddress);
          
          try {
              const nftCount = await blockchainContract.methods.getOwnerTokenIDs(userWallet).call();
              nftCounts[nftName] = nftCount.length ? nftCount.length : 0;

              // Assign NFT address if count is at least 1 and no higher-priority NFT has been set
              if (nftCount.length > 0 && !highestNftAddress) {
                  highestNftAddress = nftAddress;
              }
          } catch (error) {
              console.error(`❌ Error fetching NFT count for ${nftName}:`, error.message);
              nftCounts[nftName] = 0;
          }
      }

      user.nftAddress = highestNftAddress;

      return {
          user
      };

  } catch (error) {
      console.error('❌ Error fetching user by referral code:', error);
      return { user: null, highestNftAddress: null };
  }
};


const getUsersBlockchain = async (userId) => {
  try {
    // Fetch the user's referral code
    const user = await User.findById(userId);
    if (!user || !user.referralCode) {
      throw new Error('User not found or has no referral code');
    }

    // Find users who signed up using this referral code
    const activeBlockchainId = await User.findById(userId)
      .select('activeBlockchainId')
      .lean();
     
    return activeBlockchainId;
  } catch (error) {
    console.error('❌ Error fetching followers:', error);
    return [];
  }
};

/**
 * Create a new user
 */
const createUser = async (userBody) => {
  const user = new User(userBody);
  await user.save();
  return user.toObject();
};

const getUserByReferredby = async(referralCode) =>{
  let user = await User.findOne({ referralCode });
  return user;
}

const getUserByUsername = async(username) =>{
  let user = await User.findOne({ username });
  return user;
}

/**
 * Find or create a user by email
 */
const findOrCreateUser = async (email) => {
  let user = await User.findOne({ email });
  if (!user) {
    user = await createUser({ email }); // Now using createUser properly
  }
  return user;
};


/** generate referal code */
const generateReferralCode = async () => {
  let code;
  let exists;
  do {
    code = crypto.randomBytes(2).toString('hex').toUpperCase(); // Generates a 4-character alphanumeric code
    exists = await User.findOne({ referralCode: code });
  } while (exists);
  
  return code;
};


/**
 * Complete user registration after OTP verification
 */
const completeRegistration = async ({ email, userId, name, decentralizedWalletAddress, phoneNumber, password, username, dateOfBirth, referredBy }) => {
  const user = await User.findOne({ userId });

  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');

  user.name = name;
  user.username = username;
  user.phoneNumber = phoneNumber;
  user.password = await bcrypt.hash(password, 8);
  user.dateOfBirth = dateOfBirth;
  user.referralCode = await generateReferralCode();
  user.referredBy = referredBy || null;
  user.decentralizedWalletAddress = decentralizedWalletAddress || null;

  await user.save();
  return user;
};

/**
 * Get user by email
 */
const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};


const deleteUser = async (userId) => {
  try {
    
    // Find user
    const user = await User.findById(userId);
    if (!user) {
        return 0;
    }

    // Finally, delete the user account
    await User.findByIdAndDelete(userId);

    return 1;

  } catch (error) {
        console.error("Error deleting user account:", error);
        return 0;
    }
};

/**
 * Get user by ID
 */
const getUserById = async (userId) => {
  return await User.findById(userId);
};

const getUserWalletAndNft = async (userId) => {
  return await User.findById(userId).select('decentralizedWalletAddress nftAddress');
};

/**
 * Update user by ID
 */
const updateUserById = async (userId, updateBody) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
   // Ensure unique username
   if (updateBody.username && updateBody.username !== user.username) {
    const existingUser = await User.findOne({ username: updateBody.username });
    if (existingUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Username is already taken');
    }
  }

  Object.assign(user, updateBody);
  await user.save();
  return user;
};


const activateBlockchainService = async (userId, blockchainId, nftAddress) => {
  console.log(userId);
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  Object.assign(user, {"activeBlockchainId":blockchainId, "nftAddress":nftAddress});
  await user.save();
  return user;
}

const resetPassword = async (userId, newPassword) => {
  try {
    console.log("📌 Raw userId:", userId, typeof userId);
    
    const isValid = mongoose.Types.ObjectId.isValid(String(userId));
    console.log("✅ Is Valid ObjectId:", isValid);
    
    if (!isValid) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid user ID format');
    }

    // Convert to ObjectId for MongoDB query
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find the user by ID
    const user = await User.findById(userObjectId);

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Check if new password is the same as the old password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'New password must be different from the old password');
    }

    // Hash the new password
    user.password = await bcrypt.hash(newPassword, 8);

    // Save the updated user record
    await user.save();

    return { message: "Password updated successfully" };

  } catch (error) {
    console.error("❌ Error in resetPassword:", error.message);
    throw error;
  }
};

 const getAllUsersService = async () => {
  return await User.find({}, '-password'); // Excludes password field for security
};

export { createUser,getUserWalletAndNft,
   findOrCreateUser, userByRefferalCode, activateBlockchainService, getUsersBlockchain, deleteUser, getFollowersService, getUserByUsername, getAllUsersService,  getUserByReferredby, resetPassword, completeRegistration, getUserByEmail, getUserById, updateUserById };
