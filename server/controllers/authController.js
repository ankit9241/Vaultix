const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const Project = require("../models/Project");
const Section = require("../models/Section");
const EnvVariable = require("../models/EnvVariable");
const Credential = require("../models/Credential");
const Note = require("../models/Note");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @route   POST /api/auth/register
// @desc    Register a user
// @access  Public
exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    user = new User({
      email,
      passwordHash,
    });

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      },
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      },
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @route   GET /api/auth/me
// @desc    Get user profile
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @route   DELETE /api/auth/delete
// @desc    Delete user account and all related data
// @access  Private
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete all user's data in order
    await Project.deleteMany({ userId });
    await Section.deleteMany({ userId });
    await EnvVariable.deleteMany({ userId });
    await Credential.deleteMany({ userId });
    await Note.deleteMany({ userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @route   POST /api/auth/google
// @desc    Authenticate with Google
// @access  Public
exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    console.log(
      "Received Google auth request with token:",
      token ? "present" : "missing",
    );

    if (!token) {
      return res.status(400).json({ msg: "No token provided" });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture } = ticket.getPayload();
    console.log("Google token verified for email:", email);

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = new User({
        email,
        name,
        avatar: picture,
        isGoogleUser: true,
      });
      await user.save();
      console.log("Created new Google user:", email);
    }

    // Generate JWT
    const payload = {
      user: {
        id: user._id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        console.log("Generated JWT for Google user:", email);
        res.json({
          token,
          user: { id: user._id, email, name, avatar: user.avatar },
        });
      },
    );
  } catch (err) {
    console.error("Google auth error:", err.message);
    res
      .status(400)
      .json({ msg: "Google authentication failed", error: err.message });
  }
};
