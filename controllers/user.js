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
      //=> on récup le hach du mot de passe
      const user = new User({
        //=> on va l'enregistrer dans un nouveau "user" que l'on va enregistrer ds la BD
        email: req.body.email, //=> adresse fourni ds le corps de la requête
        password: hash, //=> on enregistre le cryptage pr ne pas stocker le mot de pass
      });
      user
        .save() //=> enregistrement ds la BD :
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' })) //renvoie d'un 201 pr une création de ressources réussit / avec un renvoie d'un message
        .catch((error) => res.status(400).json({ error })); //erreur 400 pr la différencier de la suivante
    })
    .catch((error) => res.status(500).json({ error })); //on capte l'erreur et on renvoie une erreur server ds un objet
};

//Fonction pour connecter un utilisateur existant (utilisateur enregistré) :
//promise retournée par "findOne" dc => ".then" & ".catch"
exports.login = (req, res, next) => {
  User.findOne({
    email: req.body.email, //sert de filtre, de sélecteur avec la valeur transmise par l'utilisateur
  })
    .then((user) => {
      //=> récup l'enregistrement du user ds la BD et vérif si l'utilisateur est bien trouvé et si son mot de pass est le bon
      if (user === null) {
        //=> si l'utilisateur n'existe pas :
        res.status(401).json({ message: 'Paire identifiant et mot de passe incorrecte' }); //message flou pr ne pas divulguer une qqconq info => cela serait une fuite de données
      } else {
        // si l'utilisateur est enregistré ds la BD / comparaison du mot de pass de la BD avec celui qui vient d'être transmit
        bcrypt
          .compare(req.body.password, user.password) //méthode "compare" de bcrypt(on récup ce qui est transmit et on compare avec celui de la BD)
          .then((valid) => {
            if (!valid) {
              res
                .status(401) //erreur d'authentification
                .json({ message: 'Identifiant/mot de passe incorrect' });
            }
            //=> sinon si correct
            res.status(200).json({
              userId: user._id, // => objet qui contient les infos nécessaire à l'authentification des requêtes émises par le user :
              token: jwt.sign(
                //appel de la fonction "sign" qui prend en arguments :
                { userId: user._id }, //user identifié par son id / => données que l'on veut encoder à l'intérieur du token(payload)
                'RANDOM_TOKEN_SECRET', //[RANDOM_SECRET_KEY] ici la clé secrète pr l'encodage(qui reste assez simple, il faut utiliser une chaine de caractères aléatoire et bcp plus longue pr sécuriser l'encodage)
                { expiresIn: '24h' } //argument de configuration où on applique une durée de validité du token avant expiration/l'utilisateur devra donc se reconnecter au bout de 24h
              ),
            });
          })
          .catch((error) => res.status(500).json({ error })); // erreur de traitement
      }
    })
    .catch((error) => res.status(500).json({ error })); //=> erreur d'exécution de requête ds la BD
};
