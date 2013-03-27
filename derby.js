var socket = io.connect('http://localhost');
var stack = []; 
var derby = new Object();
var ready = false;

function DerbyState(obj){
	this.status = obj.status;
	this.cats = obj.cats;
	this.trackLength = obj.trackLength;
	
    function updateCats(){
        for(var i in derby.cats){
            if((derby.cats[i].coordinate < derby.trackLength) && (derby.status == 'on')){
                var time = new Date().getTime();
                if(derby.cats[i].lastupdate){
                    derby.cats[i].delta = time - derby.cats[i].lastupdate;
                    derby.cats[i].coordinate += derby.cats[i].speed * derby.cats[i].delta;
                }
                else{
                    derby.cats[i].coordinate += derby.cats[i].speed * (1000/60);
                }
                derby.cats[i].lastupdate = time;
                document.getElementById("track"+i).innerHTML=Math.floor(derby.cats[i].coordinate);
            }
            else{
                derby.cats[i].lastupdate = 0;
                derby.cats[i].delta = 0;
            }
        }
        setTimeout(updateCats,1000 / 60);
    }
    updateCats();
}
			
socket.on('race', function (data) {
	var cps = JSON.parse(data);
	derby.cats[cps.track].coordinate = cps.coordinate;
	derby.cats[cps.track].speed = cps.speed;
});

socket.on('connect', function (data) {
	derby = new DerbyState(JSON.parse(data));
	init();
});

socket.on('update', function (data) {
	var temp = JSON.parse(data);
	derby.status = temp.status;
	for(var i in derby.cats){
		derby.cats[i] = temp.cats[i];
	}
});

window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
	window.webkitRequestAnimationFrame || 
	window.mozRequestAnimationFrame    || 
	window.oRequestAnimationFrame      || 
	window.msRequestAnimationFrame     || 
		function(/* function */ callback, /* DOMElement */ element){
		window.setTimeout(callback, 1000 / 60);
	};
})();

var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

animate();

function init() {
	for (var i = 0; i < 6; i++) {    
			var img = new Image();
			img.src = 'pics/' + i + '.png'; 
			stack.push(img);
			img.onload = (function(value){
				return function(){
					context.drawImage(stack[value], 0, 0+(value*100), 80, 80);
				}
			})(i);
	}
	ready = true;
}

function animate() {
	requestAnimFrame( animate );
	draw();
}

function draw() {
	if(ready){
		context.clearRect(0, 0, canvas.width, canvas.height);
		for (var i = 0; i < 6; i++){
			context.drawImage(stack[i], derby.cats[i].coordinate/10, 0+(i*100), 80, 80);
		}
	}
}