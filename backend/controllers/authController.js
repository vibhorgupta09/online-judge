const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!(name && email && password)) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered", user });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: "Invalid email" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );

    // Secure cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict", 
      maxAge: 24 * 60 * 60 * 1000 
    };

    // Set cookie
    res.cookie("token", token, cookieOptions).status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict", // Or "None" if you're using cross-origin
    secure: process.env.NODE_ENV === "production", // only on https in prod
  });
  res.status(200).json({ message: "Logged out successfully" });
};

const checkAuth = (req, res) => {
  if (req.user) {
    return res.json({ isLoggedIn: true, user: req.user });
  } else {
    return res.json({ isLoggedIn: false });
  }
};

module.exports = { registerUser, loginUser, logoutUser, checkAuth };