var test = new derbyStateMachine("Komeetanpoika","Tähtiäinen");
function derbyStateMachine(){
  var defaultNames = ["Nemo", "Pongo", "Tyyne", "Silkkihieno", "Sirius", "Growltiger"];
	var cats = [];
	var tracklength = 5000;
	var coordinateUpdateInterval = 100;
	var speedUpdateInterval = 2000;
	function Cat(name){
		this.name = name;
		this.speed = 0;
		this.coordinate = 0;
		this.finished = false;
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
	function randomizeCatSpeed(cat){
		cat.speed = Math.random()
		console.log("Speed change:"+cat.name+":"+cat.speed+":"+cat.coordinate);
	}
	function setCatCoordinate(cat,coordinateUpdateInterval){
		cat.coordinate += cat.speed * coordinateUpdateInterval;
		console.log("Coordinate:"+cat.name+" "+cat.coordinate);
	}
	function raceOn(cat){
		var previousTime = new Date();
		var startTime = new Date();
		var speed = setInterval(function(){randomizeCatSpeed(cat)},Math.random()*speedUpdateInterval);
		var coordinate = setInterval(function(){setCatCoordinate(cat,coordinateUpdateInterval);finishedTest()},coordinateUpdateInterval);
		function finishedTest(){
			if(cat.coordinate > tracklength){
				clearInterval(speed);
				clearInterval(coordinate);
				cat.finished = true;
				console.log("Finished: "+ cat.name +" Time:"+(new Date()-startTime));
			}
		}
	}
	for(var i = 0; i < cats.length; i++){
		raceOn(cats[i]);
		console.log(cats[i].name+" started.");
	}
}

	
	

