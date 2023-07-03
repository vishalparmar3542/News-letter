const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
require("dotenv").config();
const https = require("https");
//app.use(express.static("public"));
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.post("/", (req, res) => {
  const fname = req.body.Firstname;
  const lname = req.body.Lastname;
  const email = req.body.email;
  const message = req.body.message;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname,
        },
        contact: {
          address1: message,
        },
      },
    ],
  };
  const auth_id = process.env.AUTH_TOKEN;
  console.log(auth_id);
  const JSONdata = JSON.stringify(data);
  const url = `https://us13.api.mailchimp.com/3.0/lists/05283b704c`;
  const options = {
    method: "POST",

  auth: `VISHAL:${auth_id }`,
  };
  const request = https.request(url, options, (response) => {
    response.on("data", (data) => {
      console.log(JSON.parse(data));
      if (response.statusCode == 200) {
        res.sendFile(__dirname + "/success.html");
        // res.send(`${data}`);
        //res.send(`${data} id ${auth_id}`);
      } else {
        res.sendFile(__dirname + "/faliure.html");
        // res.send(`${data} id ${auth_id}`);
      }
    });
  });
  request.write(JSONdata);
  request.end();
});

app.listen(process.env.PORT || 3001, () => {
  console.log("started");
});

//id:05283b704c
