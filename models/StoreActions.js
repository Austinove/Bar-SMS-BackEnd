const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StoreActionSchema = new Schema({
    item_id: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    action_date: {
        type: Date,
        default: Date.now,
        required: true
    }
});

module.exports = StoreAction = mongoose.model("StoreAction", StoreActionSchema);