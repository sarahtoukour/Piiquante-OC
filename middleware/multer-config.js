// importation du module multer pour la gestion des fichiers multimédias
const multer = require('multer');

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
    // suppression des espaces dans le nom de fichier
    const name = file.originalname.split(' ').join('_');
    // récupération de l'extension du fichier
    const extension = MIME_TYPES[file.mimetype];
    // création du nom de fichier final
    callback(null, name + Date.now() + '.' + extension);
  },
});

// exportation du middleware de gestion du fichier unique
module.exports = multer({ storage: storage }).single('image');
