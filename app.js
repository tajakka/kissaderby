var WebSocketServer = require('ws').Server
  , ws = new WebSocketServer({port: 8080});

    ws.on('derp', function(message) {
		setInterval(function(){ws.send('something')},1000);
    });
