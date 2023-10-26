const router = require('express').Router();
const saucesController = require('../controllers/sauce');
const auth = require("../middleware/auth")

const multer = require('../middleware/multer');

//            [              MIDDLEWARE                 ] - build common validation logic before each endpoint
// (Path URL, Authentication (OPTIONAL), Multer(OPTIONAL), Control logic)
router.post('/', auth, multer, saucesController.createSauce);
router.get('/', auth, saucesController.getAllSauces);
router.get('/:id', auth, saucesController.getSingleSauce);
router.delete('/:id', auth, saucesController.deleteSauce);
module.exports = router;