// middleware/isAuthenticatedOptional.js
const User = require("../models/User");

const optionalAuthentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      req.user = null; // pas connecté
      return next();
    }

    const user = await User.findOne({ token });
    if (!user) {
      req.user = null; // token invalide = guest
      return next();
    }

    req.user = user;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

module.exports = optionalAuthentication;
