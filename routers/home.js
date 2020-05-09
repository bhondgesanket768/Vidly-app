const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.write("hello world !");
    res.end();
});

module.exports = router;