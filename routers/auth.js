const express = require("express");
const router = express();
const _ = require("lodash");
const Joi = require("joi");
const { Users } = require("../models/users");
const bcrypt = require("bcryptjs");

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await Users.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or Password..")

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Invalid password or email..")

    const token = user.generateAuthToken();
    res.status(200).send(token);

});

function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    }

    return Joi.validate(req, schema);
}

module.exports = router;