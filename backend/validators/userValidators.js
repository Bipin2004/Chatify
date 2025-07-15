const { celebrate, Joi, Segments } = require('celebrate');

exports.registerValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  })
});

exports.loginValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  })
});
