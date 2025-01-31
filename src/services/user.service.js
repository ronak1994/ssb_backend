import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import httpStatus from 'http-status';
import crypto from 'crypto';
import mongoose from 'mongoose';


/**
 * Create a new user
 */
const createUser = async (userBody) => {
  const user = new User(userBody);
  await user.save();
  return user.toObject();
};

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
const completeRegistration = async ({ email, userId, name, phoneNumber, password, dateOfBirth, referredBy }) => {
  const user = await User.findOne({ userId });

  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');

  user.name = name;
  user.phoneNumber = phoneNumber;
  user.password = password;
  user.dateOfBirth = dateOfBirth;
  user.referralCode = await generateReferralCode();
  user.referredBy = referredBy;

  await user.save();
  return user;
};

/**
 * Get user by email
 */
const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

/**
 * Get user by ID
 */
const getUserById = async (userId) => {
  return await User.findById(userId);
};

/**
 * Update user by ID
 */
const updateUserById = async (userId, updateBody) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const resetPassword = async (userId, newPassword) => {
  try {
    console.log("Received userId:", userId);  // Debugging line

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid user ID format');
    }

    // Convert to ObjectId for MongoDB query
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find the user by ID
    const user = await User.findById(userObjectId);

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Hash the new password
    user.password = newPassword;

    // Save the updated user record
    await user.save();

    return user;

  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid user ID format');
    console.error("Error in resetPassword:", error.message);
    throw error;
  }
};


export { createUser, findOrCreateUser, resetPassword, completeRegistration, getUserByEmail, getUserById, updateUserById };
