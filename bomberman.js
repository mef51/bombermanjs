#!/usr/local/bin/node

var net = require('net');

Actions = {
    up: "up\n",
    down: "down\n",
    left: "left\n",
    right: "right\n",
    bomb: "bomb\n"
};

var ip = '0.0.0.0';
var port = 40000;
var numUpdates = 0;

var client = new net.Socket();
client.connect(port, ip, function() {
    console.log('Connected');
    client.write(Actions.bomb);
});

client.on('data', function(data) {

});

client.on('close', function() {
    console.log('Connection closed');
});
