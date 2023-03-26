const multer = require('multer');
const crypto = require('crypto');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype];
    const randomName = crypto.randomBytes(16).toString('hex');
    const newName = randomName + Date.now() + '.' + extension;
    callback(null, newName);
  },
});

module.exports = multer({ storage: storage }).single('image');
