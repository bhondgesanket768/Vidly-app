const express = require("express");
const router = express();
const { Customers, validateCustomer } = require("../models/customers");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
    const customers = await Customers.find().sort({ name: 1 });
    res.status(200).send(customers)
});

router.get("/:id", async (req, res) => {
    const customer = await Customers.findById(req.params.id);
    if (!customer) return res.status(400).send("customer with given id does not exist...");
    res.status(200).send(customer);
});

router.post("/", auth, async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) res.status(400).send(error.details[0].message);

    const customer = new Customers({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    });

    await customer.save();
    res.status(200).send(customer);
});

router.put("/:id", async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) res.status(400).send(error.details[0].message);

    const customer = await Customers.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    }, { new: true });

    if (!customer) res.status(400).send("Customer with given id does not exist...");

    res.status(200).send(customer);
});

router.delete("/:id", async (req, res) => {
    const customer = await Customers.findByIdAndRemove(req.params.id)
    if (!customer) res.status(400).send("Customer with given id does not exist...");
    res.status(200).send(customer);
});

module.exports = router;
