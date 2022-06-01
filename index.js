require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");


const app = express();

// MyRoutes
const authRoutes = require("./routes/auth");

// CONNECTION
var connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.database,
});

connection.connect(function (err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log("DB Connected");
});

// MIDDLEWARE
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

// ROUTES
app.use("/api", authRoutes);

// PORT
const port = 8000;

// SEVER START
app.listen(port, (req, res) => {
  console.log(`App is Running on port ${port}`);
});
