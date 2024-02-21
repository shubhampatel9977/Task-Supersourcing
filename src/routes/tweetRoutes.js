const express = require("express");
const { authUser } = require("../utils/generateToken");
const {
  createTweet,
  getTweetById,
  updateTweet,
  deleteTweet,
  getTweetsFeed,
} = require("../controllers/tweetController");

const tweetRoute = express.Router();

// Tweet feed - own tweets and tweets from the users they follow
tweetRoute.get("/feed", authUser, getTweetsFeed);

// CRUD for Tweet
tweetRoute.post("/", authUser, createTweet);
tweetRoute.get("/:tweetId", authUser, getTweetById);
tweetRoute.put("/:tweetId", authUser, updateTweet);
tweetRoute.delete("/:tweetId", authUser, deleteTweet);

module.exports = tweetRoute;
