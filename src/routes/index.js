const express = require("express");
const userRoutes = require("./userRoutes");
const tweetRoutes = require("./tweetRoutes");
const followRoutes = require("./followRoutes");

const router = express.Router();

// user Routes
router.use("/user", userRoutes);

// tweet Routes
router.use("/tweet", tweetRoutes);

// follow, unfollow Routes
router.use("/action", followRoutes);

module.exports = router;
