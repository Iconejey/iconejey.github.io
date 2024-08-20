const express = require('express');
const app = express();

// Serve index.html
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

// Serve style.css
app.get('/style.css', (req, res) => {
	res.sendFile(__dirname + '/style.css');
});

// Serve src/
app.use('/src', express.static('src'));

// serve res/
app.use('/res', express.static('res'));

// Start server
app.listen(8001, () => console.log('Server started on http://localhost:3000'));
