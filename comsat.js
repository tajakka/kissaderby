var io = require('socket.io').listen(80);

io.sockets.on('connection', function (socket) {
	socket.emit('connect',JSON.stringify(derby.stats()));
});

sendToClients = function (data) {
	var send = {"track":data[0],"speed":data[1],"coordinate":data[2]};
	io.sockets.emit('race',JSON.stringify(send));
};

sendUpdate = function () {
	io.sockets.emit('update',JSON.stringify(derby.stats());
};
