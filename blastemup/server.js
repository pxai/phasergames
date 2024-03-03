const express = require('express'); // Express contains some boilerplate to for routing and such
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http); // Here's where we include socket.io as a node module


app.get("/", function (request, response) {
  response.sendFile(__dirname + '/dist/index.html');
});

app.use('/',express.static('dist'))

app.set('port', 5000);
http.listen(app.get('port'), function(){
  console.log('listening on port',app.get('port'));
});

const players = {};

io.on('connection', function(socket){

	socket.on('newPlayer',function(state){
		console.log("New player joined with state:", socket.id, Object.keys(players), state);
    const [name, key] = state.name.split(":");
		players[key] = state;

    socket.emit('currentPlayers', players);
    socket.broadcast.emit('newPlayer', state);
	})

  socket.on('playerDisconnected',function(key){
    delete players[key];
    console.log("Serve > player destroyed ", key)
    socket.broadcast.emit('playerDisconnected', key);
  })

  socket.on('playerIsMoving',function(position_data){

    console.log("Server> playerMoved> Player moved to ", socket.id, Object.keys(players), position_data);
    const playerId = position_data?.key;
    if(players[playerId] == undefined) return;
    players[playerId].x = position_data.x;
    players[playerId].y = position_data.y;
    players[playerId].rotation = position_data.rotation;

    socket.broadcast.emit('playerMoved',players[playerId]);
  })

})