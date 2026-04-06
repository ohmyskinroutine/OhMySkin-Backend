const express = require("express");
const router = express.Router();
const { generateRoutine } = require("../utils/generateRoutine");
const optionalAuthentication = require("../middlewares/optionalAuthentication");

/*
 * Body: { answers, products }
 * Headers: Authorization (optionnel)
 */
router.post("/routine", optionalAuthentication, async (req, res) => {
  try {
    const { answers, products } = req.body;

    // Si utilisateur connecté ET routine déjà existante
    if (req.user && req.user.routine && req.user.routine.morning.length > 0) {
      return res.json(req.user.routine); // on renvoie SANS regénérer
    }

    // Sinon on génère
    const routine = generateRoutine(answers, products);

    // Si connecté → on sauvegarde
    if (req.user) {
      req.user.routine = routine;
      req.user.routineHistory.push(routine);
      await req.user.save();
    }

    return res.json(routine);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Reset uniquement pour utilisateurs connectés
router.post("/routine/reset", optionalAuthentication, async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(400)
        .json({ message: "Connecte-toi pour réinitialiser ta routine" });
    }

    req.user.routine = { morning: [], evening: [] };
    await req.user.save();

    res.json({ message: "Ta nouvelle routine" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Récupérer l'historique des routines (utilisateur connecté uniquement)
router.get("/routine/history", optionalAuthentication, async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Connecte-toi pour voir ton historique" });
    }

    // Si aucun historique
    if (!req.user.routineHistory || req.user.routineHistory.length === 0) {
      return res.json({ history: [] });
    }

    return res.json({
      history: req.user.routineHistory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
