import express from 'express';
import auth from '../../middlewares/auth.js';
import validate from '../../middlewares/validate.js';
import * as userValidation from '../../validations/user.validation.js';
import * as userController from '../../controllers/user.controller.js';

const router = express.Router();



/*********************/
/***Mobile app Routes***/
/*******************/

router.post('/check-email', validate(userValidation.checkEmail), userController.checkEmail);
router.post('/verify-otp', validate(userValidation.verifyOtp), userController.verifyOtpController);
router.post('/register', validate(userValidation.register), userController.registerUser);
router.post('/login', validate(userValidation.login), userController.loginUser);

//deletes all data
router.post('/test', userController.test);


router.post('/google-login', validate(userValidation.googleLogin), userController.googleLogin);

router.patch('/update-profile',auth(),validate(userValidation.updateUser),userController.updateUser);

router.post('/forgot-password', validate(userValidation.checkEmail), userController.forgotPassword);
router.post('/verify-reset-otp', validate(userValidation.verifyResetOtp), userController.verifyResetOtpController);
router.post('/reset-password', validate(userValidation.resetPassword), userController.resetUserPassword);

export default router;
