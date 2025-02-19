import express from 'express';
import * as blockchainController from '../../controllers/blockchain.controller.js'
import * as blockchainValidation from '../../validations/blockchain.validation.js';
import validate from '../../middlewares/validate.js';
const router = express.Router();

// Get all blockchains
router.get('/', blockchainController.getAllBlockchains);

//Get global data
router.get('/getActivePhase', blockchainController.getActivePhase);
router.get('/getPhaseData', blockchainController.getAllPhases);
router.get('/getGlobalSupply', blockchainController.fetchGlobalSupply);
router.get('/:blockchainId', blockchainController.getBlockchainById);




router.post('/purchaseBlockchain',validate(blockchainValidation.purchase),blockchainController.purchaseBlockchain)


export default router;
   