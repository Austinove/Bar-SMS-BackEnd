const mongoose = require("mongoose");
const Schema = mongoose.Schema;

counterSchema = new Schema({
    item_id: {
        type: String,
        unique: true,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    item_date: {
        type: Date,
        default: Date.now,
        required: true
    }
});

module.exports = Counter = mongoose.model("Counter", counterSchema);