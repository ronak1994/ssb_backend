import {Blockchain} from '../models/blockchain.model.js';

/**
 * Get all blockchains
 */
const getAllBlockchains = async () => {
  return Blockchain.find({});
};

/**
 * Get blockchain by ID
 */
const getBlockchainById = async (blockchainId) => {
  return Blockchain.findById(blockchainId);
};

export { getAllBlockchains, getBlockchainById };
