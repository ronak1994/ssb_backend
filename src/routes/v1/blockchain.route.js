import express from 'express';
import * as blockchainController from '../../controllers/blockchain.controller.js'

const router = express.Router();

// Get all blockchains
router.get('/', blockchainController.getAllBlockchains);
router.get('/:blockchainId', blockchainController.getBlockchainById);


export default router;
