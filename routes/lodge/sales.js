const express = require("express");
const LodgeSale = require("../../models/lodgeSale");
const Lodge = require("../../models/lodge");
const auth = require("../auth/middleware");

const router = express.Router();

router.get("/", auth, (req, res) => {
    LodgeSale.find().then(rooms => {
        res.status(200).send(rooms);
    }).catch(err => { throw err });
})

router.post("/create", auth, (req, res) => {
    const { room_id, sale_type, sale_date } = req.body
    if (!room_id || !sale_type || !sale_date) {
        res.status(404).send({ msg: "All fields are required" });
    }
    LodgeSale.findOne({ room_id, sale_date }, (error, sale) => {
        if (error) { throw error }
        console.log(sale);

        Lodge.findById(room_id, (err, room) => {
            if (err) { throw err }
            var amount;
            if (sale_type === "short") {
                amount = room.short_amount;
            } else {
                amount = room.long_amount;
            }
            if (!sale) {
                const newSale = new LodgeSale({
                    room_id,
                    amount,
                    sale_date
                });

                newSale.save().then(item => {
                    res.status(200).send({
                        msg: "Room sale saved",
                        room: item
                    });
                }).catch(error => { throw error });
            } else {
                LodgeSale.findOneAndUpdate(
                    { room_id, sale_date }, 
                    { amount: amount + sale.amount }, 
                    { new: true }, 
                    (error, resp) => {
                    if (error) { throw error }
                    res.status(200).send({ msg: "Room sale saved" });
                });
            }
        });
    });
});

module.exports = router;