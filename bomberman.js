#!/usr/local/bin/node

var net = require('net');

Actions = {
    up: "up\n",
    down: "down\n",
    left: "left\n",
    right: "right\n",
    bomb: "bomb\n"
};

function Player(ip, port) {
    this.socket = new net.Socket();

    this.socket.connect(port, ip, function() {
        console.log('Connected');
        this.write(Actions.bomb);
    });

    this.socket.on('data', function(data) {
        console.log(data);
    });

    this.socket.on('close', function() {
        console.log('Connection closed');
    });

    this.socket.on('error', function(e) {
        console.error(e);
    });
}

var ip = '0.0.0.0';
var port = 40000;
var player = new Player(ip, port);
