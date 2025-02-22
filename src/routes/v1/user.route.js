import express from 'express';
import auth from '../../middlewares/auth.js';
import validate from '../../middlewares/validate.js';
import * as userValidation from '../../validations/user.validation.js';
import * as userController from '../../controllers/user.controller.js';
import { otpRateLimiter } from '../../middlewares/otpRateLimit.js';

const router = express.Router();



/*********************/
/*Mobile app Routes*/
/*******************/

router.post('/check-email',otpRateLimiter,validate(userValidation.checkEmail), userController.checkEmail);
router.post('/check-username',validate(userValidation.checkUsername), userController.checkUsername);

router.post('/verify-otp',otpRateLimiter,validate(userValidation.verifyOtp), userController.verifyOtpController);
router.post('/register', validate(userValidation.register), userController.registerUser);
router.post('/login', validate(userValidation.login), userController.loginUser);

router.get('/all-users', userController.getAllUsers);

router.get('/get-user/:userId',validate(userValidation.getUser) ,userController.getUser);


//deletes all data
router.post('/test', userController.test);

router.patch('/update-profile',validate(userValidation.updateUser),userController.updateUser);
router.patch('/update-user-wallet',validate(userValidation.updateUserWallet),userController.updateUserWallet);
router.post('/forgot-password',otpRateLimiter ,validate(userValidation.checkEmail), userController.forgotPassword);
router.post('/verify-reset-otp', otpRateLimiter ,validate(userValidation.verifyResetOtp), userController.verifyResetOtpController);
router.post('/reset-password', validate(userValidation.resetPassword), userController.resetUserPassword);

router.post('/delete-account', validate(userValidation.deleteAccount), userController.deleteAccount);


/**
 * @route GET /users/followers/:userId
 * @desc Fetch users who signed up using the given user's referral code
 * @access Public
 */
router.get('/followers/:userId', validate(userValidation.getFollowers), userController.getFollowers);

export default router;
