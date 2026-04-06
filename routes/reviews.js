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

module.exports = router;
