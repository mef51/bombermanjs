#!/usr/local/bin/node

var net = require('net');

Actions = {
    up: "up\n",
    down: "down\n",
    left: "left\n",
    right: "right\n",
    bomb: "bomb\n"
};

function Player(ip, port, done) {
    self = this;
    this.socket = new net.Socket();
    this.updateString = "";

    this.socket.connect(port, ip, function() {
        console.log("Connected.");
        done();
    });

    this.socket.on('data', function(data) {
        self.updateString += data;
        console.log('' + data);
    });

    this.socket.on('close', function() {
        console.log('Connection closed');
        this.destroy();
    });

    this.socket.on('error', function(e) {
        console.error(e);
        this.destroy();
    });
}

// low level
Player.prototype.send = function(s){
    this.socket.write(s);
};

Player.prototype.goUp = function(){
    this.send(Actions.up);
};

Player.prototype.goDown = function(){
    this.send(Actions.down);
};

Player.prototype.goLeft = function(){
    this.send(Actions.left);
};

Player.prototype.goRight = function(){
    this.send(Actions.right);
};

Player.prototype.plant = function(){
    this.send(Actions.bomb);
};

var ip = '0.0.0.0';
var port = 40000;
var player = new Player(ip, port, function(){
    setInterval(function(){
        roll = Math.random();
        if(roll < 1/4) player.goUp();
        if(roll < 2/4) player.goDown();
        if(roll < 3/4) player.goLeft();
        if(roll < 4/4) player.goRight();
    }, 500);
});

