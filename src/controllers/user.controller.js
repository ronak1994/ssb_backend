import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import { sendOtp, verifyOtp, verifyResetOtp, loginUserWithEmailAndPassword, getUserByEmail } from '../services/auth.service.js';
import { createUser, completeRegistration, resetPassword } from '../services/user.service.js';

/**
 * Step 1: Check if email exists
 */
const checkEmail = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await getUserByEmail(email);

  if (user) {
    // If user exists, send them to login
    res.status(httpStatus.OK).send({ exists: true, message: 'User exists. Redirecting to login.' });
  } else {
    // If user is new, proceed to OTP verification
    await sendOtp(email);
    res.status(httpStatus.OK).send({ exists: false, message: 'New user. Redirecting to OTP verification.' });
  }
});


/***Forgot password */
const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const  user  = await getUserByEmail(email);
  
  console.log(user);

  if (user) {
   
    // If user exists, send them to login
    await sendOtp(email);
    res.status(httpStatus.OK).send({ exists: true, message: 'User exists. OTP to reset pass sent to registered email.', data:user });
  } else {
    // If no email id, register first
    res.status(httpStatus.OK).send({ exists: false, message: 'This email is not registered with us.' });
  }
});

/**
 * Verify OTP
 */
const verifyOtpController = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  const { user, isNewUser } = await verifyOtp(email, otp);
  let newUser = user;
  if(isNewUser){
     newUser = await createUser({
      "email":email,
      "isEmailVerified":"true",
      "role":"user",
      "registeredVia":"email"
    });
  }

  res.status(httpStatus.OK).json({ message: 'OTP verified successfully, email saved', data: newUser });
});

/*** verify reset OTP */
const verifyResetOtpController = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  const { user } = await verifyResetOtp(email, otp);
  let newUser = user;
  
  res.status(httpStatus.OK).json({ message: 'OTP verified successfully, email saved', data: newUser });
});

/**
 * Register a user
 */
const registerUser = catchAsync(async (req, res) => {
  const user = await completeRegistration(req.body);
  res.status(httpStatus.CREATED).json({ user });
});


/**Reset password */
const resetUserPassword = catchAsync(async (req, res) => {
  const {userId, password} = req.body;
  const user = await resetPassword(userId, password);
  if(user){
    res.status(httpStatus.CREATED).json({message:"Password Reset Successful.", user });
  }
  
});


/**
 * Login user
 */
const loginUser = catchAsync(async (req, res) => {
  console.log("🛠️ Login request received with data:", req.body);  // Debugging log

  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email and password are required');
  }

  const { user, token } = await loginUserWithEmailAndPassword(email, password);

  res.status(httpStatus.OK).json({ message: 'Login successful', user, token });
});

export { verifyOtpController, verifyResetOtpController, resetUserPassword, forgotPassword, registerUser, loginUser, checkEmail };
