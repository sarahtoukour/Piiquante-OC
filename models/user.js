// importer le module mongoose pour utiliser l'ORM
const mongoose = require('mongoose');

// importer le module unique-validator pour ajouter une validation unique à l'email
const uniqueValidator = require('mongoose-unique-validator');

// définir le schéma du modèle User
const userSchema = mongoose.Schema({
  // définir un champ email unique et requis
  email: { type: String, required: true, unique: true },
  // définir un champ password requis
  password: { type: String, required: true },
});

// ajouter la validation unique à l'email au schéma
userSchema.plugin(uniqueValidator);

// exporter le modèle User avec le schéma défini
module.exports = mongoose.model('User', userSchema);
