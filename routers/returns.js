const express = require("express");
const router = express();
const { Rental } = require("../models/rental");
const auth = require("../middleware/auth");
const { Movies } = require("../models/movies")
const Joi = require("joi");

router.post("/", auth, async (req, res) => {
    const { error } = validateReturn(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if (!rental) return res.status(404).send("rental not found.");

    if (rental.dateReturned) return res.status(400).send("return already processed");

    rental.return();
    rental.save();

    await Movies.update({ _id: rental.movie._id }, {
        $inc: { numberInStock: 1 }
    });

    return res.status(200).send(rental);
});

function validateReturn(req) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
    }

    return Joi.validate(req, schema);
}


module.exports = router;