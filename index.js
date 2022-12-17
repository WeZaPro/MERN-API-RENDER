const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

let port = process.env.PORT || 8080;

//middleware
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

var corsOptions = {
  //origin: "http://localhost:8081",
  origin: process.env.URL_FRONTEND,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//test
app.get("/", (req, res) => {
  data: "Message from server";
});
// MongoDb
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

// init routes
// วิธี 1
//const routers = require("./routes/router.js");
//app.use("/api", routers);

//วิธี 2
// const { readdirSync } = require("fs");
// readdirSync("./routes").map((readRouter) => {
//   app.use("/api", require("./routes/" + readRouter));
// });
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const categoryRoutes = require("./routes/category");
app.use("/api", productRoutes);
app.use("/api", categoryRoutes);
app.use("/api", authRoutes);

app.listen(port, () => {
  console.log(`server run port ${port}`);
});
