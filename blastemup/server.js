const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


app.get("/", function (request, response) {
  response.sendFile(__dirname + '/dist/index.html');
});

app.use('/',express.static('dist'))

http.listen(5000, function(){
  console.log('Server ready, listening on port ', 5000);
});

const players = {};

io.on('connection', function(socket){

	socket.on('newPlayer',function(newPlayer){
		console.log("New player joined with state:", newPlayer);
    const [name, key] = newPlayer.name.split(":");
		players[key] = newPlayer;

    socket.emit('currentPlayers', players);
    socket.broadcast.emit('newPlayer', newPlayer);
	})

  socket.on('playerDisconnected',function(key){
    delete players[key];
    console.log("Serve > player destroyed: ", key)
    socket.broadcast.emit('playerDisconnected', key);
  })

  socket.on('playerIsMoving',function(position_data){
    console.log("Server> playerMoved> Player moved to ", position_data);
    const key = position_data?.key;
    if(players[key] == undefined) return;
    players[key].x = position_data.x;
    players[key].y = position_data.y;
    players[key].rotation = position_data.rotation;

    socket.broadcast.emit('playerMoved', players[key]);
  })

})