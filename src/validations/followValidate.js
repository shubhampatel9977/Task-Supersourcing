const Joi = require("joi");

const followSchema = Joi.object({
  user: Joi.string().hex().length(24).required(),
  followUserId: Joi.string().hex().length(24).required(),
});

module.exports = { followSchema };
