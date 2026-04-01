const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Accès refusé : super user requis" });
  }
  next();
};

module.exports = isAdmin;
