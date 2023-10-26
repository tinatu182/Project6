const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


// Sauce Schema
const sauceSchema = mongoose.Schema({
    name: { type: String, required: true},
    manufacturer: { type: String, required: true},
    description: { type: String, required: true},
    imageUrl: { type: String, required: true},
    mainPepper: { type: String, required: true},
    heat: { type: Number, required: true},
    userId: { type: String, required: true},
    usersLiked: { type: Array},
    usersDisliked: { type: Array},
    likes: { type: Number},
    dislikes: { type: Number}
});

sauceSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Sauce', sauceSchema);