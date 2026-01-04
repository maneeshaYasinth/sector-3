const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },


  passwordHash: {
    type: String,
    default: null
  },

  googleId: {
    type: String,
    default: null
  },
  authProvider: {
    type: String,
    enum: ["local", "google"],
    default: "local"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", userSchema);
