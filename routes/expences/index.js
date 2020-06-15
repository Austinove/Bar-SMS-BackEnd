const express = require("express");
const Expences = require("../../models/expences");
const auth = require("../auth/middleware");

const router = express.Router();

//get expences
router.post("/", auth, (req, res) => {
    const { made_date } = req.body;
    console.log(made_date);
    Expences.find({ made_date })
        .then((values) => {
            return res.status(200).send(values);
        })
        .catch((error) => {
            throw error;
        });
});

router.post("/create", auth, (req, res) => {
    const { amount, desc, made_date } = req.body;
    const newExpence = new Expences({
        amount,
        desc,
        made_date,
    });
    newExpence
        .save()
        .then((expence) => {
            res.status(200).send({
                msg: "Sale saved successfully",
                data: expence
            });
        })
        .catch((err) => {
            throw err;
        });
});

// Edit Expence
router.put("/edit/:id", auth, (req, res) => {
    const item_object = req.body;
    Expences.findByIdAndUpdate(req.params.id, item_object, { new: true }, (err, item) => {
        if (err) { throw err }
        if (!item) {
            res.status(404).send({ response: "Item no found", message: false });
        }
        res.status(200).send(item);
    });
});

// delete Expence
router.delete("/delete/:id", auth, (req, res) => {
    Expences.findByIdAndRemove(req.params.id, (err, result) => {
        if (err) { res.status(500).send(err) }
        res.status(200).send({
            msg: "Successfully removed"
        });
    });
});

module.exports = router;