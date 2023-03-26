// importation du model sauce
const Sauce = require('../models/sauce');

// récupération du package fs de node.js qui permets d'effectuer des opérations sur le systeme de fichiers
const fs = require('fs');

/* ### LOGIQUE MÉTIER ### */

/* POST */
exports.createSauce = (req, res, next) => {
  // Récupération de l'objet sauce envoyé par le client et parsage en objet JS
  const sauceObject = JSON.parse(req.body.sauce);

  // Suppression de l'ID généré automatiquement par MongoDB pour éviter des conflits
  delete sauceObject._id;

  // Suppression du champ userId envoyé par le client pour des raisons de sécurité
  delete sauceObject._userId;

  // Création d'une nouvelle instance de la classe Sauce avec les données envoyées par le client
  const sauce = new Sauce({
    // Utilisation de l'opérateur spread (...) pour copier les champs de l'objet sauceObject dans l'instance de la classe Sauce
    ...sauceObject,

    // Ajout de l'ID de l'utilisateur extrait du token d'authentification
    userId: req.auth.userId,

    // Construction de l'URL complète de l'image en utilisant le protocole et le nom d'hôte de la requête ainsi que le nom du fichier de l'image
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  });

  // Sauvegarde de l'objet sauce dans la base de données
  sauce
    .save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !' })) // Renvoi d'une réponse avec un code 201 (created) en cas de succès
    .catch((error) => res.status(400).json({ error })); // Renvoi d'une réponse avec un code 400 (bad request) en cas d'erreur
};

/* GET ONE */
exports.getOneSauce = (req, res, next) => {
  // recherche de la sauce dans la BDD à partir de son id
  Sauce.findOne({ _id: req.params.id })
    // Si la sauce est trouvée, renvoie un code de réponse 200 avec la sauce en JSON et envoie au frontend
    .then((sauce) => res.status(200).json(sauce))
    // Si la sauce n'est pas trouvée, renvoie un code de réponse 404 avec un message d'erreur en JSON
    .catch((error) => res.status(404).json({ error }));
};

/* GET ALL */
exports.getAllSauces = (req, res, next) => {
  // recherche de toutes les sauces dans la BDD
  Sauce.find()
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
};

/* PUT */
exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    if (sauce.userId != req.auth.userId) {
      return res.status(403).json({ error: "Vous n'êtes pas autorisé à modifier cette sauce" });
    }
    const sauceObject = req.file
      ? {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        }
      : { ...req.body };
    delete sauceObject._userId;
    if (req.file) {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        // suppression de l'image à remplacer
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce et image modifiées' }))
          .catch((error) => res.status(400).json({ error }));
      });
    } else {
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
        .catch((error) => res.status(400).json({ error }));
    }
  });
};

// exports.modifySauce = (req, res, next) => {
//   const sauceObject = req.file
//     ? {
//         ...JSON.parse(req.body.sauce),
//         imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
//       }
//     : { ...req.body };
//   if (req.file) {
//     Sauce.findOne({ _id: req.params.id })
//       .then((sauce) => {
//         const filename = sauce.imageUrl.split('/images/')[1];
//         fs.unlink(`images/${filename}`, () => {
//           Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
//             .then(() => res.status(200).json({ message: 'Sauce et image modifiées' }))
//             .catch((error) => res.status(400).json({ error }));
//         });
//       })
//       .catch((error) => res.status(400).json({ error }));
//   } else {
//     Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
//       .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
//       .catch((error) => res.status(400).json({ error }));
//   }
// };

/* DELETE */
exports.deleteSauce = (req, res, next) => {
  // Recherche de la sauce à supprimer dans la BD
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Récupération de l'adresse de l'image à supprimer en enlevant le protocole et le nom de domaine
      const adressImage = sauce.imageUrl.replace(`${req.protocol}://${req.get('host')}`, '');
      // Suppression de l'image à partir de son adresse
      fs.unlink(__dirname + '/..' + adressImage, () => {});
      // Suppression de la sauce dans la BD
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(404).json({ error }));
};

/* LIKE */
exports.postLike = (req, res, next) => {
  const like = req.body.like;
  const userId = req.body.userId;

  // Cas 1: L'utilisateur annule son like ou son dislike
  if (like === 0) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        // Si l'utilisateur a déjà liké la sauce, on retire le like et on décrémente le compteur de likes
        if (sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $pull: { usersLiked: req.body.userId },
              $inc: { likes: -1 },
              _id: req.params.id,
            }
          )
            .then(() => res.status(200).json({ message: 'Like retiré' }))
            .catch((error) => res.status(400).json({ error }));
        }
        // Si l'utilisateur a déjà disliké la sauce, on retire le dislike et on décrémente le compteur de dislikes
        if (sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $pull: { usersDisliked: req.body.userId },
              $inc: { dislikes: -1 },
              _id: req.params.id,
            }
          )
            .then(() => res.status(200).json({ message: 'Dislike retiré' }))
            .catch((error) => res.status(400).json({ error }));
        } else {
          // Si l'utilisateur n'a pas encore liké ou disliké la sauce, on ne fait rien
          () => res.status(200).json({ message: 'Merci de nous donner votre avis' });
        }
      })
      .catch((error) => res.status(404).json({ error }));
  }

  // Cas 2: L'utilisateur like la sauce
  if (like === 1) {
    // On ajoute l'utilisateur à la liste des personnes ayant liké la sauce et on incrémente le compteur de likes
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $push: { usersLiked: userId },
        $inc: { likes: 1 },
      }
    )
      .then(() => res.status(200).json({ message: 'Like ajouté' }))
      .catch((error) => res.status(400).json({ error }));
  }
  // Cas 3: L'utilisateur dislike la sauce
  if (like === -1) {
    // On ajoute l'utilisateur à la liste des personnes ayant disliké la sauce et on incrémente le compteur de dislikes
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $push: { usersDisliked: userId },
        $inc: { dislikes: 1 },
      }
    )
      .then(() => res.status(200).json({ message: 'Dislike ajouté' }))
      .catch((error) => res.status(400).json({ error }));
  }
};
