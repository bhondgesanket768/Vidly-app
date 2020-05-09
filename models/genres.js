const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 5, maxlength: 50 }
});

const Genres = mongoose.model("Genres", genreSchema);

function GenreValidate(genre) {
    const schema = {
        name: Joi.string().min(5).max(50).required()
    }

    return Joi.validate(genre, schema);
}

module.exports.Genres = Genres;
module.exports.GenreValidate = GenreValidate;
module.exports.genreSchema = genreSchema;