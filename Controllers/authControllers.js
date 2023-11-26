const User = require("../models/users");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ name, message: "User registered successfully" });
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      success: true,
      email: user.email,
      message: "Login successful",
      token,
      userId: user._id,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000;

    function generateRandomWord(length) {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let randomWord = "";

      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomWord += characters.charAt(randomIndex);
      }

      return randomWord;
    }

    const randomWord = generateRandomWord(6);

    const hashedPassword = await bcrypt.hash(randomWord, 10);

    user.password = hashedPassword;

    await user.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.imitate.email",
      port: 587,
      secure: false,
      auth: {
        user: "147ac2ea-8a9a-4370-8887-018c0bdbe7a4",
        pass: "ce50500a-18b4-49b3-ba45-395a20995442",
      },
    });
    console.log(email, "<");
    const mailOptions = {
      from: '"Admin" psgamerlegend@gmail.com',
      to: email,
      subject: "Hello ✔",
      text:
        "Forgot your password? \nNo worries we made a new one for you!\n" +
        randomWord,
    };
    console.log(mailOptions, "<");

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      res
        .status(400)
        .json({ message: "Error sending email: error", success: false });
    }

    res.json({
      message: "Password reset email sent successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

module.exports = { register, login, resetPassword };
