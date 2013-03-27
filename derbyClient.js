var socket = io.connect('http://localhost');
var imagesLoaded=0;
var stack = [];
var derby = new Object();
var ready = false;

function DerbyState(obj){
    this.status = obj.status;
    this.cats = obj.cats;
    this.tracklenght = obj.tracklenght;
    this.coordinateUpdateInterval = obj.coordinateUpdateInterval;
    this.raceEndDelay = obj.raceEndDelay;
    this.raceStartDelay = obj.raceStartDelay;

    this.cps = function(){
        return cats;
    };

    setInterval(function(){
        for(var i = 0; i < derby.cats.length; i++){
            if ((derby.cats[i].coordinate < derby.tracklenght) && (derby.status == 'on')) {
                derby.cats[i].coordinate += Math.floor(derby.cats[i].speed * 100);
                document.getElementById("track" + i).innerHTML = Math.floor(derby.cats[i].coordinate).toString();
            }
        }
    },100);
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
        derby.cats = temp.cats;
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
        var time = new Date().getTime() * 0.002;
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < 6; i++){
            context.drawImage(stack[i], derby.cats[i].coordinate/10, 0+(i*100), 80, 80);
        }
    }
}