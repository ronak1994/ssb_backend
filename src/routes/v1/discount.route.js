import express from 'express';
import validate from '../../middlewares/validate.js';
import * as discountValidation from '../../validations/discount.validation.js';
import * as discountController from '../../controllers/discount.controller.js';

const router = express.Router();

router.post('/validate', validate(discountValidation.validateDiscount), discountController.checkDiscount);
router.post('/apply', validate(discountValidation.applyDiscount), discountController.applyDiscountCode);

export default router;
