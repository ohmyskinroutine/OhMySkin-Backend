const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Token manquant" });
    }

    const user = await User.findOne({ token });
    if (!user) {
      return res.status(401).json({ message: "Token invalide" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = isAuthenticated;
