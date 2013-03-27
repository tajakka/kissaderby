var derby = new derbyStateMachine();

function derbyStateMachine(){
	var defaultNames = ["Nemo", "Misse", "Tyyne", "Silkkihieno", "Sirius", "Growltiger"];
	var cats = [];
	var tracklength = 9500;
	var coordinateUpdateInterval = 100;
	var speedUpdateInterval = 2500;
	var catsInGoal = 0;
	var raceEndDelay = 10000;
	var raceStartDelay = 2000;
	var status = "setup";
	function Cat(name){
		this.name = name;
		this.speed = 0;
		this.coordinate = 0;
		this.lastRaceTime = 0;
	}
	if(arguments.length != 0){
		for(var i = 0; i < arguments.length; i++){
			cats[i] = new Cat(arguments[i]);
			cats[i].track = i;
		}
	}
	else{
		for(var i = 0; i < defaultNames.length; i++){
			cats[i] = new Cat(defaultNames[i]);
			cats[i].track = i;
		}
		
	}
	this.stats = function(){
		return {"status":status,
			"cats":cats,
			"tracklenght":tracklength,
			"coordinateUpdateInterval":coordinateUpdateInterval,
			"raceEndDelay":raceEndDelay,
			"raceStartDelay":raceStartDelay
			}
	};
	
	function _millisecondsToStr(milliseconds){
    // TIP: to find current time in milliseconds, use:
    // var milliseconds_now = new Date().getTime();
		var seconds = milliseconds / 1000;
		var numyears = Math.floor(seconds / 31536000);
		if(numyears){
			return numyears + ' year' + ((numyears > 1) ? 's' : '');
		}
		var numdays = Math.floor((seconds % 31536000) / 86400);
		if(numdays){
			return numdays + ' day' + ((numdays > 1) ? 's' : '');
		}
		var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
		if(numhours){
			return numhours + ' hour' + ((numhours > 1) ? 's' : '');
		}
		var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
		if(numminutes){
			return numminutes + ' minute' + ((numminutes > 1) ? 's' : '');
		}
		var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
		if(numseconds){
			return numseconds + ' second' + ((numseconds > 1) ? 's' : '');
		}
		return 'less then a second'; //'just now' //or other string you like;
	}
	
	function randomizeCatSpeed(cat){
		cat.speed = Math.random()/2;
		sendToClients([cat.track,cat.speed,cat.coordinate,status]);
	}
	
	function setCatCoordinate(cat,coordinateUpdateInterval){
		cat.coordinate += cat.speed * coordinateUpdateInterval;
	}
	
	function randomizer(){
		if(status == 'on'){
			var randomTrack = Math.floor(Math.random()*cats.length);
			var randomSpeed = Math.random()/2;
			cats[randomTrack].speed = randomSpeed;
			sendToClients([randomTrack,randomSpeed,cats[randomTrack].coordinate,status]);
			setTimeout(randomizer,1000);
			};
		};
	
	function raceOn(cat){
		var previousTime = new Date();
		var startTime = new Date();
		var speed = setInterval(function(){
				randomizeCatSpeed(cat)
				},speedUpdateInterval);
		var coordinate = setInterval(function(){
				setCatCoordinate(cat,coordinateUpdateInterval);finishedTest()
				},coordinateUpdateInterval);
		function finishedTest(){
			if(cat.coordinate > tracklength){
				cat.lastRaceTime = (new Date()-startTime);
				clearInterval(speed);
				clearInterval(coordinate);
				//sendToClients("Finished: "+ cat.name +" Time:"+cat.lastRaceTime);
				catsInGoal++;
				if(catsInGoal == cats.length){
					raceOff();
				}
			}
		}
	}
	
	function raceOff(){
		status="off"
		for(var i = 0; i < cats.length; i++){
			//sendToClients(cats[i].name+" time:"+_millisecondsToStr(cats[i].lastRaceTime));
			};
		setTimeout(function() {raceSetup()},raceEndDelay);	
	};
	
	function raceSetup(){
		status = "setup";
		catsInGoal = 0;
		for(i in cats) {
			cats[i].speed = 0;
			cats[i].coordinate = 0;
		};
		setTimeout(function() {
			for(var i = 0; i < cats.length; i++){
				raceOn(cats[i]);
			};
			status="on";
			sendUpdate('update');
		},raceStartDelay);
	};	
	raceSetup();
	randomizer();
};

var io = require('socket.io').listen(80);
io.set('log level', 1);

io.sockets.on('connection', function (socket) {
	sendUpdate('connect');
});

function sendToClients(data) {
	var send = {"track":data[0],"speed":data[1],"coordinate":data[2]};
	io.sockets.emit('race',JSON.stringify(send));
};

function sendUpdate(channel) {
	io.sockets.emit(channel,JSON.stringify(derby.stats()));
};


