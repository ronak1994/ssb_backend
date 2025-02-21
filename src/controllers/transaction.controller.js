import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import transactionService from '../services/transaction.service.js';

const getAllTransactions = catchAsync(async (req, res) => {
  const transactions = await transactionService.getAllTransactions();
  res.status(httpStatus.OK).json({ success: true, data: transactions });
});

const getTransactionsByUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const transactions = await transactionService.getTransactionsByUser(userId);
  res.status(httpStatus.OK).json({ success: true, data: transactions });
});

const getTransactionsByUserAndType = catchAsync(async (req, res) => {
  const { userId, transactionType } = req.params;
  const transactions = await transactionService.fetchTransactionsByUserAndType(userId, transactionType);
  res.status(httpStatus.OK).json({ success: true, data: transactions });
});

export default {
  getAllTransactions,
  getTransactionsByUser,
  getTransactionsByUserAndType,
};
