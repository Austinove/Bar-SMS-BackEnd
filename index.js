const connection = require("./connect");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
//passing cors to app
app.use(cors());

app.use(express.json());

app.use("/api/user", require("./routes/auth/auth"));
app.use("/api/users", require("./routes/auth/users"));


const port = process.env.PORT || 5000;
app.listen(port, ()=>console.log(`Server started on port ${port}`));