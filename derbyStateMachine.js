var test = new derbyStateMachine("Komeetanpoika","Tähtiäinen");
function derbyStateMachine(){
	var defaultNames = ["Nemo", "Pongo", "Tyyne", "Silkkihieno", "Sirius", "Growltiger"];
	var cats = [];
	var tracklength = 5000;
	var coordinateUpdateInterval = 100;
	var speedUpdateInterval = 4000;
	var catsInGoal = 0;
	function Cat(name){
		this.name = name;
		this.speed = 0;
		this.coordinate = 0;
		this.lastRaceTime = 0;
	}
	if(arguments.length != 0){
		for(var i = 0; i < arguments.length; i++){
			cats[i] = new Cat(arguments[i]);
		}
	}
	else{
		for(var i = 0; i < defaultNames.length; i++){
			cats[i] = new Cat(defaultNames[i]);
		}
	}
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
		cat.speed = Math.random()
		console.log("Speed change "+cat.name+":"+cat.speed+", Coordinate:"+cat.coordinate);
	}
	function setCatCoordinate(cat,coordinateUpdateInterval){
		cat.coordinate += cat.speed * coordinateUpdateInterval;
		//console.log("Coordinate:"+cat.name+" "+cat.coordinate);
	}
	function raceOn(cat){
		var previousTime = new Date();
		var startTime = new Date();
		var speed = setInterval(function(){randomizeCatSpeed(cat)},Math.random()*speedUpdateInterval);
		var coordinate = setInterval(function(){setCatCoordinate(cat,coordinateUpdateInterval);finishedTest()},coordinateUpdateInterval);
		function finishedTest(){
			if(cat.coordinate > tracklength){
				cat.lastRaceTime = (new Date()-startTime);
				clearInterval(speed);
				clearInterval(coordinate);
				console.log("Finished: "+ cat.name +" Time:"+cat.lastRaceTime);
				catsInGoal++;
				if(catsInGoal == cats.length){
					raceOff();
				}
			}
		}
	}
	function raceOff(){
		for(var i = 0; i < cats.length; i++){
			console.log(cats[i].name+" time:"+_millisecondsToStr(cats[i].lastRaceTime));
			}
		setTimeout(function() {raceSetup()},10000);	
	}
	function raceSetup(){
		catsInGoal = 0;
		for(i in cats) {
			cats[i].speed = 0;
			cats[i].coordinate = 0;
		}
		setTimeout(function() {
			for(var i = 0; i < cats.length; i++){
				raceOn(cats[i]);
				console.log(cats[i].name+" started.")
			};
		},2000);
	}
	raceSetup();
}

	
	

