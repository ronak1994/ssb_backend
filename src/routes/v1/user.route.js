import express from 'express';
import auth from '../../middlewares/auth.js';
import validate from '../../middlewares/validate.js';
import * as userValidation from '../../validations/user.validation.js';
import * as userController from '../../controllers/user.controller.js';

const router = express.Router();

/*********************/
/***Mobile Routes***/
/*******************/

router.post('/send-otp', validate(userValidation.sendOtp), userController.sendOtpController);
router.post('/verify-otp', validate(userValidation.verifyOtp), userController.verifyOtpController);
router.post('/register', validate(userValidation.register), userController.registerUser);
router.post('/login', validate(userValidation.login), userController.loginUser);


export default router;
