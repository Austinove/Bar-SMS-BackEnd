const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create schema
const ItemSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    manufacture: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = Item = mongoose.model("Item", ItemSchema);