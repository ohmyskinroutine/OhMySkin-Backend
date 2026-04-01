const express = require("express");
const router = express.Router();

const User = require("../models/User");
const isAuthenticated = require("../middlewares/isAuthenticated");
const isAdmin = require("../middlewares/isAdmin");

// GET /admin/users — voir tous les utilisateurs
router.get("/admin/users", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password -salt -token");
    res.status(200).json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /admin/user/:id — supprimer n'importe quel utilisateur
router.delete("/admin/user/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    res.status(200).json({ message: `Utilisateur ${user.email} supprimé` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /admin/user/:id — modifier n'importe quel utilisateur
router.put("/admin/user/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { username, email, isAdmin: adminStatus } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (typeof adminStatus === "boolean") user.isAdmin = adminStatus;

    await user.save();

    res.status(200).json({
      message: "Utilisateur mis à jour",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
