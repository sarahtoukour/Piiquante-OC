// Importation des modules nécessaires pour la création de l'utilisateur et la gestion de l'authentification
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Fonction pour créer un nouvel utilisateur dans la base de données
exports.signup = (req, res, next) => {
  bcrypt
    // on utilise la fonction hash de bcrypt pour chiffrer le mot de passe
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        // on récupère l'email envoyé dans la requête
        email: req.body.email,
        // on stocke le hash du mot de passe dans la base de données
        password: hash,
      });
      user
        .save()
        // si tout se passe bien, on renvoie un statut 201 et un message de confirmation
        .then(() => res.status(201).json({ message: 'Utilisateur créé' }))
        // sinon on renvoie une erreur
        .catch((error) => res.status(400).json({ message: 'Un compte utilise déjà cette adresse mail' }));
    })
    // si une erreur se produit, on renvoie une erreur 500
    .catch((error) => res.status(500).json({ error }));
};

// Fonction pour connecter un utilisateur existant
exports.login = (req, res, next) => {
  //on recherche l'utilisateur dont l'email correspond à l'email envoyé dans la requête
  User.findOne({ email: req.body.email })
    .then((user) => {
      // on doit vérifier si on a récupéré un user ou non
      if (!user) {
        // si non on renvoie une erreur 401 avec un message d'erreur
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt
        // si oui, on utilise la méthode compare de bcrypt pour comparer le mdp envoyé et le hash de la bdd
        .compare(req.body.password, user.password)
        .then((valid) => {
          // on recoit un boolean
          if (!valid) {
            // on renvoie une erreur 401 avec un message d'erreur si le mot de passe est incorrect
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            // si c'est "valid" = true, on renvoi un objet json avec un token qui sera utilisé pour les prochaines requêtes
            // on renvoie l'identifiant de l'utilisateur
            userId: user._id,
            // on génère un token grâce à la fonction sign de jwt
            token: jwt.sign(
              //arg 1 = le payload (les données qu'on veut encoder dans le token)=l'id du user
              { userId: user._id },
              // clé secrète
              'RANDOM_TOKEN_SECRET',
              //durée de vie du token
              { expiresIn: '24h' }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
