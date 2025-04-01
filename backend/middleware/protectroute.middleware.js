export const protectRoute = async (req, res, next) => {
    if (!req.session.username || !req.session.email) {
        return res.status(401).json({ error: "Utente non autenticato" });
      }
      next()
}