import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import toJSON from './plugins/toJSON.plugin.js';
import paginate from './plugins/paginate.plugin.js';
import { roles } from '../config/roles.js';

const userSchema = mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true, // Automatically generates ObjectId for each user
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Other',
    },
    country: {
      type: String,
      trim: true,
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    height: {
      type: Number, // cm
      default: null,
    },
    dailyGoals: {
      type: Number, 
      default: null,
    },
    weight: {
      type: Number, // kg
      default: null,
    },
    BMI: {
      type: Number,
      default: null,
    },
    totalSteps: {
      type: Number, // Stores lifetime total steps
      default: 0,
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    dailyStreak: {
      type: Number,
      default: 0, // Tracks days where 10,000 steps were completed
    },
    lastStreakUpdate: {
      type: Date,
      default: null,
    },

    // Referral & Registration
    referralCode: {
      type: String,
      unique: true,
      sparse: true, // Allows null values while ensuring uniqueness
    },
    referredBy: {
      type: String, // Stores the referralCode of the inviter
      default: null,
    },
    registeredVia: {
      type: String,
      enum: ['email', 'google', 'facebook', 'apple', 'metamask'],
      default: 'email', // Defines how the user registered
    },
    loginVia: {
      type: String,
      enum: ['email', 'google', 'facebook', 'apple', 'metamask'],
      default: 'email', // Defines how the user last logged in
    },
    isTermAndConditionAccepted: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Add plugins for converting MongoDB document to JSON and pagination support
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

// Hash password before saving
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

export default User;
