const Joi = require("joi");

const tweetSchema = Joi.object({
  user: Joi.string().hex().length(24).required(),
  content: Joi.string().required(),
});

const tweetIdSchema = Joi.object({
  tweetId: Joi.string().hex().length(24).required(),
});

module.exports = {
  tweetSchema,
  tweetIdSchema
};
