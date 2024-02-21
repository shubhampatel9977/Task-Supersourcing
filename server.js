const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const DBConnection = require("./src/config/MongoDB");
const routes = require("./src/routes/index");

const port = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Database Connection
DBConnection();

// default route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Api working fine!" });
});

app.use("/api", routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
