const mongoose = require('mongoose');

// Création du schéma pour une sauce
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true }, // Identifiant unique de l'utilisateur qui a créé la sauce
  name: { type: String, required: true }, // Nom de la sauce
  manufacturer: { type: String, required: true }, // Fabricant de la sauce
  description: { type: String, required: true }, // Description de la sauce
  mainPepper: { type: String, required: true }, // Principal ingrédient de la sauce
  imageUrl: { type: String, required: true }, // URL de l'image de la sauce
  heat: { type: Number, required: true }, // Niveau de piquant de la sauce (de 1 à 10)

  likes: { type: Number, defaut: 0 }, // Nombre de likes de la sauce
  dislikes: { type: Number, defaut: 0 }, // Nombre de dislikes de la sauce
  usersLiked: { type: [String], default: [] }, // Liste des identifiants des utilisateurs ayant liké la sauce
  usersDisliked: { type: [String], default: [] }, // Liste des identifiants des utilisateurs ayant disliké la sauce
});

// Exportation du modèle Sauce basé sur le schéma défini ci-dessus
module.exports = mongoose.model('Sauce', sauceSchema);
