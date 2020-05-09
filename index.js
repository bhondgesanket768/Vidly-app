const express = require("express");
const app = express();

require("./startup/log")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

const port = process.env.PORT || 3000;

const server = app.listen(port, () => console.log(`server is listerning to the port ${port}.....`));

module.exports = server; // for integration testing..