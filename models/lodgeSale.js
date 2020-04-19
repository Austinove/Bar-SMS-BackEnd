const mongoose = require("mongoose");
const Schema = mongoose.Schema;

lodgeSaleSchema = new Schema({
    room_id: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true
    },
    sale_date: {
        type: String,
        required: true
    }
});

module.exports = LodgeSale = mongoose.model("LodgeSale", lodgeSaleSchema);