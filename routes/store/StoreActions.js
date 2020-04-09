const express = require("express");
const auth = require("../auth/middleware");
const StoreAction = require("../../models/StoreActions");

const router = express.Router();

router.get("/", auth, (req, res) => {
    StoreAction.find().then(actions => {
        res.status(200).send(actions);
    }).catch(error => {
        throw error;
    });
});

router.post("/create", auth, (req, res) => {
    const { item_id, desc, quantity, role } = req.body;

    if (role !== "admin") { return res.status(401).json({ msg: "authetication denied!" }); }

    if (!item_id || !desc || !quantity) {
        return res.status(400).json({
            msg: "All fields are required"
        });
    }

    const newAction = new StoreAction({
        item_id,
        desc,
        quantity
    });

    newAction.save().then(store_action => {
        res.status(200).send(store_action);
    }).catch(error => {throw error });

});

module.exports = router;