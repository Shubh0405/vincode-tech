const express = require("express");
const mongoose = require("mongoose");
const bp = require("body-parser");
const app = express();
const nodemailer = require("nodemailer");
const axios = require("axios");
app.use(bp.json());
app.use(
  bp.urlencoded({
    extended: true,
  })
);

app.use(express.static(__dirname + "/public"));
// const db =
//   "mongodb+srv://Srezz:E0Y550F4bZhiXLeX@cluster0-oshu0.mongodb.net/vinpreptest?retryWrites=true&w=majority";
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
  message: String,
});

var registrationSchema = new mongoose.Schema({
  fullname: String,
  phnumber: Number,
  email: String,
  regno: String,
  saw: String,
  skills: String,
});

var contact = mongoose.model("contact", contactSchema);
var token = mongoose.model("token", tokenSchema);
var message = mongoose.model("message", messageSchema);
var Registration = mongoose.model("registration", registrationSchema);

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

app.get("/register", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.get("/admin", function (req, res) {
  res.sendFile(__dirname + "/admin.html");
});

app.post("/register", function (req, res) {
  console.log(req.body);
  Registration.create(
    {
      fullname: req.body.fullname,
      phnumber: req.body.phnumber,
      email: req.body.email,
      regno: req.body.regno,
      saw: req.body.saw,
      skills: req.body.skills,
    },
    function (err, newlyCreated) {
      if (err) {
        console.log(err);
      } else {
        console.log(newlyCreated);
      }
    }
  );
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
      message: req.body.message,
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

app.post("/addtoken", async function (req, res) {
  const present = await token.find({ token: req.body.token });
  console.log(present);
  if (present.length === 0)
    token.create(
      {
        token: req.body.token,
      },
      function (err, yolo) {
        if (err) {
          console.log("DATA IS NOT PUSHED");
        } else {
          console.log("DATA HAS BEEN PUSHED");
          res.send(yolo);
        }
      }
    );
});

app.post("/notify", async (req, res) => {
  const { body, title, pass } = req.body;
  const tokens = await token.find({});
  console.log(tokens);
  let ids = [];
  for (var i = 0; i < tokens.length; i++) {
    ids.push(tokens[i].token);
  }
  console.log(ids);
  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization:
        "key=AAAAfSu9KPY:APA91bEyg2KcRMO8l3D-k3VxHS1VH0zxfq4sFpRuR3n3hUQ3qbojB-joRRadi4xh7HpCiMgtAmonwOSDhzG8kBFjqN72NDBbt-bk7_YscADvaBlQKlgwkpEsaRFJfMiz3-rk2CgSlPhd",
    },
  };
  const data = {
    registration_ids: ids,
    notification: {
      sound: "default",
      icon:
        "https://res.cloudinary.com/sankarkvs/image/upload/v1606459312/logo512_l4n6kc.png",
      body: body,
      title: title,
      content_available: true,
      priority: "high",
    },
    data: {
      sound: "default",
      body: body,
      title: title,
      content_available: true,
      priority: "high",
    },
  };
  if (pass == "sankar123")
    axios
      .post("https://fcm.googleapis.com/fcm/send", data, config)
      .then((res) => console.log("done"))
      .catch((err) => console.log(err));
  res.sendFile(__dirname + "/admin.html");
});

app.post("/mail", async (req, res) => {
  const { output, pass } = req.body;
  let emails = await Registration.find({});
  let email = [];
  if (pass === "sankar123")
    for (var i = 0; i < emails.length; i++) email.push(emails[i].email);
  console.log(email);
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail", // true for 465, false for other ports
    auth: {
      user: "miniorganisation@gmail.com", // generated ethereal user
      pass: "sankarvishnu23", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `<vinnovateit@gmail.com>`, // sender address
    to: email, // list of receivers
    subject: "Updates on Vinprep from VinnovateIT", // Subject line
    text: "Vinprep", // plain text body
    html: output, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  res.redirect("/admin");
});

app.listen(process.env.PORT || 1111, function () {
  console.log("SERVER 8000 HAS STARTED");
});
