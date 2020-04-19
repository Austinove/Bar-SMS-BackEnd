const express = require("express");
const auth = require("../auth/middleware");
const Lodge = require("../../models/lodge");

const router = express.Router();

router.get("/", auth, (req, res) => {
    Lodge.find().then(rooms => {
        res.status(200).send(rooms);
    }).catch(error => { throw error });
});

router.post("/create", auth, (req, res) => {
    const { room, short_amount, long_amount, role } = req.body
    if (role !== "admin") { return res.status(401).json({ msg: "authetication denied!" }); }
    if (!room || !short_amount || !long_amount) {
        res.status(200).send({ msg: "All fields are required" });
    }
    Lodge.findOne({ room }, (err, item) => {
        if (err) { throw err; }
        if (item) {
            res.status(404).send({ msg: "Room exists" });
        }
        const newRoom = new Lodge({
            room,
            short_amount,
            long_amount
        });
        newRoom.save().then(room => {
            res.status(200).send(room);
        }).catch(error => { throw error });
    })
});

router.put("/edit/:id", auth, (req, res) => {
    const item_object = req.body;
    Lodge.findByIdAndUpdate(req.params.id, item_object, { new: true }, (err, item) => {
        if (err) { throw err }
        if (!item) {
            res.status(404).send({ response: "Item no found", message: false });
        }
        res.status(200).send(item);
    });
});

// delete item
router.delete("/delete/:id", auth, (req, res) => {
    Lodge.findByIdAndRemove(req.params.id, (err, result) => {
        if (err) { res.status(500).send(err) }
        res.status(200).send({
            msg: "Successfully removed",
            id: result._id
        });
    });
});


module.exports = router;