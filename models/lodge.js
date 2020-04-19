const mongoose = require("mongoose");
const Schema = mongoose.Schema;

lodgeSchema = new Schema({
    room: {
        type: String,
        unique: true,
        required: true
    },
    short_amount: {
        type: Number,
        required: true
    },
    long_amount: {
        type: Number,
        required: true
    },
    added_date: {
        type: Date,
        default: Date.now,
        require: true
    }
})

module.exports = Lodge = mongoose.model("Lodge", lodgeSchema);