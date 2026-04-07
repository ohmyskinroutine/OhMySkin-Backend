const express = require("express");
const router = express.Router();
const Review = require("../models/Reviews");
const isAuthenticated = require("../middlewares/isAuthenticated");

// GET /reviews?productCode=xxx
router.get("/reviews", async (req, res) => {
  try {
    const { productCode } = req.query;

    const reviews = await Review.find({ productCode }).sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /reviews
router.post("/reviews", isAuthenticated, async (req, res) => {
  try {
    const { rating, comment, productCode } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Non autorisé" });
    }

    const review = new Review({
      productCode,
      userId: user._id,
      name: user.username,
      rating,
      comment,
    });

    await review.save();

    res.status(201).json(review);
  } catch (error) {
    // console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

router.put("/reviews/:id", isAuthenticated, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: "Avis non trouvé" });
    }

    // 🔒 Vérifier que c'est le bon utilisateur
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: "Tu ne peux modifier que ton propre avis",
      });
    }

    // ✏️ Mise à jour
    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;

    await review.save();

    res.json(review);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.delete("/reviews/:id", isAuthenticated, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: "Avis non trouvé" });
    }

    // 🔒 Vérification propriétaire
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: "Tu ne peux supprimer que ton propre avis",
      });
    }

    await review.deleteOne();

    res.json({ message: "Avis supprimé" });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
