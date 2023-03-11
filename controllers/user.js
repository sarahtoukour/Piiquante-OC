const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé' }))
        .catch((error) => res.status(400).json({ message: 'Un compte utilise déjà cette adresse mail' }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) //on recherche l' seul utilisateur de la bdd (celui dont l'email correspond à l'email envoyé dans la requête)
    .then((user) => {
      // on doit vérifier si on a récupéré un user ou non
      if (!user) {
        // si non :
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt
        .compare(req.body.password, user.password) // si oui, on utilise la méthode compare de bcrypt pour comparer le mdp envoyé et le hash de la bdd
        .then((valid) => {
          // on recoit un boolean
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            // si c'est "valid" = true, on renvoi un objet json
            userId: user._id, // avec l'identifiant
            token: jwt.sign(
              // et avec un token (grâce à l'appel de la fonction sign de jwt) qui servira pour les requêtes suivantes
              { userId: user._id }, //arg 1 = le payload (les données qu'on veut encoder dans le token)=l'id du user
              'RANDOM_TOKEN_SECRET', // clé secrète
              { expiresIn: '24h' } //durée de vie
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error })); //pour afficher un problème de connexion à mondoDb
};
