const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { Client, LegacySessionAuth } = require('whatsapp-web.js');

// Path where the session data will be stored
const SESSION_FILE_PATH = 'session.json';

// Load the session data if it has been previously saved
let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

// Use the saved values
const client = new Client({
    authStrategy: new LegacySessionAuth({
        session: sessionData
    })
});

// Save session values to the file upon successful auth
client.on('authenticated', (session) => {
    sessionData = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
        if (err) {
            console.error(err);
        }
    });
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


