const Sauce = require('../models/sauce');
const jwt = require('jsonwebtoken');
const fs = require('fs');


// Get all sauces logic
exports.getAllSauces = (req, res) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(error => res.status(404).json({ error }))

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
  ).catch(error => res.status(404).json({ error }))
}

// Delete single sauce logic
exports.deleteSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })     // Find exactly 1 object in DB
    .then(sauce => {
      if (sauce.userId != req.authID) {      // Checking ID match with token incase delete other user
        res.status(401).json({ message: 'Non authorized' })
      } else {
        const filename = sauce.imageUrl.split('/uploads/')[1]    // split URL to get file name
        fs.unlink(`uploads/${filename}`, () => {                 // Delete file
          Sauce.deleteOne({ _id: req.params.id })                // After delete file then delete object in DB
            .then(() => { res.status(200).json({ message: 'Delete Successful!' }) })
            .catch(error => res.status(401).json({ error }))
        })
      }
    })
    .catch(error => { res.status(500).json({ error }) })
}

const SauceUpdate = (Sauce, id, sauceObj) => {
  console.log("sauceObj : ", sauceObj)
  return Sauce.updateOne({ _id: id }, sauceObj)
}

// Update / Modify Sauce Logic
exports.modifySauce = (req, res) => {
  const sauceObj = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    } : { ...req.body }

  delete sauceObj.userId   // Delete userID so it wont accident change User ID

  Sauce.findOne({ _id: req.params.id })     // Find exactly 1 object in DB
    .then(sauce => {
      if (sauce.userId != req.authID) {      // Checking ID match with token incase delete other user
        res.status(401).json({ message: 'Non authorized' })
      } else {
        if (req.file) {
          const filename = sauce.imageUrl.split('/uploads/')[1]    // split URL to get file name
          fs.unlink(`uploads/${filename}`, () => {
            SauceUpdate(Sauce, req.params.id, sauceObj)            // Call Sauce Update helper
              .then(() => { res.status(200).json({ message: 'Update Successful!' }) })
              .catch(error => res.status(401).json({ error }))
          })
        } else {
          SauceUpdate(Sauce, req.params.id, sauceObj)            // Call Sauce Update helper
            .then(() => { res.status(200).json({ message: 'Update Successful!' }) })
            .catch(error => res.status(401).json({ error }))
        }
      }
    })
    .catch(error => { res.status(500).json({ error }) })
}


exports.countLikeSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })                          // Look up object with match by ID
    .then((sauce) => {
      let sauceObj = [];                                        // create object so it can assign data through switch case
      switch (req.body.like) {
        case 1:                   // Thumb-up LIKE
          sauceObj = {
            $inc: { likes: 1 },
            $push: { usersLiked: req.authID }
          }
          break
        case -1:                 // Thumb-down DISLIKE
          sauceObj = {
            $inc: { dislikes: -1 },
            $push: { usersDisliked: req.authID },
          }
          break
        case 0:                  // Cancel like or dislike
          let indexUsers = '';
          if (req.body.userId in sauce.usersLiked) {
            sauceObj = {
              $inc: { likes: -1 },
              $pull: { usersLiked: req.body.userId }
            }
          } else {
            sauceObj = {
              $inc: { likes: -1 },
              $pull: { usersDisliked: req.body.userId }
            }
          }
          break
      }

      // make a call to common code to update monggoDB
      SauceUpdate(Sauce, req.params.id, sauceObj)
        .then(() => { res.status(200).json({ message: 'Update Successful!' }) })
        .catch(error => { console.log("error ", error); res.status(401).json({ error }) })
    })
}