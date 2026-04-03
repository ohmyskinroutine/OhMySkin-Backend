require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const routineRoutes = require("./routes/routine");
const emailingRoutes = require("./routes/emailing");
const stripeRoutes = require("./routes/Stripe");

const app = express();

//pour pas que le navigateur bloque mon front à envoyer la requete
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => console.error("Erreur MongoDB :", err));

app.get("/", (_req, res) => {
  res.json({ message: "API Auth opérationnelle" });
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", adminRoutes);
app.use("/", emailingRoutes);
app.use("/", stripeRoutes);
app.use("/", routineRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Route introuvable" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
