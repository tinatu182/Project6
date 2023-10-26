const Sauce = require('../models/sauce');
const jwt = require('jsonwebtoken');
const fs = require('fs');


// Get all sauces logic
exports.getAllSauces = (req, res) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ) .catch(error => res.status(404).json({ error }))

}

// Create sauce Logic
exports.createSauce = (req, res) => {
  // Convert body to string then convert to JSON
  req.body = JSON.parse(JSON.stringify(req.body));

  // Then take req.body convert sauce string to sauce JSON
  req.body.sauce = JSON.parse(req.body.sauce);

  const url = req.protocol + '://' + req.get('host');  // get url from req
  const sauce = new Sauce({     // Create object sauce
    name: req.body.sauce.name,
    manufacturer: req.body.sauce.manufacturer,
    description: req.body.sauce.description,
    imageUrl: url + '/uploads/' + req.file.filename,
    mainPepper: req.body.sauce.mainPepper,
    heat: req.body.sauce.heat,
    userId: req.body.sauce.userId,
    likes: 0,
    dislikes: 0
  });
  sauce.save().then(   // save object above to mongo db
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

// Get single sauce logic
exports.getSingleSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id }).then(   // get exactly one match with _id object in DB
    (sauce) => {
      res.status(200).json(sauce);
    }
  ) .catch(error => res.status(404).json({ error }))
}

// Delete single sauce logic
exports.deleteSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })     // Find exactly 1 object in DB
  .then(sauce => {
      if(sauce.userId != req.authID) {      // Checking ID match with token incase delete other user
          res.status(401).json({message: 'Non authorized'})
      } else {
          const filename = sauce.imageUrl.split('/uploads/')[1]    // split URL to get file name
          fs.unlink(`uploads/${filename}`, () => {                 // Delete file
              Sauce.deleteOne({_id: req.params.id})                // After delete file then delete object in DB
              .then(() => {res.status(200).json({message: 'Delete Successful!'})})
              .catch(error => res.status(401).json({ error }))
          })
      }
  })
  .catch(error => {res.status(500).json({ error })})
}

