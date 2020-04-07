const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/ChaliDb",
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => console.log("connect to DB"))
    .catch(error => console.log("Connection Error: ", error.message));