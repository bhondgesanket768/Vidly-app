const express = require("express");
const router = express.Router();
const { Movies, validateMovies } = require("../models/movies");
const { Genres } = require("../models/genres")
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
    const movies = await Movies.find();
    res.status(200).send(movies);
});

router.get("/:id", async (req, res) => {
    const movie = await Movies.findById(req.params.id);
    if (!movie) return res.status(400).send("Movie with given id does not exist...");
    res.status(200).send(movie);
});

router.post("/", auth, async (req, res) => {
    const { error } = validateMovies(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genres.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid Genre..")

    const movie = new Movies({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    await movie.save();
    res.status(400).send(movie);
});

router.put("/:id", async (req, res) => {
    const { error } = validateMovies(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genres.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid Genre..")

    const movie = await Movies.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    }, { new: true });

    if (!movie) return res.status(400).send("Movie with given id does not exist...");
    res.status(200).send(movie);
});

router.delete("/:id", async (req, res) => {
    const movie = await Movies.findByIdAndRemove(req.params.id);
    if (!movie) return res.status(400).send("Movie with given id does not exist...");
    res.status(200).send(movie);
});


module.exports = router;
