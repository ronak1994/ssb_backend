import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import toJSON from './plugins/toJSON.plugin.js';
import paginate from './plugins/paginate.plugin.js';
import { roles } from '../config/roles.js';

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
      required: true,
      default: function () {
        return this._id.toString(); // Assigns `_id` as `userId`
      },
    },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      match: [/(?=.*[a-zA-Z])(?=.*\d)/, 'Password must contain at least one letter and one number'],
      private: true,
    },
    phoneNumber: { type: String, trim: true },
    profilePicture: { type: String, default: null },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' },
    country: { type: String, trim: true },
    timezone: { type: String, default: 'UTC' },
    height: { type: Number, default: null },
    dailyGoals: { type: Number, default: null },
    weight: { type: Number, default: null },
    BMI: { type: Number, default: null },
    totalSteps: { type: Number, default: 0 },
    role: { type: String, enum: roles, default: 'user' },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date, default: Date.now },
    dailyStreak: { type: Number, default: 0 },
    lastStreakUpdate: { type: Date, default: null },

    // Referral & Registration
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: String, default: null },
    registeredVia: { type: String, enum: ['email', 'google', 'facebook', 'metamask'], default: 'email' },
    loginVia: { type: String, enum: ['email', 'google', 'facebook', 'metamask'], default: 'email' },
    isTermAndConditionAccepted: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ referralCode: 1 });
userSchema.index({ userId: 1 }, { unique: true });

/**
 * Hash password before saving
 */
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Add plugins for JSON conversion and pagination
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

const User = mongoose.model('User', userSchema);
export default User;
