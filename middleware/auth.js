const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Récupération du token dans le header Authorization de la requête
    // split = divise la chaîne d'en-tête Authorization en deux parties : la première partie est le type d'authentification (Bearer), et la deuxième partie est le jeton lui-même
    const token = req.headers.authorization.split(' ')[1];
    // Décodage du token grâce à la clé secrète
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    // Extraction de l'ID utilisateur du token décodé
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
