var WebSocket = require('ws');
var ws = new WebSocket('ws://localhost:8080');

ws.on('message', function(message) {
	console.log('received: %s', message);
    // flags.binary will be set if a binary data is received
    // flags.masked will be set if the data was masked
});
ws.on('close')