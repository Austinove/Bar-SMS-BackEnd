const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create schema
const ExpencesSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    made_date: {
        type: String,
        required: true
    }
});

module.exports = Sales = mongoose.model("Expences", ExpencesSchema);