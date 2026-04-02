const express = require("express");
const cors = require("cors");
// Pensez à cacher votre clef privée dans votre .env
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

app.post("/payment", async (req, res) => {
  try {
    // On crée une intention de paiement
    const paymentIntent = await stripe.paymentIntents.create({
      // Montant de la transaction
      amount: 4200,
      // Devise de la transaction
      currency: "eur",
      // Description du produit
      description: "La description du produit",
    });
    // On renvoie les informations de l'intention de paiement au client
    res.json(paymentIntent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server started");
});
