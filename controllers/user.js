// Importation des modules nécessaires pour la création de l'utilisateur et la gestion de l'authentification
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Fonction pour créer un nouvel utilisateur dans la base de données
exports.signup = (req, res, next) => {
  bcrypt
    // Hasher le mot de passe à l'aide de la fonction hash de bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      // Créer un nouvel utilisateur avec l'adresse email et le mot de passe hashé
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      // Enregistrer l'utilisateur dans la BDD
      user
        .save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//Fonction pour connecter un utilisateur existant
exports.login = (req, res, next) => {
  // Rechercher l'utilisateur dans la BDD en utilisant son adresse email
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (user === null) {
        // Si l'utilisateur n'existe pas, renvoyer une erreur 401
        res.status(401).json({ message: 'Paire identifiant et mot de passe incorrecte' });
      } else {
        // Comparer le mot de passe entré par l'utilisateur avec le mot de passe hashé stocké en BDD
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              // Si les mots de passe ne correspondent pas, renvoyer une erreur 401
              res.status(401).json({ message: 'Identifiant/mot de passe incorrect' });
            }
            // Si les mots de passe correspondent, renvoyer un jeton d'authentification
            res.status(200).json({
              userId: user._id,
              token: jwt.sign({ userId: user._id }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' }),
            });
          })
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
