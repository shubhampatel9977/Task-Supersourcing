const userModel = require("../model/userModel");
const { signUpSchema, logInSchema } = require("../validations/userValidate");
const { cryptPassword, comparePassword } = require("../utils/passwordCrypt");
const { generateToken } = require("../utils/generateToken");

const signUp = async (req, res) => {
  try {
    // Check Validation
    const { error, value } = signUpSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    // Check if the email already exists in the database
    const existingUser = await userModel.findOne({ email: value.email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    // Hash the password before saving
    const hashPass = await cryptPassword(value.password);
    value.password = hashPass;

    // Save the new user
    const add = new userModel(value);
    const result = await add.save();
    if (result) 
      return res.status(201).json({ message: "SignUp successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const logIn = async (req, res) => {
  try {
    // Check Validation
    const { error, value } = logInSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    // Check if the email already exists in the database
    const result = await userModel.findOne({ email: value.email });
    if (!result)
      return res.status(200).json({ message: "Email or Password Incorrect" });

    // Password Maching
    const verifyPass = await comparePassword(value.password, result.password);
    if (!verifyPass)
      return res.status(200).json({ message: "Email or Password Incorrect" });

    // Token Generate
    const token = await generateToken(result._id);

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const logOut = async (req, res) => {
  try {
    // Here you can handle logout logic
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    // Get all users
    const users = await userModel.find({}, { password: 0 });
    return res.status(200).json({ data: users });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { signUp, logIn, getUsers, logOut };
