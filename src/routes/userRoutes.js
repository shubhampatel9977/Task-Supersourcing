const express = require("express");
const { authUser } = require("../utils/generateToken");
const { signUp, logIn, getUsers, logOut } = require("../controllers/userController");

const userRoute = express.Router();

userRoute.post("/register", signUp);
userRoute.post("/login", logIn);
userRoute.post("/logout", authUser, logOut);
userRoute.get("/all", authUser, getUsers);

module.exports = userRoute;
