import express from 'express';
import validate from '../../middlewares/validate.js';
import * as distributionValidation from '../../validations/distribution.validation.js';
import * as distributionController from '../../controllers/distribution.controller.js';

const router = express.Router();

router.post('/saveDailyPoolA', validate(distributionValidation.validatePoolA), distributionController.checkdistribution);
router.post('/saveDailyPoolB', validate(distributionValidation.validatePoolB), distributionController.applydistributionCode);

export default router;
