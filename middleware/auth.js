const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Récupération du token dans le header Authorization de la requête
    const token = req.headers.authorization.split(' ')[1];
    // Décodage du token grâce à la clé secrète
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    // Extraction de l'ID utilisateur du token décodé
    const userId = decodedToken.userId;
    // Vérification si l'ID utilisateur correspond bien à celui de la requête
    if (req.body.userId && req.body.userId !== userId) {
      // Si l'ID est différent, lancer une exception avec un message d'erreur
      throw 'User ID invalide';
    } else {
      // Sinon, passer au middleware suivant
      next();
    }
  } catch (error) {
    // En cas d'erreur (token invalide, ID invalide), renvoyer une réponse d'erreur 401
    res.status(401).json('Requête invalide');
  }
};
