const express = require("express");
const auth = require("../auth/middleware");
const Counter = require("../../models/counter");

const router = express.Router();

router.get("/", (req, res) => {
    Counter.find().then(items => {
        res.status(200).send(items);
    }).catch(error => {throw error});
});

router.post("/create", (req, res) => {
    const { item_id, quantity, role } = req.body;
    if (role !== "admin") { return res.status(401).json({ msg: "authetication denied!" }); }

    if(!item_id || !quantity){
        res.status(400).json({
            msg: "All fields are required"
        });
    }
    const newItem = new Counter({
        item_id,
        quantity
    });

    newItem.save().then(item => {
        res.status(200).send(item);
    }).catch(error => {throw error});
});

router.put("/edit/:id", (req, res) => {
    Counter.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, item) => {
        if (err) { throw err }
        if (!item) {
            res.status(404).send({ response: "Item no found", message: false });
        }
        res.status(200).send(item);
    });
});

router.delete("/delete/:id", auth, (req, res) => {
    Item.findByIdAndRemove(req.params.id, (err, result) => {
        if (err) { res.status(500).send(err) }
        res.status(200).send({
            msg: "Successfully removed",
            id: result._id
        });
    });
});


module.exports = router;