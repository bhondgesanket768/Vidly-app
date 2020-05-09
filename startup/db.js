const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

function dbEnable() {
    mongoose.connect(config.get("db"), {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
        //.then(() => winston.info("MongoDb connected successfully...."))
        .then(() => console.log(`${config.get("db")} connected successfully....`))
}

module.exports = dbEnable;