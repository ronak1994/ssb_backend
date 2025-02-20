import express from 'express';
import * as blockchainController from '../../controllers/blockchain.controller.js'
import * as blockchainValidation from '../../validations/blockchain.validation.js';
import validate from '../../middlewares/validate.js';
import * as discountValidation from '../../validations/discount.validation.js';
import * as discountController from '../../controllers/discount.controller.js';

const router = express.Router();

// Get all blockchains
router.get('/', blockchainController.getAllBlockchains);

//Get global data
router.get('/getActivePhase', blockchainController.getActivePhase);
router.get('/getPhaseData', blockchainController.getAllPhases);
router.get('/getGlobalSupply', blockchainController.fetchGlobalSupply);
router.get('/:blockchainId', blockchainController.getBlockchainById);




router.post('/purchaseBlockchain',validate(blockchainValidation.purchase),blockchainController.purchaseBlockchain)


//discount codes
router.post('/validateDiscountCode', validate(discountValidation.validateDiscount), discountController.checkDiscount);
router.post('/applyDiscountCode', validate(discountValidation.applyDiscount), discountController.applyDiscountCode);


export default router;
   