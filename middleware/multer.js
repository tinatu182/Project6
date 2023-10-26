// Multer lib help upload file and any form-data from front end or api request
const multer = require('multer');

// params { dest: 'uploads/' } will create directory folder of uploads
// and all the images upload will store inside this folder
module.exports = multer({ dest: 'uploads/' }).single('image');