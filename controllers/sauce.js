const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  // delete sauceObject._userId;
  const sauce = new Sauce({
    ...sauceObject,
    // userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      }
    : { ...req.body };

  // delete sauceObject._userId;
  if (req.file) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          // suppression de l'image à remplacer
          Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) //mise à jour d'une sauce
            .then(() => res.status(200).json({ message: 'Sauce et image modifiées' }))
            .catch((error) => res.status(400).json({ error }));
        });
      })
      .catch((error) => res.status(400).json({ error }));
  } else {
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) //mise à jour d'une sauce
      .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
      .catch((error) => res.status(400).json({ error }));
  }
};

exports.deleteSauce = (req, res, next) => {
  console.log('params.id =>\r\n', req.params.id);
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const adressImage = sauce.imageUrl.replace(`${req.protocol}://${req.get('host')}`, '');
      fs.unlink(__dirname + '/..' + adressImage, () => {});
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(404).json({ error }));
};

exports.postLike = (req, res, next) => {
  console.log('controller like');
  const like = req.body.like;
  const userId = req.body.userId;

  if (like === 0) {
    Sauce.findOne({ _id: req.params.id }) // on récupère la sauce concernée
      .then((sauce) => {
        // si cet utilisateur a déjà like la sauce
        if (sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne(
            //on modifie cette sauce
            { _id: req.params.id },
            {
              $pull: { usersLiked: req.body.userId }, // on retire l'userId
              $inc: { likes: -1 }, // on retire 1 like
              _id: req.params.id,
            }
          )
            .then(() => res.status(200).json({ message: 'Like retiré' }))
            .catch((error) => res.status(400).json({ error }));
        }
        if (sauce.usersDisliked.includes(req.body.userId)) {
          // si cet utilisateur a déjà dislike la sauce
          Sauce.updateOne(
            // on modifie cette sauce
            { _id: req.params.id },
            {
              $pull: { usersDisliked: req.body.userId }, // on retire  l'userId
              $inc: { dislikes: -1 }, // on retire 1 dislike
              _id: req.params.id,
            }
          )
            .then(() => res.status(200).json({ message: 'Dislike retiré' }))
            .catch((error) => res.status(400).json({ error }));
        } else {
          () => res.status(200).json({ message: 'Merci de nous donner votre avis' });
        }
      })
      .catch((error) => res.status(404).json({ error }));
  }

  if (like === 1) {
    Sauce.updateOne(
      //on modifie cette sauce
      { _id: req.params.id },
      {
        $push: { usersLiked: userId }, // on ajoute l'userId
        $inc: { likes: 1 }, // on ajoute 1 like
      }
    )
      .then(() => res.status(200).json({ message: 'Like ajouté' }))
      .catch((error) => res.status(400).json({ error }));
  }

  if (like === -1) {
    Sauce.updateOne(
      //on modifie cette sauce
      { _id: req.params.id },
      {
        $push: { usersDisliked: userId }, // on ajoute l'userId
        $inc: { dislikes: 1 }, // on ajoute 1 dislike
      }
    )
      .then(() => res.status(200).json({ message: 'Dislike ajouté' }))
      .catch((error) => res.status(400).json({ error }));
  }
};
