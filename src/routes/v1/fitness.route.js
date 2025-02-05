import express from 'express';
import auth from '../../middlewares/auth.js';
import * as fitnessController from '../../controllers/fitness.controller.js';

const router = express.Router();

router.post('/update-steps', fitnessController.updateSteps);

export default router;
