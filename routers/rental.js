const { Rental, validateRental } = require("../models/rental");
const express = require("express");
const router = express();
const { Movies } = require("../models/movies");
const { Customers } = require("../models/customers");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const auth = require("../middleware/auth");

Fawn.init(mongoose);

router.get("/", async (req, res) => {
    const rental = await Rental.find().sort({ dateOut: -1 })
    res.status(200).send(rental);
});

router.get("/:id", async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(400).send("Rental does not found .....");
    res.status(200).send(rental);
});

router.post("/", auth, async (req, res) => {
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customers.findById(req.body.customerId);
    if (!customer) return res.status(400).send("customer does not found..");

    const movie = await Movies.findById(req.body.movieId);
    if (!movie) return res.status(400).send("Movie with given id does not found...");

    if (movie.numberInStock === 0) return res.status(400).send("Movie is not in the stock...")

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    })
    try {
        new Fawn.Task()
            .save("rentals", rental)
            .update("movies", { _id: movie._id }, {
                $inc: { numberInStock: -1 }
            })
            .run()
        res.status(200).send(rental);
    } catch (ex) {
        res.status(500).send("Something went wrong....");
    }
});

module.exports = router;