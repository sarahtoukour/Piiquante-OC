const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const checkUser = require('../middleware/checkUser');

const sauceCtrl = require('../controllers/sauce');

// routes appliquant la logique métier et utilisations des middleware

router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.put(
  '/:id',
  auth,
  (req, res, next) => {
    // middleware pour vérifier que l'utilisateur est autorisé à modifier la sauce
    checkUser(req, res, next, req.auth.userId);
  },
  multer,
  sauceCtrl.modifySauce
);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.postLike);

module.exports = router;
