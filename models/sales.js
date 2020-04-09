const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create schema
const SalesSchema = new Schema({
    item: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    made_date: {
        type: String,
        required: true
    }
});

module.exports = Sales = mongoose.model("Sales", SalesSchema);