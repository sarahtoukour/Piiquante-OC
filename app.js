/* IMPORTS */

// framework de Node.js qui va aider à la création et à la gestion du server Node
const express = require('express');

// création de l'application express
const app = express();

// utilitaire qui permet d'accéder au chemin de notre système de fichier
const path = require('path');

// variables d'environnement
require('dotenv').config();

// empêche les autres app de requêter sur le back
const cors = require('cors');

// package node qui sécurise les appli Express en définissant divers en-têtes HTTP
const helmet = require('helmet');

// mongoose fait le lien entre la BD et notre server Node.js pour récupérer les données à afficher sur le front
const mongoose = require('mongoose');

// import des routes
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

/* MONGOOSE */
mongoose
  .connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.m2psanr.mongodb.net/test?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

/* CORS = CROSS ORIGIN RESOURCE SHARING - accès à l'API avec des headers définis */
app.use((req, res, next) => {
  // * = tout le monde a accès à l'API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  // méthode de requête
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

/* HELMET */
app.use(helmet());

/* CORS */
app.use(cors({ origin: 'http://localhost:4200' }));

// transforme le corps (le body) en json objet javascript utilisable
app.use(express.json());

/* CHEMIN D'ACCES DES ENDPOINTS */

// chemin complet de l'image sur le disk (accéder aux images du dossier images)
// à l'aide du package path et de la méthode Express static , on peut se servir des ressources statiques, telles que les images
// __dirname = nom du dossier dans lequel on va se trouver auquel on va ajouter "images"
app.use('/images', express.static(path.join(__dirname, 'images')));

// base de l'url du router (début de route utilisée par 'sauceRoutes)
app.use('/api/sauces', sauceRoutes);

// racine de la route pour ce qui concerne l'authentification
app.use('/api/auth', userRoutes);

// export de app.js pour pouvoir y accéder depuis un autre fichier
module.exports = app;
