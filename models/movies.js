const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema } = require("./genres");

const moviesSchema = new mongoose.Schema({
    title: { type: String, required: true, minlength: 5, maxlength: 50 },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
});

const Movies = mongoose.model("Movies", moviesSchema);

function validateMovies(movie) {
    const schema = {
        title: Joi.string().min(5).max(50).required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required(),
        genreId: Joi.objectId().required()
    }

    return Joi.validate(movie, schema);
}

module.exports.Movies = Movies;
module.exports.validateMovies = validateMovies;