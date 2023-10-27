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
    usersLiked: { type: [String], required: false },
    usersDisliked: { type: [String], required: false },
    likes: { type: Number, required: false},
    dislikes: { type: Number, required: false}
});

sauceSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Sauce', sauceSchema);