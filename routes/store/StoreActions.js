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

module.exports = router;