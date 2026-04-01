const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const User = require("../models/User");
const isAuthenticated = require("../middlewares/isAuthenticated");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// GET /profile — voir son profil
router.get("/profile", isAuthenticated, (req, res) => {
  res.status(200).json({
    user: {
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
      createdAt: req.user.createdAt,
    },
  });
});

// PUT /user/update — modifier son compte
router.put("/user/update", isAuthenticated, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username && !email && !password) {
      return res.status(400).json({ message: "Aucune donnée à mettre à jour" });
    }

    if (email && !emailRegex.test(email)) {
      return res.status(400).json({ message: "Format d'email invalide" });
    }

    if (username) {
      const existing = await User.findOne({ username });
      if (existing && String(existing._id) !== String(req.user._id)) {
        return res.status(409).json({ message: "Ce nom d'utilisateur est déjà pris" });
      }
      req.user.username = username;
    }

    if (email) {
      const existing = await User.findOne({ email });
      if (existing && String(existing._id) !== String(req.user._id)) {
        return res.status(409).json({ message: "Cet email est déjà utilisé" });
      }
      req.user.email = email;
    }
    if (password) {
      const salt = uid2(16);
      req.user.salt = salt;
      req.user.password = SHA256(password + salt).toString(encBase64);
    }

    await req.user.save();

    res.status(200).json({
      message: "Compte mis à jour",
      user: {
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /user — supprimer son compte
router.delete("/user", isAuthenticated, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.status(200).json({ message: "Compte supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
