const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admins');
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// register a user (with auto-login)
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Save the new user
    const newUser = new User({ username, email, passwordHash });
    await newUser.save();

    // ✅ Generate token after registration
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// register an admin (with auto-login)
const registerAdmin = async (req, res) => {
  try {
    const { adminname, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Save the new admin
    const newAdmin = new Admin({ adminname, email, passwordHash });
    await newAdmin.save();

    // Generate token after registration (mark as admin)
    const token = jwt.sign(
      { id: newAdmin._id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      token,
      admin: {
        id: newAdmin._id,
        adminname: newAdmin.adminname,
        email: newAdmin.email,
      },
    });
  } catch (err) {
    console.error("Error registering admin:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// login a user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find the user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    // check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

    // create JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Error logging in user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//login as a admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign(
      { id: admin._id, isAdmin: true },  
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        adminname: admin.adminname,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error("Error logging in admin:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// logout user/admin
const logout = async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      // Optional: Add token to blacklist in Redis/DB
      console.log("User logged out successfully");
    }

    res.json({
      message: "Logged out successfully",
      success: true
    });

    console.log("Logout successful");

  } catch (err) {
    console.error("Error during logout:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Google login for users
const googleLoginUser = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name } = payload;

    let user = await User.findOne({ email });

    // 🔁 Existing email/password user → link Google
    if (user && !user.googleId) {
      user.googleId = sub;
      user.authProvider = "google";
      await user.save();
    }

    // 🆕 New Google user
    if (!user) {
      user = await User.create({
        username: name,
        email,
        googleId: sub,
        authProvider: "google",
      });
    }

    // 🔐 Generate JWT (same as your loginUser)
    const jwtToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token: jwtToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(401).json({ message: "Google authentication failed" });
  }
};


module.exports = { registerUser, registerAdmin, loginUser, loginAdmin, logout, googleLoginUser };
