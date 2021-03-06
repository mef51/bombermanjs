
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
    this.data = {};

    this.socket.connect(port, ip, function() {
        console.log("Connected.");
        done();
    });

    this.socket.on('data', function(data) {
        self.updateString += data;
        if(data.toString().indexOf('\n\n') > -1){
            bufferArray = self.updateString.split('\n\n');
            bufferString = bufferArray[0];
            nextBufferString = bufferArray[1];
            try {
                self.data = JSON.parse(bufferString);
                self.updateString = nextBufferString;
                // console.log("[log] got a new update");
            }
            catch(e) {
                // console.error("[error] got a bad JSON string"); // but it's probably fine
                self.updateString = "";
            }
        }
    });

    this.socket.on('close', function() {
        console.log('Connection closed.');
        this.destroy();
    });

    this.socket.on('error', function(e) {
        console.error(e);
        this.destroy();
    });
}

// Send stuff down da line. low level
Player.prototype.send = function(s){
    if(this.socket){
        this.socket.write(s);
    }
};

Player.prototype.goUp    = function(obj){ obj.send(Actions.up);    };
Player.prototype.goDown  = function(obj){ obj.send(Actions.down);  };
Player.prototype.goLeft  = function(obj){ obj.send(Actions.left);  };
Player.prototype.goRight = function(obj){ obj.send(Actions.right); };
Player.prototype.plant   = function(obj){ obj.send(Actions.bomb);  };

// Get data by field. low level
Player.prototype.getData = function(field) {
    if(this.data){
        return this.data[field];
    }
    else {
        return undefined;
    }
};

// returns the turn duration in milliseconds.
Player.prototype.getTurnDuration = function(){
    return this.getData('TurnDuration')/1000000;
};

Player.prototype.getPos = function() {
    return {x: this.getData('X'), y: this.getData('Y')};
};

Player.prototype.getBoard = function() {
    return this.getData('Board');
};

Player.prototype.isAlive = function() {
    return this.getData('Alive');
};

Player.prototype.bombs = function() {
    return {
        numBombs : this.getData('Bombs'),
        radius   : this.getData('Radius'),
        maxBombs : this.getData('MaxBomb')
    };
};

Player.prototype.quit = function() {
    console.log("Quitting.");
    this.socket.destroy();
    process.exit();
}

exports.Player = Player;
exports.Actions = Actions;
