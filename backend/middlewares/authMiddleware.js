const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to verify JWT from HTTP-only cookie
const verifyToken = (required = true) => {
  return async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
      if (required) {
        return res.status(401).json({ message: "Access denied. No token provided." });
      } else {
        // allow anonymous access, just skipping setting user
        return next();
      }
    }

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const user = await User.findById(decoded.id).select("-password"); // excluding the password field from the returned user object.

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user; // attach user to request
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};

module.exports = { verifyToken };