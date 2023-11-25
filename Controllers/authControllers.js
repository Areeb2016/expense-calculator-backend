const User = require("../models/users");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // Respond with user details and success message
    res.status(201).json({ name, message: "User registered successfully" });
  } catch (error) {
    console.error(error);

    // Respond with an error message and appropriate status code
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  // User login logic
  try {
    // Implement user login logic here
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Respond with success details
    res.json({
      success: true,
      email: user.email, // Assuming you want to send the user's email
      message: "Login successful",
      token,
      userId: user._id,
    });
  } catch (error) {
    console.error(error);

    // Respond with an error message and appropriate status code
    res.status(500).json({ message: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  // Password reset logic
  try {
    // Implement password reset logic here
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a reset token
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Update user with reset token and expiry
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send password reset email
    const transporter = nodemailer.createTransport({
      // configure nodemailer transporter (e.g., Gmail)
    });

    const mailOptions = {
      // configure mail options
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Password reset email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { register, login, resetPassword };
