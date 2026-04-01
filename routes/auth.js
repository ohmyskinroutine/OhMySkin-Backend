const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const User = require("../models/User");
const isAuthenticated = require("../middlewares/isAuthenticated");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /signup
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "username, email et password sont requis" });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Format d'email invalide" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Cet email est déjà utilisé" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res
        .status(409)
        .json({ message: "Ce nom d'utilisateur est déjà pris" });
    }

    const salt = uid2(16);
    const hash = SHA256(password + salt).toString(encBase64);
    const token = uid2(32);

    const newUser = new User({
      username,
      email,
      password: hash,
      salt,
      token,
    });

    await newUser.save();

    res.status(201).json({
      message: "Compte créé avec succès",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        token: newUser.token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email et password sont requis" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    const hash = SHA256(password + user.salt).toString(encBase64);
    if (hash !== user.password) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    res.status(200).json({
      message: "Connexion réussie",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        token: user.token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /logout — invalider le token
router.post("/logout", isAuthenticated, async (req, res) => {
  try {
    req.user.token = uid2(32);
    await req.user.save();
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
