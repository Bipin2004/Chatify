const { celebrate, Joi, Segments } = require('celebrate');

exports.messageValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    message: Joi.string().min(1).required(),
    isAI: Joi.boolean().optional()
  })
});
