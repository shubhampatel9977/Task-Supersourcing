const userModel = require("../model/userModel");
const { followSchema } = require("../validations/followValidate");

const followUser = async (req, res) => {
  try {
    // Check Validation
    const { error, value } = followSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    // Check user exists or not
    const user = await userModel.findById(value.user, { password: 0 });
    if (!user) 
      return res.status(400).json({ message: "User not found" });

    // Check follow user exists or not
    const followUser = await userModel.findById(value.followUserId, { password: 0 });
    if (!followUser)
      return res.status(400).json({ message: "Follow not found" });

    // Check user already followed or not
    if (user.following.includes(value.followUserId))
      return res.status(400).json({ message: "User already followed" });

    // add follwing user and save
    user.following.push(value.followUserId);
    await user.save();
    return res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const unfollowUser = async (req, res) => {
  try {
    // Check Validation
    const { error, value } = followSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    // Check user exists or not
    const user = await userModel.findById(value.user, { password: 0 });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Check follow user exists or not
    const followUser = await userModel.findById(value.followUserId, { password: 0 });
    if (!followUser)
      return res.status(400).json({ message: "Follow not found" });

    // Check user follwing or not
    if (!user.following.includes(value.followUserId)) 
      return res.status(400).json({ message: "User not followed" });

    // remove follwing user and save
    user.following = user.following.filter((id) => id.toString() !== value.followUserId);
    await user.save();
    return res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { followUser, unfollowUser };
