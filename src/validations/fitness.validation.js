import Joi from 'joi';

const updateSteps = {
  body: Joi.object().keys({
    steps: Joi.number().integer().min(0).required(),
    rewardSteps: Joi.number().integer().min(0).required(),
    source: Joi.string().valid('Google Fit', 'Apple HealthKit', 'Manual').required(),
    userId:Joi.string().required()
  }),
};

export { updateSteps };
