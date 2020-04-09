const connection = require("./connect");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
//passing cors to app
app.use(cors());

app.use(express.json());

app.use("/api/auth", require("./routes/auth/auth"));
app.use("/api/users", require("./routes/auth/users"));
app.use("/api/store/items", require("./routes/store/index"));
app.use("/api/store/action", require("./routes/store/StoreActions"));
app.use("/api/counter", require("./routes/counter/index"));
app.use("/api/counter/sales", require("./routes/counter/sales"));


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));