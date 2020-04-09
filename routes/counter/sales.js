const express = require("express");
const Sales = require("../../models/sales");
const auth = require("../auth/middleware");

const router = express.Router();

//read sales
router.get("/", auth, (req, res) => {
    Sales.find().then(items => {
        return res.status(200).send(items);
    }).catch(error => {
        throw error;
    });
});

//make sale
router.post("/make", auth, (req, res) => {

    const { item, made_date, quantity } = req.body;

    if (!item || !made_date || !quantity) {
        return res.status(400).json({
            msg: "All fields are required"
        })
    }

    Sales.updateOne(
        { item: item, made_date: made_date }, 
        { quantity: quantity }, 
        { upsert: true }
        ).then(item => {
            if (!item) {
                res.status(404).send({ response: "Item no found", message: false });
            }
            res.status(200).send(item);
        }).catch(error => { throw error });
});

// read by date
router.post("/specific", auth, (req, res) => {
    Sales.find(req.body).then(items => {
        return res.status(200).send(items);
    }).catch(error => {
        throw error;
    });
});


module.exports = router;