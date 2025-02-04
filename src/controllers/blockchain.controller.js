import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import * as blockchainService from '../services/blockchian.service.js';

/**
 * Get all blockchains
 */
const getAllBlockchains = catchAsync(async (req, res) => {
  const blockchains = await blockchainService.getAllBlockchains();
  res.status(httpStatus.OK).json({ success: true, data: blockchains });
});

/**
 * Get blockchain by ID
 */
const getBlockchainById = catchAsync(async (req, res) => {
  const blockchain = await blockchainService.getBlockchainById(req.params.blockchainId);
  if (!blockchain) {
    return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Blockchain not found' });
  }
  res.status(httpStatus.OK).json({ success: true, data: blockchain });
});

export { getAllBlockchains, getBlockchainById };
