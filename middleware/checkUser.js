// vérifie si l'utilisateur a le droit de modifier une sauce
const checkUser = (req, res, next, userId) => {
  // recherche de la sauce dans la base de données
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // compare l'id de l'utilisateur actuel avec celui de la sauce dans la bdd
      if (sauce.userId != userId) {
        // renvoie une erreur si l'utilisateur n'a pas le droit de modifier la sauce
        res.status(403).json({ message: 'Non-autorisé !' });
      } else {
        // passe au middleware suivant si l'utilisateur a le droit de modifier la sauce
        next();
      }
    })
    // renvoie une erreur si la sauce n'a pas été trouvée
    .catch((error) => res.status(400).json({ error }));
};
