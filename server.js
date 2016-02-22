var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = process.env.PORT || 3000;


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');

});

io.on('connection', function(socket){


    socket.on('chat message', function(msg){
    console.log('message: ' + msg);
   io.emit('chat message',socket.name + ':' + msg);
  });

   socket.on('join', function(name){
      socket.name = name;
      socket.broadcast.emit('chat message',name+' connected');
      console.log('user connected' +name);
   }); 

   socket.on('disconnect', function(){
    if(socket.name !== undefined){
    console.log('user disconnected');
    socket.broadcast.emit('chat message', socket.name + ' has disconnected from the chat. ');
  }
  });
});


http.listen(port, function(){
  console.log('listening on *:3000');

});


