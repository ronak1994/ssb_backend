import express from 'express';
import * as blockchainController from '../../controllers/blockchain.controller.js'
import * as blockchainValidation from '../../validations/blockchain.validation.js';
import validate from '../../middlewares/validate.js';
import * as discountValidation from '../../validations/discount.validation.js';
import * as discountController from '../../controllers/discount.controller.js';
import transactionController from '../../controllers/transaction.controller.js';
import transactionValidation from '../../validations/transaction.validation.js';

const router = express.Router();

// 🚀 Fetch all transactions
router.get('/transactions', transactionController.getAllTransactions);

// 🚀 Fetch transactions by userId
router.get('/transactions/user/:userId', validate(transactionValidation.getByUser), transactionController.getTransactionsByUser);

// 🚀 Fetch transactions by userId and type
router.get('/transactions/user/:userId/type/:transactionType', validate(transactionValidation.getByUserAndType), transactionController.getTransactionsByUserAndType);


// 🚀 Get all blockchains
router.get('/', blockchainController.getAllBlockchains);

// 🚀 Get global data
router.get('/getActivePhase', blockchainController.getActivePhase);
router.get('/getPhaseData', blockchainController.getAllPhases);
router.get('/getGlobalSupply', blockchainController.fetchGlobalSupply);
router.get('/:blockchainId', blockchainController.getBlockchainById);

// 🚀 Purchase blockchain
router.post('/purchaseBlockchain', validate(blockchainValidation.purchase), blockchainController.purchaseBlockchain);

// 🚀 Discount codes
router.post('/validateDiscountCode', validate(discountValidation.validateDiscount), discountController.checkDiscount);
router.post('/applyDiscountCode', validate(discountValidation.applyDiscount), discountController.applyDiscountCode);



export default router;
   