import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required." });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists." });

    // Explicitly hash password before creation
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Please provide email and password." });

    const user = await User.findOne({ email });

    if (user && user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        });
      }
    }
    res.status(401).json({ message: "Invalid email or password." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile data
// @route   GET /api/auth/profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (user) res.json(user);
    else res.status(404).json({ message: "User not found." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile (Name & Email ONLY)
// @route   PUT /api/auth/profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        token: req.headers.authorization.split(" ")[1],
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot password request
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required." });

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "No account associated with this email." });

    res
      .status(200)
      .json({ message: "Email verified. You may now set a new password." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password with email verification
// @route   POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword)
      return res
        .status(400)
        .json({ message: "Please provide email and new password." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Explicitly hash the new reset password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res
      .status(200)
      .json({ message: "Password successfully reset. You can now log in." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
