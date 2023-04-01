// importation du module multer pour la gestion des fichiers multimédias
const multer = require('multer');
const crypto = require('crypto');

// configuration des types de fichiers autorisés
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

// configuration du stockage des fichiers sur le disque
const storage = multer.diskStorage({
  // définition du dossier de destination des fichiers
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  // définition du nom de fichier
  filename: (req, file, callback) => {
    // Récupération de l'extension du fichier à partir de son MIME_TYPE
    const extension = MIME_TYPES[file.mimetype];
    // Génération d'un nom aléatoire pour le fichier à l'aide de la bibliothèque 'crypto'
    const randomName = crypto.randomBytes(16).toString('hex');
    // Ajout de la date actuelle pour éviter tout conflit de nommage de fichier
    const newName = randomName + Date.now() + '.' + extension;
    // Appel de la fonction de rappel (callback) avec le nouveau nom du fichier
    callback(null, newName);
  },
});

// exportation du middleware de gestion du fichier unique
module.exports = multer({ storage: storage }).single('image');
