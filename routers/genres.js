const express = require("express");
const router = express.Router();
const { Genres, GenreValidate } = require("../models/genres")
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");


// Implementing Crud Operation
router.get("/", async (req, res) => {
    const genres = await Genres.find().sort({ name: 1 });
    res.status(200).send(genres);
});

router.get("/:id", validateObjectId, async (req, res) => {

    const genre = await Genres.findById(req.params.id);
    if (!genre) return res.status(404).send("Genre With given id does not exit");

    res.status(200).send(genre);
});

router.post("/", auth, async (req, res) => {
    const { error } = GenreValidate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = new Genres({
        name: req.body.name
    });
    await genre.save();
    res.status(200).send(genre);
});

router.put("/:id", [auth, validateObjectId], async (req, res) => {
    const { error } = GenreValidate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genres.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
    }, { new: true })

    if (!genre) return res.status(404).send("Genre With given id does not exit");

    res.status(200).send(genre);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
    const genre = await Genres.findByIdAndRemove(req.params.id);
    if (!genre) res.status(404).send("Genre with given id does not exist...")
    res.status(200).send(genre);
});

module.exports = router;