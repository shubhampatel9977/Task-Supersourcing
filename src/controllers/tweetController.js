const userModel = require("../model/userModel");
const tweetModel = require("../model/tweetModel");
const {
  tweetSchema,
  tweetIdSchema,
} = require("../validations/tweetValidate");

const createTweet = async (req, res) => {
  try {
    // Check Validation
    const { error, value } = tweetSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    // Check user exists or not
    const user = await userModel.findById(value.user, { password: 0 });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Save the new tweet
    const add = new tweetModel(value);
    await add.save();
    return res.status(201).json({ message: "Create tweet successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getTweetById = async (req, res) => {
  try {
    // Check Validation
    const { error, value } = tweetIdSchema.validate(req.params);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    // User id access in token 
    const userId = req.body.user

    // Get tweet by id and also checking user
    const tweet = await tweetModel.findOne({ _id: value.tweetId, user: userId});
    if(!tweet)
      return res.status(400).json({ message: "User or Tweet not found" });

    return res.status(200).json({ data: tweet });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateTweet = async (req, res) => {
  try {
    // Check Validation Params
    const { error: idError, value: idValue } = tweetIdSchema.validate(
      req.params
    );
    if (idError)
      return res.status(400).json({ message: idError.details[0].message });

    // Check Validation Body
    const { error: bodyError, value: bodyValue } = tweetSchema.validate(
      req.body
    );
    if (bodyError)
      return res.status(400).json({ message: bodyError.details[0].message });

    // Get tweet by id and also checking user
    const tweet = await tweetModel.findOne({ _id: idValue.tweetId, user: bodyValue.user});
    if(!tweet)
    return res.status(400).json({ message: "User or Tweet not found" });

    // Update Tweet
    await tweetModel.findByIdAndUpdate(idValue.tweetId, bodyValue);

    return res.status(200).json({ message: "Update tweet successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteTweet = async (req, res) => {
  try {

    // Check Validation
    const { error, value } = tweetIdSchema.validate(req.params);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    // User id access in token 
    const userId = req.body.user

    // Get tweet by id and also checking user
    const tweet = await tweetModel.findOne({ _id: value.tweetId, user: userId});
    if(!tweet)
      return res.status(400).json({ message: "User or Tweet not found" });

    // Delete Tweet
    await tweetModel.findByIdAndDelete(value.tweetId);

    return res.status(200).json({ message: "Delete tweet successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getTweetsFeed = async (req, res) => {
  try {
    // User id access in token 
    const userId = req.body.user

    // Get list of users that the current user is following
    const currentUser = await userModel.findById(userId);
    const followedUsers = currentUser.following;

    // Query tweets from followed users
    const followedTweets = await tweetModel
      .find({ user: { $in: followedUsers } })
      .populate("user", "name") // Populate the 'user' field with username only
      .sort({ createdAt: -1 });

    // Query user's own tweets
    const userTweets = await tweetModel
      .find({ user: userId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    // Combine and sort tweets
    const tweetFeed = [...followedTweets, ...userTweets].sort(
      (a, b) => b.createdAt - a.createdAt
    );

    return res.status(200).json({ data: tweetFeed });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTweet,
  getTweetById,
  updateTweet,
  deleteTweet,
  getTweetsFeed,
};
