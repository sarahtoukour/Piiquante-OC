const express = require('express');

const app = express();

module.exports = app;

const mongoose = require('mongoose');

mongoose
  .connect('mongodb+srv://sarahtoukour:openMongo@cluster0.vkhxbq5.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
