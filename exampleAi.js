#!/usr/local/bin/node

bomberman = require('./bomberman');

// an example ai using the client
var ip = '0.0.0.0';
var port = 40000;

// create a player. The constructor connects to the server and then calls the function you pass it.
var player = new bomberman.Player(ip, port, function(){
    console.log("playing...");

    // every 500ms pick a move
    move = function() {
        if(player.isAlive()) {
            play();
        }
        else {
            console.log("Game over!");
            player.quit();
        }
        setTimeout(move, player.getTurnDuration());
    };

    setTimeout(move, 250);
});

// pick a move randomly
zzz = function() {
    roll = Math.random();
    if(roll < 1/4) player.goUp();
    if(roll < 2/4) player.goDown();
    if(roll < 3/4) player.goLeft();
    if(roll < 4/4) player.goRight();
};

// pick the move that takes you furthest
// based on the ai in https://github.com/uiri/bombermanpy
play = function() {

    var directions = [player.goUp, player.goDown, player.goLeft, player.goRight];
    function scoreMove(board, move, x, y, n){
        if(n >= 10){
            return 0;
        }

        // get new position
        if(move == player.goUp)
            y -= 1;
        if(move == player.goDown)
            y += 1;
        if(move == player.goLeft)
            x -= 1;
        if(move == player.goRight)
            x += 1;

        if(y == 0 || x == 0){
            return 0;
        }
        if(y == board[x-1].length - 1 || x == board.length - 1){
            return 0;
        }
        if(board[x][y]['Name'] != "Ground"){
            return 0;
        }

        var retVal = 1;
        if(board[x-1][y]['Name'] == "Ground")
            retVal += 1;
        if(board[x+1][y]['Name'] == "Ground")
            retVal += 1;
        if(board[x][y-1]['Name'] == "Ground")
            retVal += 1;
        if(board[x][y+1]['Name'] == "Ground")
            retVal += 1;

        for(var i = 0; i < directions.length; i++){
            var nextmove = directions[i];
            if(nextmove == player.up && move == player.down || nextmove == player.down && move == player.up ||
                nextmove == player.left && move == player.right || nextmove == player.right && move == player.left){
                // do nothing
            }
            else {
                retVal += scoreMove(board, nextmove, x, y, n+1);
            }
        }
        return retVal;
    }

    if(player.data){
        var pos = player.getPos();
        var board = player.getBoard();
        var bestScore = 0;
        var bestMove = 0; //an index for `directions` array
        for(var i = 0; i < directions.length; i++){
            var move = directions[i];
            var score = scoreMove(board, move, pos.x, pos.y, 0);
            if(score > bestScore){
                bestScore = score;
                bestMove = i;
            }
        }
        directions[bestMove](player);
    }

};

