const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateUser, User } = require("./../model/User");
const auth = require("../middleware/auth");
const router = express.Router();
// GetCurrentUserBy ID
router.get("/me", auth, async (req, res) => {
  try {
    const _id = req.user;
    let user = await User.findById(_id).select("-password");
    res.status(200).json({ status: "success", user });
  } catch (error) {
    res.status(400).json({ status: "fail", error });
  }
});

const generateToken = (value) => {
  const token = jwt.sign(value.toString(), process.env.JWT_PRIVATE_KEY);
  return token;
};

// Create User
router.post("/register", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      return res
        .status(400)
        .json({ status: "fail", error: error.details[0].message });
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ status: "fail", error: "User already exists" });
    }
    user = new User(req.body);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    const newUser = await user.save();
    const id = newUser._id.toString();
    const token = jwt.sign(id, process.env.JWT_PRIVATE_KEY);
    res.status(200).json({ status: "success", jwtToken: token });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: {
        privateKey: process.env.JWT_PRIVATE_KEY,
      },
    });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      return res
        .status(400)
        .json({ status: "fail", error: error.details[0].message });
    }
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", error: "User was not found" });
    }
    const comparePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!comparePassword) {
      return res
        .status(400)
        .json({ status: "fail", error: "Incorrect Password" });
    }

    const token = generateToken(1234);
    res.status(200).json({ status: "success", jwtToken: token });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
});

module.exports = router;
