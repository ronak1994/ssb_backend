import Joi from 'joi';

const checkEmail = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
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
    phoneNumber: Joi.string().required(),
    password: Joi.string().min(8).required(),
    userId:Joi.string().min(4).required(),
    dateOfBirth: Joi.date().max('now').min('1-1-1940').required(),
    referredBy:Joi.string().min(4).max(4)
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export { sendOtp, verifyOtp, resetPassword, verifyResetOtp, checkEmail, register, login };
