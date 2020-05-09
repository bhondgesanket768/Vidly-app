
const winston = require("winston");

function handleError(err, req, res, next) {
    winston.error(err.message, err);
    res.status(500).send("Something went wrong...");
}

module.exports = handleError;
