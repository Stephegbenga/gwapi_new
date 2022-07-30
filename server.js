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


const PORT = process.env.PORT || 8080;

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

app.use(express.static('public'));

app.use(express.json()); 



const client = new Client({
  authStrategy: new LocalAuth()
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

// create a function



client.on('message_create', (msg) => {
  if(msg.fromMe){
  var data = JSON.stringify({
    "number": `${msg.to.split('@')[0]}`,
    "message":`${msg.body}`,
    "timestamp": msg.timestamp,
    "fromMe": msg.fromMe
  });

  var config = {
    method: 'post',
    url: 'http://127.0.0.1:3000/detectintent',
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




client.on('message', msg => {
  console.log(`${msg.from} on message`)
  if (!msg.isStatus && msg.from.length != 23 && !msg.hasMedia) {
    var data = JSON.stringify({
      "number": `${msg.from.split('@')[0]}`,
      "message":`${msg.body}`,
      "timestamp": msg.timestamp,
      "fromMe": msg.fromMe
    });

    var config = {
      method: 'post',
      url: 'http://127.0.0.1:3000/detectintent',
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
    const numbers = req.body.numbers
    const message = req.body.message

    for (number of numbers) {
      // check if the first three character is 852 or 234
      if (number.substring(0, 3) == "852" || number.substring(0, 3) == "234") {
        client.sendMessage(`${number}@c.us`, message).catch(error => {
          console.log(error.message);
        });
      
      }else{
        client.sendMessage(`852${number}@c.us`, message).catch(error => {
          console.log(error.message);
        });
      }
    }
    res.send({
      "message": "success"
    })
  } catch (error) {
    console.log(error.message)
  }
});


app.post("/webhookmsg", async (req, res) => {
  console.log(req.body)
  var session = req.body.session
  var webhook_text = "Please type the *number* of the enquiry listed below so we can better serve you.\n\n\
\
1 Enquiry about existing group class membership\n\
2 Enquiry about existing private class membership\n\
3 Enquiry about ongoing /current teacher training course\n\
4 Enquiry about completed /past teacher training course\n\
5 Issues with Mindbody Booking system\n\
6 Other enquiry / feedbacks\n\n\
\
Interested in purchasing Memberships, Teacher Training, other services You can contact our sales staff by clicking the Business WhatsApp Sales Support Link. https://wa.me/message/7NHC3NCBKHRNB1\n\n\
\
Please type *STAFF* to chat with a live staff and the staff will respond to your query in a sequential order during the office opening hours.\n\n\
\
Please type *Restart* to go back to main menu or type End to end this chat and if your enquiry has been addressed or acknowledged "
var webhook_msg = {
  "fulfillmentMessages": [
    {
      "text": {
        "text": [
          webhook_text
        ]
      }
    }
  ],"outputContexts": [
    {
      "name": `${session}/contexts/__system_counters__`,
      "lifespanCount": 1
    },
    {
      "name": `${session}/contexts/option1-followup`,
      "lifespanCount": 0
    },{
      "name": `${session}/contexts/option3-followup`,
      "lifespanCount": 0
    },
    {
      "name": `${session}/contexts/option4-followup`,
      "lifespanCount": 0
    }
  ]
}
res.send(webhook_msg)

});




app.listen(PORT, () => {
  console.log(`Server is up and running at ${PORT}`);
});



