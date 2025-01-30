import mongoose from 'mongoose';

const userBlockchainSchema = new mongoose.Schema(
  {
    userBlockchainId: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true, // Automatically generates unique wallet ID
      unique: true,
      required: true,
      index: true, // Allows fast lookups
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    blockchainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blockchain',
      required: true,
      index: true,
    },
    completedBlocks: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { timestamps: true, collection: 'user_blockchain_data' }
);

userBlockchainSchema.index({ userId: 1, blockchainId: 1 });

const UserBlockchain = mongoose.model('UserBlockchain', userBlockchainSchema);

export default UserBlockchain;
