import express from "express";
require("dotenv").config();
const helmet = require("helmet");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cors = require("cors");

const router = express.Router();
const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(helmet());
app.use(cors(corsOptions));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("The sedulous hyena ate the antelope!");
});

app.use("/api/v1", routes(router));

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});
