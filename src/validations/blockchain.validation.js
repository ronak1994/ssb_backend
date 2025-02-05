import Joi from 'joi';

const purchase = {
   body: Joi.object().keys({
      userId:Joi.string().required(),
      blockchainId:Joi.string().required(),
      senderWalletId:Joi.string().required(),
      receiverWalletId:Joi.string().required(),
      transactionId:Joi.string().required(),
      paymentStatus:Joi.string().required(),
      totalAmount:Joi.string().required(),
      currency:Joi.string().required(),
      paymentGateway:Joi.string().required(),
    }),
  };
  
  export { purchase };