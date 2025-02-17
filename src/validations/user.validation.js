import Joi from 'joi';

const checkEmail = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const googleLogin = {
  body: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const updateUser = {
  body: Joi.object().keys({
    name: Joi.string().trim().optional(),
    username: Joi.string().alphanum().min(3).max(20).optional(),
    height: Joi.number().integer().min(50).max(250).optional(),
    weight: Joi.number().integer().min(20).max(300).optional(),
    gender: Joi.string().valid('Male', 'Female', 'Other').optional(),
    profilePicture: Joi.string().uri().optional(),
    dailyGoals: Joi.number().integer().optional()
  }),
};


const sendOtp = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const verifyOtp = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
  }),
};

/**Password reset OTP verification */

const verifyResetOtp = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    userId: Joi.string().required(),
    otp: Joi.string().length(6).required(),
  }),
};


const resetPassword = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    password: Joi.string().min(8).required()
  }),
};


const register = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    username: Joi.string(),
    phoneNumber: Joi.string(),
    password: Joi.string().min(8).required(),
    userId:Joi.string().min(4).required(),
    dateOfBirth: Joi.date().max('now').min('1-1-1940').required(),
    referredBy:Joi.string().optional().allow(''),
    decentralizedWalletAddress: Joi.string().optional().allow('')

  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export { sendOtp, verifyOtp, googleLogin, updateUser, resetPassword, verifyResetOtp, checkEmail, register, login };
