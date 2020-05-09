const express = require("express");
const genres = require("../routers/genres");
const home = require("../routers/home");
const customer = require("../routers/customers");
const movies = require("../routers/movies");
const rentals = require("../routers/rental");
const users = require("../routers/users");
const auth = require("../routers/auth");
const error = require("../middleware/errors");
const returns = require("../routers/returns");

function routes(app) {
    app.use(express.json());
    app.use("/", home);
    app.use("/vidly.com/api/genres", genres);
    app.use("/vidly.com/api/customers", customer);
    app.use("/vidly.com/api/movies", movies);
    app.use("/vidly.com/api/rental", rentals);
    app.use("/vidly.com/api/users", users);
    app.use("/vidly.com/api/auth", auth);
    app.use("/vidly.com/api/returns", returns);

    app.use(error);
}

module.exports = routes;