var io = require('socket.io').listen(80);
io.set('log level', 1);
io.sockets.on('connection', function (socket) {
    sendUpdate('connect');
});

function sendToClients(data) {
    var send = {"track":data[0],"speed":data[1],"coordinate":data[2],"status":data[3]};
    io.sockets.emit('race',JSON.stringify(send));
}

function sendUpdate(channel) {
    io.sockets.emit(channel,JSON.stringify(derby.stats()));
}

var derby = new DerbyStateMachine();
function DerbyStateMachine(){
	var defaultNames = ["Nemo", "Misse", "Tyyne", "Silkkihieno", "Sirius", "Growltiger"];
	var cats = [];
	var trackLength = 9500;
	var coordinateUpdateInterval = 100;
	var catsInGoal = 0;
	var raceEndDelay = 10000;
	var raceStartDelay = 5000;
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
		for(var j = 0; j < defaultNames.length; j++){
			cats[j] = new Cat(defaultNames[j]);
			cats[j].track = j;
		}
		
	}
	this.stats = function(){
		return {"status":status,
			"cats":cats,
			"trackLength":trackLength
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

    /*
	function randomizeCatSpeed(cat){
		cat.speed = Math.random()/2;
		sendToClients([cat.track,cat.speed,cat.coordinate,status]);
	}
	*/

	function setCatCoordinate(cat,coordinateUpdateInterval){
		if(cat.coordinate < trackLength) {
            cat.coordinate += cat.speed * coordinateUpdateInterval;
            //sendToClients([cat.track,cat.speed,cat.coordinate,status]);
        }
	}
	
	function randomizer(){
		var randomTrack = Math.floor(Math.random()*cats.length);
        var randomSpeed = Math.random()/2;
        cats[randomTrack].speed = randomSpeed;
        if(cats[randomTrack].coordinate < trackLength) {
            sendToClients([randomTrack,randomSpeed,cats[randomTrack].coordinate,status]);
        }
        if(status == 'on'){
            setTimeout(randomizer,Math.floor(Math.random()*1000));
        }
    }
	
	function raceOn(cat){
        var startTime = new Date();
        /*
		var previousTime = new Date();
		var speed = setInterval(function(){
				randomizeCatSpeed(cat)
				},speedUpdateInterval);
		*/
		var coordinate = setInterval(function(){
				setCatCoordinate(cat,coordinateUpdateInterval);
                finishedTest();
				},coordinateUpdateInterval);
		function finishedTest(){
			if(cat.coordinate > trackLength){
				cat.lastRaceTime = (new Date()-startTime);
				clearInterval(coordinate);
				catsInGoal++;
				if(catsInGoal == cats.length){
					raceOff();
				}
			}
		}
	}
	
	function raceOff(){
		status="off";
		/*for(var i = 0; i < cats.length; i++){
			//sendToClients(cats[i].name+" time:"+_millisecondsToStr(cats[i].lastRaceTime));
			}
		*/
        sendUpdate('update');
		setTimeout(function() {raceSetup()},raceEndDelay);
	}
	
	function raceSetup(){
		status = "setup";
		catsInGoal = 0;
		for(var i in cats) {
			cats[i].speed = 0;
			cats[i].coordinate = 0;
            sendToClients([i,0,0,status]);
		}
		setTimeout(function() {
			for(var i = 0; i < cats.length; i++){
				raceOn(cats[i]);
			}
			status="on";
            sendUpdate('update');
            randomizer();
		},raceStartDelay);
	}
	raceSetup();
}




