const express = require("express");
const mongoose = require("mongoose");
const bp = require("body-parser");
const app = express();

app.use(bp.json());
app.use(
  bp.urlencoded({
    extended: true,
  })
);

app.use(express.static(__dirname + "/public"));

const db =
  "mongodb+srv://kvssankar:sankarvishnu23@cluster1.uacfw.mongodb.net/vinprep?retryWrites=true&w=majority";

var contactSchema = new mongoose.Schema({
  email: String,
});

var tokenSchema = new mongoose.Schema({
  token: String,
});

var messageSchema = new mongoose.Schema({
  name: String,
  subject: String,
  phone: String,
  email: String,
});

var contact = mongoose.model("contact", contactSchema);
var token = mongoose.model("token", tokenSchema);
var token = mongoose.model("message", messageSchema);

//connect to mongo
const connect = mongoose
  .connect(db, { useFindAndModify: false })
  .then(() => console.log("Mondo db connected...."))
  .catch((err) => console.log(err));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/about", function (req, res) {
  res.sendFile(__dirname + "/about.html");
});

app.get("/faq", function (req, res) {
  res.sendFile(__dirname + "/faq.html");
});

app.get("/contact", function (req, res) {
  res.sendFile(__dirname + "/contact.html");
});

app.post("/newsletter", function (req, res) {
  contact.create(
    {
      email: req.body.email,
    },
    function (err, yolo) {
      if (err) {
        console.log("DATA IS NOT PUSHED");
      } else {
        console.log("DATA HAS BEEN PUSHED");
        res.sendFile(__dirname + "/");
      }
    }
  );
});

app.post("/message", function (req, res) {
  contact.create(
    {
      name: req.body.name,
      subject: req.body.subject,
      phone: req.body.phone,
      email: req.body.email,
    },
    function (err, yolo) {
      if (err) {
        console.log("DATA IS NOT PUSHED");
      } else {
        console.log("DATA HAS BEEN PUSHED");
        res.sendFile(__dirname + "/");
      }
    }
  );
});

app.post("/addtoken", function (req, res) {
  token.create(
    {
      token: req.body.token,
    },
    function (err, yolo) {
      if (err) {
        console.log("DATA IS NOT PUSHED");
      } else {
        console.log("DATA HAS BEEN PUSHED");
        res.sendFile(__dirname + "/");
      }
    }
  );
});

app.listen(process.env.PORT || 1111, function () {
  console.log("SERVER 8000 HAS STARTED");
});
