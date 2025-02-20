import Joi from 'joi';

const purchase = {
      body: Joi.object().keys({
      userId:Joi.string().required(),
      blockchainId:Joi.string().required(),
      senderWalletId:Joi.string().required(),
      receiverWalletId:Joi.string().required(),
      transactionHash:Joi.string().required(),
      amount:Joi.string().required(),
      currency:Joi.string().required(),
      nftAddress:Joi.string().required(),
     
    }),
  };
  
  export { purchase };