import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import { sendOtp, verifyOtp, loginUserWithEmailAndPassword } from '../services/auth.service.js';
import { createUser } from '../services/user.service.js';

/**
 * Send OTP to user
 */
const sendOtpController = catchAsync(async (req, res) => {
  await sendOtp(req.body.email);
  res.status(httpStatus.OK).json({ message: 'OTP sent successfully' });
});

/**
 * Verify OTP
 */
const verifyOtpController = catchAsync(async (req, res) => {
  await verifyOtp(req.body.email, req.body.otp);
  res.status(httpStatus.OK).json({ message: 'OTP verified successfully' });
});

/**
 * Register a user
 */
const registerUser = catchAsync(async (req, res) => {
  const user = await createUser(req.body);
  res.status(httpStatus.CREATED).json({ user });
});

/**
 * Login user
 */
const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const userData = await loginUserWithEmailAndPassword(email, password);
  res.status(httpStatus.OK).json(userData);
});

export { sendOtpController, verifyOtpController, registerUser, loginUser };
