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
    const extension = MIME_TYPES[file.mimetype];
    const randomName = crypto.randomBytes(16).toString('hex');
    const newName = randomName + Date.now() + '.' + extension;
    callback(null, newName);
  },
});

// exportation du middleware de gestion du fichier unique
module.exports = multer({ storage: storage }).single('image');
