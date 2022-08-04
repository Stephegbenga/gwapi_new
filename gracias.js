const {
  Client,
  Location,
  List,
  Buttons,
  LocalAuth
} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require("express");
const axios = require('axios');

var fs = require('fs');


const app = express();


const PORT = process.env.PORT || 5000;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// parse request to body-parser
app.use(
  express.urlencoded({
    extended: true,
  })
);


app.use(express.json()); 



const client = new Client({
  authStrategy: new LocalAuth({ clientId: "gracias" })
});

client.initialize();


client.on('qr', (qr) => {
  // NOTE: This event will not be fired if a session is specified.
  console.log('QR RECEIVED', qr);
  qrcode.generate(qr, {
    small: true
  });
});

client.on('authenticated', () => {
  console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
  uccessful
  console.error('AUTHENTICATION FAILURE', msg);
});




client.on('ready', () => {
  console.log('READY');
});




client.on('message', msg => {

  if (!msg.isStatus && msg.from.length != 23 && !msg.hasMedia) {
    var data = JSON.stringify({
      "number": `${msg.from.split('@')[0]}`,
      "message":`${msg.body}`,
      "timestamp": msg.timestamp,
      "fromMe": msg.fromMe,
      "notifyName": msg.notifyName
    });

    var config = {
      method: 'post',
      url: 'http://127.0.0.1:5001/detectintent',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };
 
    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error.message);
      });
  }

});

app.get("/", async (req, res) => {
  res.send("Second Whatsapp Api");
});


app.get("/kill", async (req, res) => {
  process.exit()
});


app.post("/sendmessage", async (req, res) => {
  try {
    let number = req.body.number;
    let message = req.body.message;
      var symbolsremoved = number.replace(/\D/g, '');
      // check if the first three letter from formatted_number is 852
    
      client.sendMessage(`${symbolsremoved}@c.us`, message).catch(function (error) {
      console.log(error.message);
    });
    res.send({
      "message": "success"
    })
  } catch (error) {
    console.log(error.message)
    console.log("An error occurred")
  }
});




app.listen(PORT, () => {
  console.log(`Server is up and running at ${PORT}`);
});

