const express = require("express");
const { authUser } = require("../utils/generateToken");
const { followUser, unfollowUser } = require("../controllers/followController");

const followRoute = express.Router();

followRoute.post("/follow", authUser, followUser);
followRoute.post("/unfollow", authUser, unfollowUser);

module.exports = followRoute;
