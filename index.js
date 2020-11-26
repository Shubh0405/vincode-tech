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
const db2 = 
  "mongodb+srv://Srezz:E0Y550F4bZhiXLeX@cluster0-oshu0.mongodb.net/vinpreptest?retryWrites=true&w=majority";
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
  message:String,
});

var registrationSchema = new mongoose.Schema({
  fullname : String,
  phnumber : Number,
  email : String,
  regno : String,
  saw : String,
  skills : String
});

var contact = mongoose.model("contact", contactSchema);
var token = mongoose.model("token", tokenSchema);
var message = mongoose.model("message", messageSchema);
var Registration = mongoose.model("registration", registrationSchema);

//connect to mongo
const connect = mongoose
  .connect(db2, { useFindAndModify: false })
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

app.get("/register", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/register",function(req,res){
  console.log(req.body);
  Registration.create(
  {
    fullname:req.body.fullname,
    phnumber:req.body.phnumber,
    email:req.body.email,
    regno:req.body.regno,
    saw:req.body.saw,
    skills:req.body.skills,
  },function(err,newlyCreated)
  {
    if(err)
    {
      console.log(err);
    }
    else
    {
      console.log(newlyCreated)
    }
  });
  res.redirect("/");
});

app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/login.html");
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
        console.log("DATA HAS BEEN PUSHED", yolo);
        res.sendFile(__dirname + "/");
      }
    }
  );
});

app.post("/message", function (req, res) {
  message.create(
    {
      name: req.body.name,
      subject: req.body.subject,
      phone: req.body.phone,
      email: req.body.email,
      message:req.body.message
    },
    function (err, yolo) {
      if (err) {
        console.log("DATA IS NOT PUSHED");
      } else {
        console.log("DATA HAS BEEN PUSHED", yolo);
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
