// server.js or app.js
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));


app.get('/', (req, res) => {
    res.send('Hello World!');
});


//Start the server
app.listen(PORT, () => {
    console.log(`Server is up and running at ${PORT}`);
});