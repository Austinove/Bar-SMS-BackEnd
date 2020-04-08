const express = require("express");
const auth = require("../auth/middleware");
const Item = require("../../models/Item");

const router = express.Router();

//read item
router.get("/", auth, (req, res) => {
    Item.find().then(items => {
        return res.status(200).send(items);
    }).catch(error => {
        throw error;
    });
});

//create item
router.post("/create", auth, (req, res) => {

    const { name, price, manufacture, quantity, role } = req.body;

    if (role !== "admin") { return res.status(401).json({ msg: "authetication denied!" }); }

    if (!name || !price || !manufacture || !quantity) {
        return res.status(400).json({
            msg: "All fields are required"
        })
    }

    Item.findOne({ name }).then(item => {
        if (item) {
            return res.status(400).json({
                msg: "Item exist please"
            });
        }
        const newItem = new Item({
            name,
            price,
            manufacture,
            quantity,
        });
        newItem.save().then(item => {
            return res.status(200).json({
                item
            });
        }).catch(error => { throw error });
    });
});

// update item
router.put("/edit/:id", auth, (req, res) => {
    const item_object = req.body;
    Item.findByIdAndUpdate(req.params.id, item_object, { new: true }, (err, item) => {
        if (err) { throw err }
        if (!item) {
            res.status(404).send({ response: "Item no found", message: false });
        }
        res.status(200).send(item);
    });
});

// delete item
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