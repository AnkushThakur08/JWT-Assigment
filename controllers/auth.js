var bcrypt = require("bcryptjs");
const { compareSync } = require("bcrypt");

var jwt = require("jsonwebtoken");
var { expressjwt: expressjwt } = require("express-jwt");

// MYSQL
const mysql = require("mysql2");
var connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.database,
});

exports.signup = (req, res) => {
  //   console.log(req.body);
  const { id, name, email, password } = req.body;

  connection.query(
    "SELECT email FROM users WHERE email = ?",
    [email],
    async (error, result) => {
      //   console.log("EMAIL " + [email]);
      if (error) {
        res.status(400).send(error);
      }

      if (result.length > 0) {
        console.log("Email Already Exists");
        res.status(400).send("Email Already Exists");
      }

      //   Bcrypt
      var hashedPassword = await bcrypt.hash(password, 8);
      console.log(hashedPassword);

      //   Saving the user
      connection.query(
        "INSERT INTO users SET ?",
        { id: id, name: name, email: email, password: hashedPassword },
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(400).send("unable to save user in the Database");
          } else {
            res.status(200).send({ result });
          }
        }
      );
    }
  );
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  connection.query(
    `SELECT * FROM users where email = ?`,
    [email],
    async (error, result) => {
      if (error) {
        res.status(400).send(error);
      }

      if (!result.length) {
        console.log("User Does not exist");
        res.status(400).send("User Does not exist");
      }

      //   COMPARE
      bcrypt.compare(
        req.body.password,
        result[0]["password"],
        (error, result) => {
          if (error) {
            res.status(400).send("Email or password is incorrect");
          }

          if (result) {
            // Creating Token
            const token = jwt.sign({ id: result.id }, process.env.SECRET);
            res.status(200).send({
              msg: "Login successfully",
              token,
              result,
            });
          }
        }
      );
    }
  );
};

exports.profile = (req, res) => {
  res.send("Verified User");
};

// Protected Routes
exports.isSignedIn = expressjwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
  userProperty: "auth", //This auth contents _id of the user
});
